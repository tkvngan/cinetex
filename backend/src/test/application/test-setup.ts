import {Repositories} from "../../application/repositories/Repositories";
import {setObjectIdFactory} from "cinetex-core/dist/domain/types";
import {ObjectId} from "mongodb";
import {Sequelize} from "sequelize";
import {SequelizeRepositories} from "../../infrastructure/repositories/sequelize/SequelizeRepositories";
import {SequelizeUserRepository} from "../../infrastructure/repositories/sequelize/SequelizeUserRepository";

setObjectIdFactory(() => new ObjectId().toString("hex"))

let sequelize: Sequelize = new Sequelize(
    "oracle://cinetex_test:goodExample@localhost:1521/xe",
    // "oracle://cinetex_test:goodExample@localhost:1521/xe",
    { omitNull: true, quoteIdentifiers: false }
)

let sqlRepositories: SequelizeRepositories = new SequelizeRepositories(sequelize)

let synced = true
let forceSync = false
if (!synced) {
    sqlRepositories.sync({force: forceSync}).then(() => {
        synced = true
        console.log("synced")
    });
}

// let mongoDBRepositories: Repositories = new MongoDBRepositories()

beforeAll(async () => {
    for (let i = 0; !synced; i++) {
        if (i % 10 === 0) {
            console.log(`Syncing... ${i} seconds`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000))
    }
    // const userRepository: SequelizeUserRepository = sqlRepositories.User as SequelizeUserRepository
    // try {
    //     await userRepository.createUserCredentialsPackage();
    // } catch (e) {
    //     console.log("Failed to create user credentials package: ", e)
    //     throw e;
    // }
    // try {
    //     await userRepository.createUserCredentialsPackageBody();
    // } catch (e) {
    //     console.log("Failed to create user credentials package body: ", e)
    //     throw e;
    // }

    // await connectMongoDB(config.MONGODB_URI, {
    //     dbName: config.MONGODB_DBNAME,
    //     user: config.MONGODB_USER,
    //     pass: config.MONGODB_PASS,
    // })
    // console.log("Connected to MongoDB.")
}, 600000)

export function getRepositoriesForTest(): Repositories[] {
    return [sqlRepositories]
}
