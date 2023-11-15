import express, {Router} from "express"
import {UseCase, UseCaseCollection} from "core/dist/application/usecases"
import {RequestHandler} from "express-serve-static-core";

export function ExpressRouter(interactors: UseCaseCollection): Router {
    const router: Router = express.Router()

    function queryHandler<Input, Output>(interactor: UseCase<Input, Output>): RequestHandler {
        return async (req, res) => {
            console.log(`Query interactor ${interactor.name} invoked with query: ` + JSON.stringify(req.body))
            const result = await interactor.invoke(req.body)
            if (result === undefined) {
                res.status(404).json(result)
            } else {
                res.status(200).json(result)
            }
        }
    }

    function commandHandler<Input, Output>(interactor: UseCase<Input, Output>): RequestHandler {
        return async (req, res) => {
            console.log(`Command interactor ${interactor.name} invoked with command: ` + JSON.stringify(req.body))
            const result = await interactor.invoke(req.body)
            res.status(200).json(result)
        }
    }

    for (const interactor of interactors.toArray()) {
        const path = "/" + interactor.type + "/" + interactor.name
        switch (interactor.type) {
        case "query":
            router.get(path, queryHandler(interactor))
            console.log("Registered query interactor " + interactor.name + " at " + path)
            break;
        case "command":
            router.post(path, commandHandler(interactor))
            console.log("Registered command interactor: " + interactor.name + " at " + path)
            break;
        default:
            console.warn("Unknown interactor type: " + interactor.type + ", skipping...")
            break;
        }
    }
    return router
}



