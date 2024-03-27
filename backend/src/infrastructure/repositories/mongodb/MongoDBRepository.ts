import {Model, ToObjectOptions} from "mongoose";
import {toObjectId} from "./MongoDBUtils";
import {DefaultToObjectOptions} from "./MongoDBRepositories";

export abstract class MongoDBRepository<T> {

    protected constructor(protected model: Model<T>) {
    }

    protected readonly toObjectOptions: ToObjectOptions = DefaultToObjectOptions

    protected fromObject(obj: Partial<T>): T {
        const from = obj as any
        const to: any = {...obj}
        if (from.id && typeof from.id === "string") {
            to._id = toObjectId(from.id)
            delete to.id
        }
        return to as T
    }
}
