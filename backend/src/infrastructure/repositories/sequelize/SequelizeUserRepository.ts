import {Attributes, DataTypes, Model, Op, QueryTypes, Sequelize} from 'sequelize';
import {UserRepository} from "../../../application/repositories/UserRepository";
import {User} from "cinetex-core/dist/domain/entities/User";
import {UsersQuery} from "cinetex-core/dist/application/queries";
import {bracket, rawPredicate, removeNulls, sequelizePredicate} from "./SequelizeUtils";
import {WhereOptions} from "sequelize/types/model";
import dedent from "dedent";
import {Credentials} from "cinetex-core/dist/security/Credentials";
import {TheatreModel} from "./SequelizeTheatreRepository";

const UserAttributes: Attributes<Model> = {
    id: {type: DataTypes.STRING, allowNull: false, primaryKey: true},
    email: {type: DataTypes.STRING, allowNull: false, unique: true },
    password: {type: DataTypes.STRING, allowNull: false},
    emailVerified: {type: DataTypes.BOOLEAN, allowNull: false},
    firstName: {type: DataTypes.STRING, allowNull: true},
    lastName: {type: DataTypes.STRING, allowNull: true},
    phoneNumber: {type: DataTypes.STRING, allowNull: true}
}

const RoleAttributes: Attributes<Model> = {
    name: {type: DataTypes.STRING, allowNull: false, primaryKey: true},
}

type UserData = Omit<User, "roles">

export class UserModel extends Model<UserData> {
    declare getRoles: () => Promise<RoleModel[]>
    declare setRoles: (roles: RoleModel[]) => Promise<void>

    async toObject(): Promise<User> {
        const user: any = {
            ...this.get({ plain: true, clone: true }),
            roles: (await this.getRoles()).map(model => model.dataValues.name).sort()
        }
        delete user.createdAt
        delete user.updatedAt
        delete user.Roles
        return removeNulls(user as User);
    }
}

export class RoleModel extends Model<{ name: string }> {}

export class SequelizeUserRepository implements UserRepository {

    constructor(private readonly sequelize: Sequelize) {
        UserModel.init(UserAttributes, {
            sequelize,
            modelName: "User",
            timestamps: false,
            tableName: "USER",
            indexes: [
                { fields: ["first_name", "last_name"], name: "USER_FIRST_NAME_LAST_NAME_IDX" },
            ],
            underscored: true
        });
        RoleModel.init(RoleAttributes, {
            sequelize, modelName: "Role", timestamps: false, tableName: "ROLE",
            underscored: true
        });
        RoleModel.belongsToMany(UserModel, { through: 'USER_ROLE', timestamps: false});
        UserModel.belongsToMany(RoleModel, { through: 'USER_ROLE', timestamps: false });
    }

    async createUser(user: User): Promise<User> {
        const userModel: UserModel = await UserModel.create(user);
        const roleModels: RoleModel[] = (await Promise.all(
            user.roles.map(async (role: string) =>
                await RoleModel.findOrCreate({ where: { name: role }, defaults: { name: role } })
            ))
        ).map(([roleModel]: [RoleModel, boolean]) => roleModel);
        await userModel.setRoles(roleModels);
        return await (await userModel.reload({ include: RoleModel })).toObject();
    }

    async deleteAllUsers(): Promise<number> {
        return await UserModel.destroy({ where: {} });
    }

    async deleteUserById(id: string): Promise<User | undefined> {
        const userModel = await UserModel.findByPk(id, { include: RoleModel });
        if (userModel) {
            const user = await userModel.toObject()
            await userModel.destroy();
            return user
        }
        return undefined
    }

    async deleteUsersByQuery(query: UsersQuery): Promise<number> {
        const where = sequelizeUserQuery(query);
        return await UserModel.destroy({ where });
    }

    async getAllUsers(): Promise<User[]> {
        return await Promise.all((await UserModel.findAll({ include: RoleModel })).map(userModel => userModel.toObject()));
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        return (await UserModel.findOne({ where: { email: email }, include: RoleModel }))?.toObject();
    }

