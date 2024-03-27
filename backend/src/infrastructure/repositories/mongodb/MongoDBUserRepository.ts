import {UserRepository} from "../../../application/repositories/UserRepository";
import {filterField, filterIdField, toObjectId} from "./MongoDBUtils";
import {FilterQuery, Model, Schema, SchemaDefinition} from "mongoose";
import {User} from "cinetex-core/dist/domain/entities/User";
import {UsersQuery} from "cinetex-core/dist/application/queries";
import {DefaultSchemaOptions} from "./MongoDBRepositories";
import {MongoDBRepository} from "./MongoDBRepository";

export const UserSchemaDefinition: SchemaDefinition = {
    email: {type: String, required: true, unique: true, index: true},
    password: {type: String, required: true},
    firstName: {type: String, required: false},
    lastName: {type: String, required: false},
    phoneNumber: {type: String, required: false},
    emailVerified: {type: Boolean, required: true, default: false},
    createdAt: {type: Date, required: false},
    roles: {type: [String], required: true, default: []},
}

export const UserSchema = new Schema(UserSchemaDefinition, DefaultSchemaOptions)

export class MongoDBUserRepository extends MongoDBRepository<User> implements UserRepository {

    constructor(model: Model<User>) {
        super(model)
    }

    async getAllUsers(): Promise<User[]> {
        return (await this.model.find()).map(user => user.toObject(this.toObjectOptions));
    }

    async getUserById(id: string): Promise<User | undefined> {
        return (await this.model.findById(toObjectId(id)))?.toObject(this.toObjectOptions);
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        return (await this.model.findOne({email: email}))?.toObject(this.toObjectOptions);
    }

    async queryUsers(query: UsersQuery): Promise<User[]> {
        const filter = createUserFilter(query);
        return (await this.model.find(filter)).map(user => user.toObject(this.toObjectOptions));
    }

    async createUser(user: User): Promise<User> {
        return (await this.model.create(this.fromObject(user))).toObject(this.toObjectOptions);
    }

    async deleteUserById(id: string): Promise<User | undefined> {
        return (await this.model.findByIdAndDelete(toObjectId(id), {returnDocument: "before"}))?.toObject(this.toObjectOptions);
    }

    async deleteUsersByQuery(query: UsersQuery): Promise<number> {
        const filter = createUserFilter(query);
        return (await this.model.deleteMany(filter)).deletedCount || 0
    }

    async deleteAllUsers(): Promise<number> {
        return (await this.model.deleteMany({})).deletedCount || 0
    }

    async updateUserById(id: string, user: Partial<Omit<User, "id">>): Promise<User | undefined> {
        return (await this.model.findByIdAndUpdate(toObjectId(id), {$set: this.fromObject({...user})}, {returnDocument: "after"}))?.toObject(this.toObjectOptions)
    }

}

export function createUserFilter(query: UsersQuery): FilterQuery<User> {
    const filter: FilterQuery<User> = {}
    if (query.id) {
        filterIdField(filter, "_id", query.id)
    }
    if (query.name) {
        filter.$or = [
            filterField({}, "firstName", query.name),
            filterField({}, "lastName", query.name),
        ]
    }
    if (query.email) {
        filterField(filter, "email", query.email)
    }
    if (query.phoneNumber) {
        filterField(filter, "phoneNumber", query.phoneNumber)
    }
    return filter
}
