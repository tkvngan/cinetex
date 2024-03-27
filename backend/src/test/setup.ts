import {startMongoDBMemoryServer} from "../infrastructure/repositories/mongodb/MongoDBUtils";
import {Config} from "@jest/types"
import {JestConfigWithTsJest} from "ts-jest";


export default async function setup(globalConfig: Config.GlobalConfig, projectConfig: Config.ProjectConfig) {
    await startMongoDBMemoryServer()
}
