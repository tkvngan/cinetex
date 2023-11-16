import {RequestHandler} from "express-serve-static-core";
import proxy from "express-http-proxy";
import path from "path";
import express from "express";

export function ExpressRootPathRouter(root?: string): RequestHandler {
    if (root) {
        if (root.startsWith("http://") || root.startsWith("https://")) {
            console.log("Root path is served by proxying to " + root)
            return proxy(root)
        } else {
            console.log("Root path is served with static files in directory: " + path.resolve(root))
            return express.static(path.resolve(root))
        }
    } else {
        console.error("Root path routing not specified. Serving root path with error message.")
        return (req, res) => {
            res.status(500).json({error: "ROOT not set."})
        }
    }
}
