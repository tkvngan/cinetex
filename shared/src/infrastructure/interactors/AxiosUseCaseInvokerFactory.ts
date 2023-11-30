import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import {UseCase, UseCaseInvokerFactory} from "cinetex-core/dist/application";
import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";
import {StatusCodes} from "http-status-codes";

export function AxiosUseCaseInvokerFactory<Input = any, Output = any>(config: AxiosInstance | string): UseCaseInvokerFactory<Input, Output> {
    const axiosInstance = typeof config === "string" ? axios.create({baseURL: config}) : config
    return (usecase: UseCase<Input, Output>) => async (request: Input, credentials?: SecurityCredentials): Promise<Output> => {
        const headers: AxiosRequestConfig["headers"] = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
        if (credentials) {
            headers["Authorization"] = `Bearer ${credentials.jwtToken}`
        }
        const response = await axiosInstance({
            url: `/${usecase.type}/${usecase.name}`,
            method: usecase.type === "query" ? "GET" : "POST",
            responseType: "json",
            responseEncoding: "utf8",
            headers: headers,
            data: request,
            validateStatus: status => {
                return (status === StatusCodes.OK) || (status === StatusCodes.NOT_FOUND && usecase.type === "query")
            },
        })
        if (response.status === StatusCodes.OK && (response.data !== undefined && response.data !== "")) {
            return response.data as Output
        }
        return undefined as Output
    }
}
