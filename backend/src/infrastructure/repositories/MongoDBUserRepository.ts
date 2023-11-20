import {UserRepository} from "../../application/repositories";
import {toObjectId, toPatternFilter} from "./MongoDBUtils";
import {FilterQuery, Model, SchemaDefinition} from "mongoose";
import {User} from "core/dist/domain/entities/User";
import {UsersQuery} from "core/dist/application/queries";

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

        async queryUsers(criteria: UsersQuery): Promise<User[]> {
            const filter = createUserFilter(criteria);
            return (await model.find(filter)).map(user => user.toObject());
        },

        async addUser(user: User): Promise<User> {
            return (await model.create(user)).toObject();
        },

        async deleteUserById(id: string): Promise<User | undefined> {
            return (await model.findByIdAndDelete(toObjectId(id), {returnDocument: "before"}))?.toObject();
        },

        async deleteUsersByQuery(criteria: UsersQuery): Promise<number> {
            const filter = createUserFilter(criteria);
            return (await model.deleteMany(filter)).deletedCount || 0
        },

        async updateUserById(id: string, user: Partial<Omit<User, "id">>): Promise<User | undefined> {
            delete (user as any).id
            return (await model.findByIdAndUpdate(toObjectId(id), {$set: user}, {returnDocument: "after"}))?.toObject()
        },
    }
}

function createUserFilter(criteria: UsersQuery): FilterQuery<User> {
    const filter: FilterQuery<any> = {}
    if (criteria.name) {
        filter.name = toPatternFilter(criteria.name)
    }
    if (criteria.email) {
        filter.email = toPatternFilter(criteria.email)
    }
    if (criteria.phoneNumber) {
        filter.phoneNumber = toPatternFilter(criteria.phoneNumber)
    }
    return filter as FilterQuery<User>
}
