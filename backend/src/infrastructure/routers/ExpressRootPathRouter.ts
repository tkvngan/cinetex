import {RequestHandler} from "express-serve-static-core";
import proxy from "express-http-proxy";
import path from "path";
import express from "express";

export function ExpressRootPathRouter(): RequestHandler {
    const root = process.env.ROOT
    if (root) {
        if (root.startsWith("http://") || root.startsWith("https://")) {
            console.log("Proxying root path requests to " + root)
            return proxy(root)
        } else {
            console.log("Serving root path with static files from " + path.resolve(root))
            return express.static(path.resolve(root))
        }
    } else {
        console.error("ROOT environment variable not set. Serving root path with error message.")
        return (req, res) => {
            res.status(500).json({error: "ROOT not set."})
        }
    }
}
