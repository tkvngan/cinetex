import Axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import {UseCase, UseCaseInvoker} from "cinetex-core/dist/application/UseCase";
import {Credentials} from "cinetex-core/dist/security/Credentials";
import {StatusCodes} from "http-status-codes";
import {toException} from "cinetex-core/dist/application/exceptions/Exceptions";

export function AxiosUseCaseInvoker<Input = any, Output = any>(config: AxiosInstance | string): UseCaseInvoker<Input, Output> {
    const axios = typeof config === "string" ? Axios.create({baseURL: config}) : config
    return async function(this: UseCase, request: Input, credentials?: Credentials): Promise<Output> {
        const headers: AxiosRequestConfig["headers"] = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
        if (credentials) {
            headers["Authorization"] = `Bearer ${credentials.token}`
        }
        const path = `/${this.type}/${this.name}`
        const requestConfig: AxiosRequestConfig = {
            url: path,
            method: "POST",
            responseType: "json",
            responseEncoding: "utf8",
            headers: headers,
            data: request,
            validateStatus: (status) => true
        }
        const response = await axios(requestConfig)
        if (response.status === StatusCodes.OK) {
            if (response.data !== undefined && response.data !== "") {
                return response.data as Output
            }
            return undefined as Output
        } else if (response.status === StatusCodes.NOT_FOUND) {
            if (this.type === "query") {
                return undefined as Output
            }
        }
        const errorMessage = `Failed to invoke ${this.type} usecase ${this.name}, status: ${response.status}, data: ${JSON.stringify(response.data)}`
        console.error(errorMessage)
        if (response.data && typeof response.data === "object" && response.data.exception) {
            throw toException(response.data)
        }
        throw Error(errorMessage)
    }
}
