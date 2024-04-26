import {MongoMemoryServer} from "mongodb-memory-server";
import {Repositories} from "./application/repositories/Repositories";
import {ExpressRootPathRouter} from "./infrastructure/routers/ExpressRootPathRouter"
import {ExpressServiceRouter} from "./infrastructure/routers/ExpressServiceRouter"
import {MongoDBRepositories, connectMongoDB} from "./infrastructure/repositories/mongodb/MongoDBRepositories"
import {ExpressServer} from "./infrastructure/servers/ExpressServer"
import {installAllSamples} from "./samples";
import {MongoMemoryServerOpts} from "mongodb-memory-server-core/lib/MongoMemoryServer"
import {UseCaseInteractors} from "./application/UseCaseInteractors";
import config from "./config";
import {setObjectIdFactory} from "cinetex-core/dist/domain/types";
import {ObjectId} from "mongodb";
import {startMongoDBMemoryServer} from "./infrastructure/repositories/mongodb/MongoDBUtils";
import {Sequelize} from "sequelize";
import {SequelizeRepositories} from "./infrastructure/repositories/sequelize/SequelizeRepositories";
import {Movie} from "cinetex-core/dist/domain/entities/Movie";

async function startMongoDBMemoryServerIfEnabled(): Promise<MongoMemoryServer | undefined> {
    if (config.START_MONGODB_MEMORY_SERVER !== "true") {
        console.log("MongoDB Memory Server is disabled.")
        return undefined
    }
    console.log("MongoDB Memory Server is enabled.")
    return await startMongoDBMemoryServer({
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
    })
}

async function connectMongoDBServer(): Promise<void> {
    const options = {
        dbName: config.MONGODB_DBNAME,
        user: config.MONGODB_USER,
        pass: config.MONGODB_PASS,
    }
    console.log("Connecting to MongoDB with uri:", config.MONGODB_URI, "options:", JSON.stringify(options, null, 4), "...")
    await connectMongoDB(config.MONGODB_URI, options)
    console.log("Connected to MongoDB.")
}

async function installSampleDataIfEnabled(repositories: Repositories): Promise<void> {
    if (config.INSTALL_SAMPLE_DATA === "true") {
        console.log("Installation of sample data installation is enabled.")
        console.log("Installing sample data...")
        await installAllSamples(repositories)
        console.log("Installed sample data.")
    } else {
        console.log("Installation of sample data installation is disabled.")
    }
}

async function main(): Promise<void> {
    setObjectIdFactory(() => new ObjectId().toString("hex"))

    await startMongoDBMemoryServerIfEnabled()
    await connectMongoDBServer()
    const repositories: Repositories = new MongoDBRepositories()

    // let sequelize: Sequelize = new Sequelize(
    //     "oracle://cinetex:goodExample@localhost:1521/xe",
    //     { omitNull: true, quoteIdentifiers: false }
    // )
    // let repositories: SequelizeRepositories = new SequelizeRepositories(sequelize)
    // await repositories.sync({force: true})

    await installSampleDataIfEnabled(repositories)
    const rootRouter = ExpressRootPathRouter(config.ROOT)
    const interactors = new UseCaseInteractors(repositories)
    const serviceRouter = ExpressServiceRouter(interactors, repositories)
    const server = ExpressServer([["/service", serviceRouter], ["/", rootRouter]])
    const port = parseInt(config.PORT)
    server.listen(port, () => {
        console.log(`Backend web server started and listening on port ${port}...`)
    });
    process.on('SIGINT', () => {
        server.close(() => {
            console.log("Backend web server stopped.")
            process.exit(0)
        })
    });
}

main().catch(error => {
    console.error(error)
    process.exit(1)
})
