import {UserRepository} from "../../application/repositories/UserRepository";
import {toObjectId, toPatternFilter} from "./MongoDBUtils";
import {FilterQuery, Model} from "mongoose";
import {User} from "@cinetex/shared/domain/entities/User";
import {UserQueryCriteria} from "@cinetex/shared/application/usecases/queries/GetUsersByQuery";

export class MongoDBUserRepository implements UserRepository {

    constructor(readonly model: Model<User>) {}

    async getAllUsers(): Promise<User[]> {
        return (await this.model.find()).map(user => user.toObject());
    }

    async getUserId(id: string): Promise<User | undefined> {
        return (await this.model.findById(toObjectId(id)))?.toObject();
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        return (await this.model.findOne({email: email}))?.toObject();
    }

    async getUsersByQuery(criteria: UserQueryCriteria): Promise<User[]> {
        const filter = createUserFilter(criteria);
        return (await this.model.find(filter)).map(user => user.toObject());
    }

    async addUser(user: User): Promise<User> {
        return (await this.model.create(user)).toObject();
    }

    async deleteUserById(id: string): Promise<User | undefined> {
        return (await this.model
            .findByIdAndDelete(toObjectId(id), {returnDocument: "before"}))?.toObject();
    }

    async deleteUsersByQuery(criteria: UserQueryCriteria): Promise<number> {
        const filter= createUserFilter(criteria);
        return (await this.model.deleteMany(filter)).deletedCount || 0
    }

    async updateUserById(id: string, user: Partial<Omit<User, "id">>): Promise<User | undefined> {
        delete (user as any).id
        return (await this.model.findByIdAndUpdate(toObjectId(id), {$set: user}, {returnDocument: "after"}))?.toObject()
    }
}

function createUserFilter(criteria: UserQueryCriteria): FilterQuery<User> {
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