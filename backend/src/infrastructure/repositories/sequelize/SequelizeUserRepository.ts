import {Attributes, DataTypes, Model, Op, Sequelize} from 'sequelize';
import {UserRepository} from "../../../application/repositories/UserRepository";
import {User} from "cinetex-core/dist/domain/entities/User";
import {UsersQuery} from "cinetex-core/dist/application/queries";
import {bracket, queryField, removeNulls, sqlWherePredicate} from "./SequelizeUtils";
import {WhereOptions} from "sequelize/types/model";
import dedent from "dedent";
import {TheatreModel} from "./SequelizeTheatreRepository";

const UserAttributes: Attributes<Model> = {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    emailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true
    }
}

const RoleAttributes: Attributes<Model> = {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
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
        UserModel.init(UserAttributes, { sequelize, modelName: "User", timestamps: false, tableName: "USER" });
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
