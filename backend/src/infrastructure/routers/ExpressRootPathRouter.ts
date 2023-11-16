import {RequestHandler} from "express-serve-static-core";
import proxy from "express-http-proxy";
import path from "path";
import express, {NextFunction, Request, Response, Router} from "express";
import isUrlHttp from 'is-url-http';
import fs from "fs";

export function ExpressRootPathRouter(roots: string): RequestHandler {
    const router = express.Router()
    for (const root of roots.split(",")) {
        registerStaticHandler(router, root)
        registerProxyHandler(router, root)
    }
    registerErrorHandler(router)
    return router
}

function registerProxyHandler(router: Router, root: string) {
    if (isUrlHttp(root)) {
        router.use(proxy(root, {
            timeout: 5000,
            proxyErrorHandler: (err, res, next) => {
                console.log(`Proxy error: ${JSON.stringify(err)}; path: ${res.req.url}`)
                next()
            }
        }))
        console.log("Registered root path router with proxy to:", root)
    }
}

function registerStaticHandler(router: Router, root: string) {
    const realPath = tryOrUndefined(() => fs.realpathSync(root))
    if (realPath && fs.statSync(realPath).isDirectory()) {
        router.use(express.static(realPath))
        router.get("*", (req, res, next) => {
            if (path.extname(req.path) === "") {
                res.sendFile(path.resolve(realPath, "index.html"))
            }
        })
        console.log("Registered root path router with static path:", realPath)
    }
}

function registerErrorHandler(router: Router) {
    router.use((err: any, req: Request, res: Response, next: NextFunction) => {
        if (res.headersSent) {
            return next(err)
        }
        res.status(500).json({error: err.message})
    })
}

function tryOrUndefined<T>(fn: () => T): T | undefined {
    try {
        return fn()
    } catch (e) {
        return undefined
    }
}

