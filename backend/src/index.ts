import {ExpressServiceRouter, ExpressRootPathRouter} from "./infrastructure/routers"
import {connectMongoDB, MongoDBRepositories} from "./infrastructure/repositories"
import {ExpressServer} from "./infrastructure/servers"
import {UseCaseInteractorCollections} from "./application/interactors/UseCaseInteractorCollections";
import {installAllSamples} from "./samples";
import dotenv from "dotenv";

dotenv.config()
const port = process.env.PORT || 3000

connectMongoDB().then(() => {
    console.log("Connected to MongoDB.")
    const repositories = MongoDBRepositories()
    installAllSamples(repositories).then(() => {
        console.log("Installed sample data.")
        const root = ExpressRootPathRouter()
        const service = ExpressServiceRouter(UseCaseInteractorCollections(repositories))
        const server = ExpressServer([["/service", service], ["/", root]])
        server.listen(port, () => {
            console.log(`Backend server listening on port ${port}...`)
        });
    }).catch((err) => {
        console.error(err)
        process.exit(1)
    })
});
