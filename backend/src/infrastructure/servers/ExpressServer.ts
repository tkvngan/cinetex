import express, {NextFunction, Request, Response} from 'express';
import morgan from "morgan"
import cors from "cors";
import http, {Server} from "http";
import {RequestHandler} from "express-serve-static-core";

export function ExpressServer(routers: [path: string, router: RequestHandler][]): Server {
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(morgan('dev'));
    app.use(logErrors)
    app.use(errorHandler)
    for (const [path, router] of routers) {
        console.log("Registering router at path " + path);
        app.use(path, router);
    }
    return http.createServer(app);
}

function logErrors(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack)
    next(err)
}

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500).json({ error: err.message })
}