    async getUserById(id: string): Promise<User | undefined> {
        return (await UserModel.findByPk(id, { include: RoleModel }))?.toObject();
    }

    async queryUsers(query: UsersQuery): Promise<User[]> {
        const where = sequelizeUserQuery(query);
        return await Promise.all((await UserModel.findAll({ where, include: RoleModel })).map(userModel => userModel.toObject()));
    }

    async updateUserById(id: string, user: Partial<Omit<User, "id">>): Promise<User | undefined> {
        const userModel = await UserModel.findByPk(id, { include: RoleModel });
        if (userModel) {
            await userModel.update(user);
            if (user.roles) {
                const roleModels = await Promise.all(user.roles.map((role: string) => RoleModel.findOrCreate({ where: { name: role }, defaults: { name: role } })));
                await userModel.setRoles(roleModels.map(([roleModel]) => roleModel));
                await userModel.reload({ include: RoleModel })
            }
            return await userModel.toObject();
        }
        return undefined;
    }

    async createUserCredentialsPackage(): Promise<void> {
        console.log("DatabaseName: ", this.sequelize.getDatabaseName());
        const dbUserName = this.sequelize.config.username
        await this.sequelize.query(dedent`
        CREATE OR REPLACE PACKAGE USER_CREDENTIALS AS
            TYPE CREDENTIALS_RECORD IS RECORD (
                user_id ${dbUserName}.USER.ID%TYPE,
                email ${dbUserName}.USER.EMAIL%TYPE,
                first_name ${dbUserName}.USER.FIRST_NAME%TYPE,
                last_name ${dbUserName}.USER.LAST_NAME%TYPE,
                token NVARCHAR2(1000),
                attributes NVARCHAR2(1000)
            );
        
            PROCEDURE SET(
                user_id NVARCHAR2,
                email NVARCHAR2 DEFAULT NULL,
                first_name NVARCHAR2 DEFAULT NULL,
                last_name NVARCHAR2 DEFAULT NULL,
                token NVARCHAR2 DEFAULT NULL,
                attributes NVARCHAR2 DEFAULT NULL
            );
            
            PROCEDURE CLEAR;
            
            FUNCTION GET RETURN CREDENTIALS_RECORD;
            
            FUNCTION GET_USER_ID RETURN NVARCHAR2;
            FUNCTION GET_EMAIL RETURN NVARCHAR2;
            FUNCTION GET_FIRST_NAME RETURN NVARCHAR2;
            FUNCTION GET_LAST_NAME RETURN NVARCHAR2;
            FUNCTION GET_TOKEN RETURN NVARCHAR2;
            FUNCTION GET_ATTRIBUTES RETURN NVARCHAR2;    
        END USER_CREDENTIALS;;
        `, { type: QueryTypes.RAW })
    }

    async createUserCredentialsPackageBody(): Promise<void> {
        await this.sequelize.query(dedent`
        CREATE OR REPLACE PACKAGE BODY USER_CREDENTIALS AS
            rec CREDENTIALS_RECORD := NULL;
        
            PROCEDURE Set(
                user_id NVARCHAR2,
                email NVARCHAR2 DEFAULT NULL,
                first_name NVARCHAR2 DEFAULT NULL,
                last_name NVARCHAR2 DEFAULT NULL,
                token NVARCHAR2 DEFAULT NULL,
                attributes NVARCHAR2 DEFAULT NULL
            ) IS
            BEGIN
                rec := CREDENTIALS_RECORD(user_id, email, first_name, last_name, token, attributes);
            END Set;
        
            PROCEDURE Clear IS
            BEGIN
                rec := NULL;
            END Clear;
            
            FUNCTION GET RETURN CREDENTIALS_RECORD IS
            BEGIN
                RETURN rec;
            END GET;
            
            FUNCTION GET_USER_ID RETURN NVARCHAR2 IS
            BEGIN
                RETURN rec.user_id;
            END GET_USER_ID;
            
            FUNCTION GET_EMAIL RETURN NVARCHAR2 IS
            BEGIN
                RETURN rec.email;
            END GET_EMAIL;
            
            FUNCTION GET_FIRST_NAME RETURN NVARCHAR2 IS
            BEGIN
                RETURN rec.first_name;
            END GET_FIRST_NAME;
            
            FUNCTION GET_LAST_NAME RETURN NVARCHAR2 IS
            BEGIN
                RETURN rec.last_name;
            END GET_LAST_NAME;
            
            FUNCTION GET_TOKEN RETURN NVARCHAR2 IS
            BEGIN
                RETURN rec.token;
            END GET_TOKEN;
            
            FUNCTION GET_ATTRIBUTES RETURN NVARCHAR2 IS
            BEGIN
                RETURN rec.attributes;
            END GET_ATTRIBUTES;
        END USER_CREDENTIALS;;
        `, { type: QueryTypes.RAW })
    }

