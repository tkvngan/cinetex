import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import {UseCase, UseCaseInvokerFactory} from "cinetex-core/dist/application";
import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";
import {StatusCodes} from "http-status-codes";
import {toException} from "cinetex-core/dist/application/exceptions/Exceptions";

export function AxiosUseCaseInvokerFactory<Input = any, Output = any>(config: AxiosInstance | string): UseCaseInvokerFactory<Input, Output> {
    const axiosInstance = typeof config === "string" ? axios.create({baseURL: config}) : config
    return (usecase: UseCase<Input, Output>) => async (request: Input, credentials?: SecurityCredentials): Promise<Output> => {
        const headers: AxiosRequestConfig["headers"] = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
        if (credentials) {
            headers["Authorization"] = `Bearer ${credentials.token}`
        }
        const path = `/${usecase.type}/${usecase.name}`
        const requestConfig: AxiosRequestConfig = {
            url: path,
            method: usecase.type === "query" ? "GET" : "POST",
            responseType: "json",
            responseEncoding: "utf8",
            headers: headers,
            data: request,
            validateStatus: (status) => true
        }
        const response = await axiosInstance(requestConfig)
        if (response.status === StatusCodes.OK) {
            if (response.data !== undefined && response.data !== "") {
                return response.data as Output
            }
            return undefined as Output
        } else if (response.status === StatusCodes.NOT_FOUND) {
            if (usecase.type === "query") {
                return undefined as Output
            }
        }
        const errorMessage = `Failed to invoke ${usecase.type} usecase ${usecase.name}, status: ${response.status}, data: ${JSON.stringify(response.data)}`
        console.error(errorMessage)
        if (response.data && typeof response.data === "object" && response.data.exception) {
            throw toException(response.data)
        }
        throw Error(errorMessage)
    }
}
