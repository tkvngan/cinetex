import dotenvExpand from "dotenv-expand";
import dotenv from "dotenv";

export type config = Readonly<{
    PORT: string,
    HOST: string,
    ROOT: string,
    MONGODB_HOST: string,
    MONGODB_PORT: string,
    MONGODB_URI: string,
    MONGODB_DBNAME: string,
    MONGODB_USER: string,
    MONGODB_PASS: string,
    START_MONGODB_MEMORY_SERVER: string,
    INSTALL_SAMPLE_DATA: string
}>

dotenvExpand.expand(dotenv.config())
export const config: config = {
    PORT: "3000",
    HOST: "localhost",
    ROOT: "../frontend/build",
    MONGODB_HOST: "localhost",
    MONGODB_PORT: "27017",
    MONGODB_URI: "mongodb://localhost:27017/",
    MONGODB_DBNAME: "Cinetex",
    MONGODB_USER: "root",
    MONGODB_PASS: "goodExample",
    START_MONGODB_MEMORY_SERVER: "false",
    INSTALL_SAMPLE_DATA: "false",
    ...process.env
}

export default config