    async setUserCredentials(credentials: Credentials): Promise<void> {
        await this.sequelize.query(dedent`
            BEGIN
                USER_CREDENTIALS.SET($userId, $email, $firstName, $lastName, $token, $attributes);
            END;
            `, {
            bind: {
                userId: credentials.user.id,
                email: credentials.user.email,
                firstName: credentials.user.firstName,
                lastName: credentials.user.lastName,
                token: credentials.token,
                attributes: (credentials.attributes ? JSON.stringify(credentials.attributes) : null)
            },
            type: QueryTypes.RAW
        })
    }

    async getUserCredentials(): Promise<Credentials | undefined> {
        const results: any[] = await this.sequelize.query(dedent`
            SELECT 
                USER_CREDENTIALS.GET_USER_ID() AS "userId",
                USER_CREDENTIALS.GET_EMAIL() AS "email",
                USER_CREDENTIALS.GET_FIRST_NAME() AS "firstName",
                USER_CREDENTIALS.GET_LAST_NAME() AS "lastName",
                USER_CREDENTIALS.GET_TOKEN() AS "token",
                USER_CREDENTIALS.GET_ATTRIBUTES() AS "attributes" from DUAL;
        `, { type: QueryTypes.SELECT })
        if (results.length === 1) {
            const result = results[0]
            if (result.userId === null) {
                return undefined
            }
            const credentials = <Credentials> {
                user: {
                    id: result.userId,
                    email: result.email,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    roles: []
                },
                token: result.token,
                attributes: result.attributes ? JSON.parse(result.attributes) : undefined
            }
            return { ...credentials }
        }
        return undefined
    }

    async clearUserCredentials(): Promise<void> {
        await this.sequelize.query(dedent`
        BEGIN 
            USER_CREDENTIALS.CLEAR; 
        END;`, { type: QueryTypes.RAW })
    }
}

function sequelizeUserQuery(query: UsersQuery): WhereOptions<UserData> {
    const predicates: any[] = []
    if (query.id) {
        predicates.push(sequelizePredicate<UserData, string>(UserModel, "id", query.id))
    }
    if (query.name) {
        predicates.push({
            [Op.or]: [
                sequelizePredicate<UserData, string>(UserModel, "firstName", query.name),
                sequelizePredicate<UserData, string>(UserModel, "lastName", query.name),
            ]
        })
    }
    if (query.email) {
        predicates.push(sequelizePredicate<UserData, string>(UserModel, "email", query.email))
    }
    if (query.phoneNumber) {
        predicates.push(sequelizePredicate<UserData, string>(UserModel, "phoneNumber", query.phoneNumber))
    }
    return { [Op.and]: predicates }
}

export function rawUserSubquery(query: UsersQuery): string | undefined {
    const predicates: string[] = []
    if (query.name) {
        predicates.push(
            dedent`(
                ${rawPredicate("first_name", query.name)} OR
                ${rawPredicate("last_name", query.name)}
            )`
        )
    }
    if (query.email) {
        predicates.push(rawPredicate("email", query.email))
    }
    if (query.phoneNumber) {
        predicates.push(rawPredicate("phone_number", query.phoneNumber))
    }
    if (predicates.length > 0) {
        return dedent`(
            SELECT id
                FROM "${UserModel.tableName}"
                WHERE ${predicates.map(bracket).join(" AND ")}
            )`
    } return undefined;
}

