import {UserRepository} from "../../application/repositories/UserRepository";
import {asFieldFilter, asIdFieldFilter, toObjectId} from "./MongoDBUtils";
import {FilterQuery, Model, SchemaDefinition} from "mongoose";
import {User} from "cinetex-core/dist/domain/entities/User";
import {UsersQuery} from "cinetex-core/dist/application/queries";
import {DefaultToObjectOptions, fromObject} from "./MongoDBRepositories";

export const UserSchemaDefinition: SchemaDefinition = {
    email: {type: String, required: true, unique: true, index: true},
    password: {type: String, required: true},
    firstName: {type: String, required: false},
    lastName: {type: String, required: false},
    phoneNumber: {type: String, required: false},
    emailVerified: {type: Boolean, required: true, default: false},
    createdAt: {type: Date, required: true, default: Date.now},
    roles: {type: [String], required: true, default: []},
}

export function MongoDBUserRepository(model: Model<User>): UserRepository {
    return {
        async getAllUsers(): Promise<User[]> {
            return (await model.find()).map(user => user.toObject(DefaultToObjectOptions));
        },

        async getUserById(id: string): Promise<User | undefined> {
            return (await model.findById(toObjectId(id)))?.toObject(DefaultToObjectOptions);
        },

        async getUserByEmail(email: string): Promise<User | undefined> {
            return (await model.findOne({email: email}))?.toObject(DefaultToObjectOptions);
        },

        async queryUsers(query: UsersQuery): Promise<User[]> {
            const filter = createUserFilter(query);
            return (await model.find(filter)).map(user => user.toObject(DefaultToObjectOptions));
        },

        async createUser(user: User): Promise<User> {
            return (await model.create(fromObject(user))).toObject(DefaultToObjectOptions);
        },

        async deleteUserById(id: string): Promise<User | undefined> {
            return (await model.findByIdAndDelete(toObjectId(id), {returnDocument: "before"}))?.toObject(DefaultToObjectOptions);
        },

        async deleteUsersByQuery(query: UsersQuery): Promise<number> {
            const filter = createUserFilter(query);
            return (await model.deleteMany(filter)).deletedCount || 0
        },

        async deleteAllUsers(): Promise<number> {
            return (await model.deleteMany({})).deletedCount || 0
        },

        async updateUserById(id: string, user: Partial<Omit<User, "id">>): Promise<User | undefined> {
            return (await model.findByIdAndUpdate(toObjectId(id), {$set: fromObject({...user})}, {returnDocument: "after"}))?.toObject(DefaultToObjectOptions)
        },
    }
}

export function createUserFilter(query: UsersQuery): FilterQuery<User> {
    const filter: FilterQuery<any> = {}
    if (query.id) {
        filter._id = asIdFieldFilter(query.id)
        return filter
    }
    if (query.name) {
        filter.$or = [
            {firstName: asFieldFilter(query.name)},
            {lastName: asFieldFilter(query.name)},
        ]
    }
    if (query.email) {
        filter.email = asFieldFilter(query.email)
    }
    if (query.phoneNumber) {
        filter.phoneNumber = asFieldFilter(query.phoneNumber)
    }
    return filter as FilterQuery<User>
}
