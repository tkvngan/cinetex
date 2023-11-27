import express, {Router} from "express"
import {CommandUseCase, QueryUseCase, RequestUseCase, UseCase, UseCaseCollection} from "cinetex-core/dist/application"
import {RequestHandler} from "express-serve-static-core";
import {StatusCodes} from "http-status-codes";

export function ExpressServiceRouter(interactors: UseCaseCollection): Router {
    const router: Router = express.Router()

    function queryHandler<Query, Result>(interactor: UseCase<Query, Result>): RequestHandler {
        return async (req, res) => {
            console.log(`Query interactor ${interactor.name} invoked with query: ` + JSON.stringify(req.body))
            const result = await interactor.invoke(req.body)
            if (result === undefined) {
                res.status(StatusCodes.NOT_FOUND).json(result)
            } else {
                res.status(StatusCodes.OK).json(result)
            }
        }
    }

    function commandHandler<Command>(interactor: CommandUseCase<Command>): RequestHandler {
        return async (req, res) => {
            console.log(`Command interactor ${interactor.name} invoked with command: ` + JSON.stringify(req.body))
            const result = await interactor.invoke(req.body)
            res.status(StatusCodes.OK).json(result)
        }
    }

    function requestHandler<Request, Reply>(interactor: UseCase<Request, Reply>): RequestHandler {
        return async (req, res) => {
            console.log(`Request interactor ${interactor.name} invoked with request: ` + JSON.stringify(req.body))
            const result = await interactor.invoke(req.body)
            res.status(StatusCodes.OK).json(result)
        }
    }

    for (const interactor of interactors.toArray()) {
        const path = "/" + interactor.type + "/" + interactor.name
        switch (interactor.type) {
        case "query":
            router.get(path, queryHandler(interactor as QueryUseCase))
            break;
        case "command":
            router.post(path, commandHandler(interactor as CommandUseCase))
            break;
        case "request":
            router.post(path, requestHandler(interactor as RequestUseCase))
            break;
        default:
            console.warn("Unknown interactor type: " + interactor.type + ", skipping...")
            break;
        }
    }
    return router
}



