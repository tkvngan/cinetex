import {Repositories} from "../../../application/repositories/Repositories";
import {setObjectIdFactory} from "cinetex-core/dist/domain/types";
import {ObjectId} from "mongodb";
import {Sequelize} from "sequelize";
import {SequelizeRepositories} from "../../../infrastructure/repositories/sequelize/SequelizeRepositories";
import {connectMongoDB, MongoDBRepositories} from "../../../infrastructure/repositories/mongodb/MongoDBRepositories";
import config from "../../../config";

setObjectIdFactory(() => new ObjectId().toString("hex"))

let sequelize: Sequelize = new Sequelize("oracle://cinetex:goodExample@localhost:1521/xe", { omitNull: true })
let sqlRepositories: Repositories = new SequelizeRepositories(sequelize)

let synced = true
if (!synced) {
    sequelize.sync().then(() => {
        synced = true
        console.log("synced")
    });
}

let mongoDBRepositories: Repositories = new MongoDBRepositories()

beforeAll(async () => {
    for (let i = 0; !synced; i++) {
        if (i % 10 === 0) {
            console.log(`Syncing... ${i} seconds`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000))
    }
    await connectMongoDB(config.MONGODB_URI, {
        dbName: config.MONGODB_DBNAME,
        user: config.MONGODB_USER,
        pass: config.MONGODB_PASS,
    })
    console.log("Connected to MongoDB.")
}, 600000)

export function getRepositoriesForTest(): Repositories[] {
    return [mongoDBRepositories, sqlRepositories]
}
