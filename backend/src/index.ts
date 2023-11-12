import {ExpressRouter} from "./infrastructure/routers"
import {connectMongoDB, MongoDBRepositories} from "./infrastructure/repositories"
import {ExpressServer} from "./infrastructure/servers"
import {AllUseCaseInteractors} from "./application/interactors/AllUseCaseInteractors";

connectMongoDB().then(() => {
    console.log("Connected to MongoDB")
});

const repositories = MongoDBRepositories()
const router = ExpressRouter(AllUseCaseInteractors(repositories))
const server = ExpressServer([["/service", router]])

server.listen(3001, () => {
    console.log("Listening on port 3001")
});
