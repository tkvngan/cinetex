import {Attributes, DataTypes, Model, Op, QueryTypes, Sequelize} from 'sequelize';
import {UserRepository} from "../../../application/repositories/UserRepository";
import {User} from "cinetex-core/dist/domain/entities/User";
import {UsersQuery} from "cinetex-core/dist/application/queries";
import {bracket, queryField, removeNulls, sqlWherePredicate} from "./SequelizeUtils";
import {WhereOptions} from "sequelize/types/model";
import dedent from "dedent";
import {TheatreModel} from "./SequelizeTheatreRepository";
import {Credentials} from "cinetex-core/dist/security/Credentials";

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

export class UserModel extends Model<User> {
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
                { fields: ["firstName", "lastName"], name: "USER_first_name_last_name" },
            ]
        });
        RoleModel.init(RoleAttributes, { sequelize, modelName: "Role", timestamps: false, tableName: "ROLE" });
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
        const where = createUserWhereClause(query);
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
        const where = createUserWhereClause(query);
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
        await this.sequelize.query(dedent`
        CREATE OR REPLACE PACKAGE USER_CREDENTIALS AS
            TYPE CREDENTIALS_RECORD IS RECORD (
                userId NVARCHAR2(255),
                email NVARCHAR2(255),
                firstName NVARCHAR2(255),
                lastName NVARCHAR2(255),
                token NVARCHAR2(1000),
                attributes NVARCHAR2(1000)
            );
        
            PROCEDURE Set(
                userId NVARCHAR2,
                email NVARCHAR2 DEFAULT NULL,
                firstName NVARCHAR2 DEFAULT NULL,
                lastName NVARCHAR2 DEFAULT NULL,
                token NVARCHAR2 DEFAULT NULL,
                attributes NVARCHAR2 DEFAULT NULL
            );
            
            PROCEDURE Clear;
            
            FUNCTION Get RETURN CREDENTIALS_RECORD;
            
            FUNCTION GetUserId RETURN NVARCHAR2;
            FUNCTION GetEmail RETURN NVARCHAR2;
            FUNCTION GetFirstName RETURN NVARCHAR2;
            FUNCTION GetLastName RETURN NVARCHAR2;
            FUNCTION GetToken RETURN NVARCHAR2;
            FUNCTION GetAttributes RETURN NVARCHAR2;    
        END USER_CREDENTIALS;;
        `, { type: QueryTypes.RAW })
    }

    async createUserCredentialsPackageBody(): Promise<void> {
        await this.sequelize.query(dedent`
        CREATE OR REPLACE PACKAGE BODY USER_CREDENTIALS AS
            rec CREDENTIALS_RECORD := NULL;
        
            PROCEDURE Set(
                userId NVARCHAR2,
                email NVARCHAR2 DEFAULT NULL,
                firstName NVARCHAR2 DEFAULT NULL,
                lastName NVARCHAR2 DEFAULT NULL,
                token NVARCHAR2 DEFAULT NULL,
                attributes NVARCHAR2 DEFAULT NULL
            ) IS
            BEGIN
                rec := CREDENTIALS_RECORD(userId, email, firstName, lastName, token, attributes);
            END Set;
        
            PROCEDURE Clear IS
            BEGIN
                rec := NULL;
            END Clear;
            
            FUNCTION Get RETURN CREDENTIALS_RECORD IS
            BEGIN
                RETURN rec;
            END Get;
            
            FUNCTION GetUserId RETURN NVARCHAR2 IS
            BEGIN
                RETURN rec.userId;
            END GetUserId;
            
            FUNCTION GetEmail RETURN NVARCHAR2 IS
            BEGIN
                RETURN rec.email;
            END GetEmail;
            
            FUNCTION GetFirstName RETURN NVARCHAR2 IS
            BEGIN
                RETURN rec.firstName;
            END GetFirstName;
            
            FUNCTION GetLastName RETURN NVARCHAR2 IS
            BEGIN
                RETURN rec.lastName;
            END GetLastName;
            
            FUNCTION GetToken RETURN NVARCHAR2 IS
            BEGIN
                RETURN rec.token;
            END GetToken;
            
            FUNCTION GetAttributes RETURN NVARCHAR2 IS
            BEGIN
                RETURN rec.attributes;
            END GetAttributes;
        END USER_CREDENTIALS;;
        `, { type: QueryTypes.RAW })
    }

    async setUserCredentials(credentials: Credentials): Promise<void> {
        await this.sequelize.query(dedent`
            BEGIN
                USER_CREDENTIALS.Set($userId, $email, $firstName, $lastName, $token, $attributes);
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
                USER_CREDENTIALS.GetUserId AS "userId",
                USER_CREDENTIALS.GetEmail AS "email",
                USER_CREDENTIALS.GetFirstName AS "firstName",
                USER_CREDENTIALS.GetLastName AS "lastName",
                USER_CREDENTIALS.GetToken AS "token",
                USER_CREDENTIALS.GetAttributes AS "attributes" from DUAL;
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
            USER_CREDENTIALS.Clear; 
        END;`, { type: QueryTypes.RAW })
    }
}

function createUserWhereClause(query: UsersQuery): WhereOptions<typeof UserAttributes> {
    const predicates: any[] = []
    if (query.id) {
        predicates.push(queryField(UserModel, "id", query.id))
    }
    if (query.name) {
        predicates.push({
            [Op.or]: [
                queryField(UserModel, "firstName", query.name),
                queryField(UserModel, "lastName", query.name),
            ]
        })
    }
    if (query.email) {
        predicates.push(queryField(UserModel, "email", query.email))
    }
    if (query.phoneNumber) {
        predicates.push(queryField(UserModel, "phoneNumber", query.phoneNumber))
    }
    return { [Op.and]: predicates }
}

export function createUserSubqueryClause(query: UsersQuery): string | undefined {
    const predicates: string[] = []
    if (query.id) {
        predicates.push(sqlWherePredicate("id", query.id))
    }
    if (query.name) {
        predicates.push(
            dedent`(
                ${sqlWherePredicate("firstName", query.name)} OR
                ${sqlWherePredicate("lastName", query.name)}
            )`
        )
    }
    if (query.email) {
        predicates.push(sqlWherePredicate("email", query.email))
    }
    if (query.phoneNumber) {
        predicates.push(sqlWherePredicate("phoneNumber", query.phoneNumber))
    }
    if (predicates.length > 0) {
        return dedent`(
            SELECT "${UserModel.tableName}"."id"
                FROM "${UserModel.tableName}"
                WHERE ${predicates.map(bracket).join(" AND ")}
            )`
    } return undefined;
}

