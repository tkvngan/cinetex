import express, {Router} from "express"
import {CommandUseCase, QueryUseCase, RequestUseCase, UseCase, UseCaseCollection} from "cinetex-core/dist/application"
import {Request, RequestHandler} from "express-serve-static-core";
import {StatusCodes} from "http-status-codes";
import {SignUp} from "cinetex-core/dist/application/requests/SignUp";
import {SignUpInteractor} from "../../application/requests/SignUp";
import {Repositories} from "../../application/repositories";
import {SignInInteractor} from "../../application/requests/SignIn";
import {jwtVerify} from "jose";
import {secretKey} from "../security";
import { ParsedQs } from "qs";
import {ParamsDictionary } from "express-serve-static-core";

export function ExpressServiceRouter(interactors: UseCaseCollection, repositories: Repositories): Router {
    const router: Router = express.Router()

    async function getCredentials(req:  Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<any | undefined> {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1]
            try {
                const { payload} = await jwtVerify(token, await secretKey(), {issuer: 'cinetex', audience: 'cinetex',})
                console.log("Credentials: " + JSON.stringify(payload))

                return payload;
            } catch (e: any) {
                console.error(e)
            }
        }
        return undefined
    }

    function queryHandler<Query, Result>(interactor: UseCase<Query, Result>): RequestHandler {
        return async (req, res) => {
            console.log(`Query interactor ${interactor.name} invoked with query: ` + JSON.stringify(req.body))
            const credentials = await getCredentials(req)
            const result = await interactor.invoke(req.body, credentials)
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
            const credentials = await getCredentials(req)
            const result = await interactor.invoke(req.body, credentials)
            res.status(StatusCodes.OK).json(result)
        }
    }

    function requestHandler<Request, Reply>(interactor: UseCase<Request, Reply>): RequestHandler {
        return async (req, res) => {
            console.log(`Request interactor ${interactor.name} invoked with request: ` + JSON.stringify(req.body))
            try {
                const credentials = await getCredentials(req)
                const result = await interactor.invoke(req.body, credentials)
                res.status(StatusCodes.OK).json(result)
            } catch (e: any) {
                console.error(e)
                if (e instanceof Error) {
                    res.status(StatusCodes.BAD_REQUEST).json({error: e.message})
                } else {
                    res.status(StatusCodes.BAD_REQUEST).json({error: e.toString()})
                }
            }
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
    router.post("/request/SignUp", requestHandler(SignUpInteractor(repositories)))
    router.post("/request/SignIn", requestHandler(SignInInteractor(repositories)))
    return router
}



