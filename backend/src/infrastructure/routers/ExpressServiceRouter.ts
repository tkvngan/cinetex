import express, {Router} from "express"
import {CommandUseCase, QueryUseCase, RequestUseCase, UseCase} from "cinetex-core/dist/application/UseCase"
import {UseCaseCollection} from "cinetex-core/dist/application/UseCaseCollection"
import {ParamsDictionary, Request, RequestHandler} from "express-serve-static-core";
import {StatusCodes} from "http-status-codes";
import {verifySecureToken} from "../../security/SecurityUtils";
import {ParsedQs} from "qs";
import {Credentials} from "cinetex-core/dist/security/Credentials";
import {
    ApplicationException,
    AuthenticationException,
    AuthorizationException
} from "cinetex-core/dist/application/exceptions/Exceptions";
import {Repositories} from "../../application/repositories/Repositories";

export function ExpressServiceRouter(interactors: UseCaseCollection, repositories: Repositories): Router {
    const router: Router = express.Router()

    async function getCredentials(req:  Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<Credentials | undefined> {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1]
            try {
                const credentials = await verifySecureToken(token)
                console.log(`User credentials: ${JSON.stringify(credentials)}`)
                return credentials
            } catch (e: any) {
                console.error(`Failed to verify token: ${token}, error: ${e}, treat user as unauthenticated...`)
            }
        }
        return undefined
    }

    function handleException(e: any, res: any) {
        if (e instanceof AuthenticationException) {
            res.status(StatusCodes.UNAUTHORIZED).json(e)
        } else if (e instanceof AuthorizationException) {
            res.status(StatusCodes.FORBIDDEN).json(e)
        } else if (e instanceof ApplicationException) {
            res.status(StatusCodes.BAD_REQUEST).json(e)
        } else if (e instanceof Error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({exception: {name: e.name, message: e.message}})
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({exception: {name: "UnknownException", message: e.toString()}})
        }
    }

    function logUseCaseInvocation<Query, Result>(interactor: UseCase<Query, Result>, body: any) {
        console.log(`Invoking ${interactor.type} interactor ${interactor.name} with input: ${JSON.stringify(body)}`);
    }

    function queryHandler<Query, Result>(interactor: UseCase<Query, Result>): RequestHandler {
        return async (req, res) => {
            try {
                logUseCaseInvocation(interactor, req.body)
                const credentials = await getCredentials(req)
                await repositories.transaction(async () => {
                    if (credentials !== undefined) {
                        await repositories.User.setUserCredentials(credentials)
                    }
                    try {
                        const result = await interactor.invoke(req.body, credentials)
                        res.status(result !== undefined ? StatusCodes.OK : StatusCodes.NOT_FOUND).json(result).end()
                    } finally {
                        if (credentials !== undefined) {
                            await repositories.User.clearUserCredentials()
                        }
                    }
                });
            } catch (e: any) {
                handleException(e, res)
            }
        }
    }

    function requestHandler<Request, Reply>(interactor: UseCase<Request, Reply>): RequestHandler {
        return async (req, res) => {
            try {
                logUseCaseInvocation(interactor, req.body)
                const credentials = await getCredentials(req)
                if (credentials !== undefined) {
                    await repositories.User.setUserCredentials(credentials)
                }
                try {
                    const result = await interactor.invoke(req.body, credentials)
                    res.status(StatusCodes.OK).json(result).end()
                } finally {
                    if (credentials !== undefined) {
                        await repositories.User.clearUserCredentials()
                    }
                }
            } catch (e: any) {
                handleException(e, res)
            }
        }
    }

    function commandHandler<Command>(interactor: CommandUseCase<Command>): RequestHandler {
        return requestHandler<Command, void>(interactor)
    }

    for (const interactor of interactors) {
        const path = `/${interactor.type}/${interactor.name}`
        console.log(`Registering ${interactor.type} interactor: ${interactor.name} to path: ${path}`)
        switch (interactor.type) {
        case "query":
            router.post(path, queryHandler(interactor as QueryUseCase))
            break;
        case "command":
            router.post(path, commandHandler(interactor as CommandUseCase))
            break;
        case "request":
            router.post(path, requestHandler(interactor as RequestUseCase))
            break;
        default:
            throw new Error(`Unknown interactor type: ${interactor.type}`)
        }
    }
    return router
}



