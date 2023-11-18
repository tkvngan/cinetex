import {connectMongoDB, MongoDBRepositories} from "./infrastructure/repositories";
import config from "./config";
import {installAllSamples} from "./samples";

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

async function main(): Promise<void> {
    await connectMongoDBServer()
    const repositories = MongoDBRepositories()
    await installAllSamples(repositories)
}

main().then(() => {
    console.log("Done.")
    process.exit(0)
}).catch((err) => {
    console.error(err)
    process.exit(1)
})
