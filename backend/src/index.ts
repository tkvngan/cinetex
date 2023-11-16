import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import {MongoMemoryServer} from "mongodb-memory-server";
import {Repositories} from "./application/repositories";
import {ExpressRootPathRouter, ExpressServiceRouter} from "./infrastructure/routers"
import {connectMongoDB, MongoDBRepositories} from "./infrastructure/repositories"
import {ExpressServer} from "./infrastructure/servers"
import {UseCaseInteractorCollections} from "./application/interactors/UseCaseInteractorCollections";
import {installAllSamples} from "./samples";
import {MongoMemoryServerOpts} from "mongodb-memory-server-core/lib/MongoMemoryServer";


dotenvExpand.expand(dotenv.config())

const config: Readonly<{
    PORT: string,
    HOST: string,
    ROOT: string,
    MONGODB_HOST: string,
    MONGODB_PORT: string,
    MONGODB_URI: string,
    MONGODB_DBNAME: string,
    MONGODB_USER: string,
    MONGODB_PASS: string,
    START_MONGODB_MEMORY_SERVER: string,
    INSTALL_SAMPLE_DATA: string
}> = {
    PORT: "3000",
    HOST: "localhost",
    ROOT: "../frontend/build",
    MONGODB_HOST: "localhost",
    MONGODB_PORT: "27017",
    MONGODB_URI: "mongodb://localhost:27017/",
    MONGODB_DBNAME: "Cinetex",
    MONGODB_USER: "root",
    MONGODB_PASS: "goodExample",
    START_MONGODB_MEMORY_SERVER: "false",
    INSTALL_SAMPLE_DATA: "false",
    ...process.env
}

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
    await startMongoDBMemoryServerIfEnabled()
    await connectMongoDBServer()

    const repositories = MongoDBRepositories()
    await installSampleDataIfEnabled(repositories)

    const rootRouter = ExpressRootPathRouter(config.ROOT)
    const serviceRouter = ExpressServiceRouter(UseCaseInteractorCollections(repositories))
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
