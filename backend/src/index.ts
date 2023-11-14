import {ExpressRouter} from "./infrastructure/routers"
import {connectMongoDB, MongoDBRepositories} from "./infrastructure/repositories"
import {ExpressServer} from "./infrastructure/servers"
import {UseCaseInteractorCollections} from "./application/interactors/UseCaseInteractorCollections";
import {installAllSamples} from "./samples";

connectMongoDB().then(() => {
    console.log("Connected to MongoDB.")
    const repositories = MongoDBRepositories()
    installAllSamples(repositories).then(() => {
        console.log("Installed sample data.")
        const router = ExpressRouter(UseCaseInteractorCollections(repositories))
        const server = ExpressServer([["/service", router]])
        server.listen(3001, () => {
            console.log("Listening on port 3001...")
        });
    }).catch((err) => {
        console.error(err)
        process.exit(1)
    })
});
