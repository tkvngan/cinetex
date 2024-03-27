import {FilterQuery, Types} from "mongoose";
import {ByPattern, ByRange} from "cinetex-core/dist/application/queries/QueryCriteria";
import {error} from "cinetex-core/dist/utils";
import {MongoMemoryServerOpts} from "mongodb-memory-server-core/lib/MongoMemoryServer";
import {MongoMemoryServer} from "mongodb-memory-server";
import config from "../../../config";

export function toObjectId(id: string) {
    return new Types.ObjectId(id);
}

export function filterIdField(filter: FilterQuery<any>, field: string, value: string | string[]): FilterQuery<any> {
    if (Array.isArray(value)) {
        if (value.length === 0) {
            filter[field] = { $eq: null }
        } else {
            filter[field] = { $in: value.map(toObjectId)}
        }
    } else {
        filter[field] = { $eq: toObjectId(value as string) };
    }
    return filter;
}

export function filterArrayField<T>(filter: FilterQuery<any>, field: string, value: T | T[] | ByPattern): FilterQuery<any> {
    if (Array.isArray(value)) {
        if (value.length === 0) {
            filter[field] = { $size: 0 }
        } else {
            filter[field] = {$all: value}
        }
    } else if (value instanceof Object) {
        value = value as ByPattern
        if (value.pattern) {
            filter[field] = { $elemMatch: { $regex: value.pattern, $options: value.options } }
        } else {
            error("Invalid filter value: " + JSON.stringify(value))
        }
    } else {
        filter[field] = {$all: [value]};
    }
    return filter;
}

export function filterField<T>(filter: FilterQuery<any>, field: string, value: T | T[] | ByRange<T> | ByPattern): FilterQuery<any> {
    if (Array.isArray(value)) {
        if (value.length === 0) {
            filter[field] = { $eq: null }
        } else {
            filter[field] = { $in: value }
        }
    } else if (value instanceof Object) {
        const operand = value as { min?: any; max?: any; pattern?: any; options?: any;  }
        if (operand.pattern) {
            filter[field] = { $regex: operand.pattern, $options: operand.options }
        } else if (operand.max || operand.min) {
            if (operand.min) {
                filter[field] = operand.max ? { $gte: operand.min, $lte: operand.max } : { $gte: operand.min }
            } else {
                filter[field] = { $lte: operand.max }
            }
        } else {
            error("Invalid filter value: " + JSON.stringify(value))
        }
    } else {
        filter[field] = { $eq: value };
    }
    return filter;
}

let mongoDBMemoryServer: MongoMemoryServer | undefined

export async function startMongoDBMemoryServer(options?: MongoMemoryServerOpts): Promise<MongoMemoryServer> {
    options = options ?? {
        instance: {
            dbName: config.MONGODB_DBNAME,
            ip: config.MONGODB_HOST,
            port: parseInt(config.MONGODB_PORT)
        },
        auth: {
            enable: true,
            force: true,
            customRootName: config.MONGODB_USER || "root",
            customRootPwd:  config.MONGODB_PASS || "goodExample",
        }
    }
    console.log("MongoDB Memory Server starting with config:", JSON.stringify(options, null, 4), "...")
    mongoDBMemoryServer = await MongoMemoryServer.create(options)
    console.log("MongoDB Memory Server started.")
    process.on('SIGINT', () => {
        mongoDBMemoryServer?.stop()
        process.exit(0)
    })
    return mongoDBMemoryServer
}

export async function stopMongoDBMemoryServer() {
    if (mongoDBMemoryServer) {
        console.log("Stopping MongoDB Memory Server...")
        try {
            await mongoDBMemoryServer.stop()
            console.log("Stopped MongoDB Memory Server")
        } catch (e) {
            console.error("Error stopping MongoDB Memory Server:", e)
        } finally {
            mongoDBMemoryServer = undefined
        }
    }
}
