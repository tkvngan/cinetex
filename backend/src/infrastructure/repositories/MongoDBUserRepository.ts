import {UserRepository} from "../../application/repositories";
import {asFieldFilter, asIdFieldFilter, toObjectId} from "./MongoDBUtils";
import {FilterQuery, Model, SchemaDefinition} from "mongoose";
import {User} from "cinetex-core/dist/domain/entities/User";
import {UsersQuery} from "cinetex-core/dist/application/queries";

export const UserSchemaDefinition: SchemaDefinition = {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true, index: true},
    phoneNumber: {type: String, required: false},
}

export function MongoDBUserRepository(model: Model<User>): UserRepository {
    return {
        async getAllUsers(): Promise<User[]> {
            return (await model.find()).map(user => user.toObject());
        },

        async getUserById(id: string): Promise<User | undefined> {
            return (await model.findById(toObjectId(id)))?.toObject();
        },

        async getUserByEmail(email: string): Promise<User | undefined> {
            return (await model.findOne({email: email}))?.toObject();
        },

        async queryUsers(query: UsersQuery): Promise<User[]> {
            const filter = createUserFilter(query);
            return (await model.find(filter)).map(user => user.toObject());
        },

        async addUser(user: User): Promise<User> {
            return (await model.create(user)).toObject();
        },

        async deleteUserById(id: string): Promise<User | undefined> {
            return (await model.findByIdAndDelete(toObjectId(id), {returnDocument: "before"}))?.toObject();
        },

        async deleteUsersByQuery(query: UsersQuery): Promise<number> {
            const filter = createUserFilter(query);
            return (await model.deleteMany(filter)).deletedCount || 0
        },

        async updateUserById(id: string, user: Partial<Omit<User, "id">>): Promise<User | undefined> {
            delete (user as any).id
            return (await model.findByIdAndUpdate(toObjectId(id), {$set: user}, {returnDocument: "after"}))?.toObject()
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
