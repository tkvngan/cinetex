import {stopMongoDBMemoryServer} from "../infrastructure/repositories/mongodb/MongoDBUtils";
import {Config} from "@jest/types";

export default async function teardown(globalConfig: Config.GlobalConfig, projectConfig: Config.ProjectConfig) {
    await stopMongoDBMemoryServer()
}
