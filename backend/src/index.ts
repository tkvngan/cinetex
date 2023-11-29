import {MongoMemoryServer} from "mongodb-memory-server";
import {Repositories} from "./application/repositories";
import {ExpressRootPathRouter, ExpressServiceRouter} from "./infrastructure/routers"
import {connectMongoDB, MongoDBRepositories} from "./infrastructure/repositories"
import {ExpressServer} from "./infrastructure/servers"
import {UseCaseInteractorCollections} from "./application";
import {installAllSamples} from "./samples";
import {MongoMemoryServerOpts} from "mongodb-memory-server-core/lib/MongoMemoryServer";
import config from "./config";
import {secretKey} from "./infrastructure/security";

async function startMongoDBMemoryServerIfEnabled(): Promise<void> {
    if (config.START_MONGODB_MEMORY_SERVER !== "true") {
        console.log("MongoDB Memory Server is disabled.")
        return
    }
    console.log("MongoDB Memory Server is enabled.")
    const options: MongoMemoryServerOpts = {
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
    const mongoDBMemoryServer = await MongoMemoryServer.create(options)
    console.log("MongoDB Memory Server started.")
    process.on('SIGINT', () => {
        mongoDBMemoryServer.stop()
        process.exit(0)
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
    await secretKey()
    await startMongoDBMemoryServerIfEnabled()
    await connectMongoDBServer()

    const repositories = MongoDBRepositories()
    await installSampleDataIfEnabled(repositories)

    const rootRouter = ExpressRootPathRouter(config.ROOT)
    const serviceRouter = ExpressServiceRouter(UseCaseInteractorCollections(repositories), repositories)
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
    })
}

main().catch(error => {
    console.error(error)
    process.exit(1)
})
