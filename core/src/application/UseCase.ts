import {SecurityCredentials} from "../security/SecurityCredentials";

export type UseCaseType = "query" | "command" | "request";

export type UseCaseInvoker<Input = any, Output = any> = (this: UseCase, input: Input, credentials?: SecurityCredentials) => Promise<Output>

export abstract class UseCase<Input = any, Output = any> {

    protected constructor(
        readonly name: string,
        readonly type: UseCaseType,
        readonly invoker?: UseCaseInvoker<Input, Output>
    ) {}

    invoke(input: Input, credentials?: SecurityCredentials): Promise<Output> {
        if (this.invoker) {
            return this.invoker(input, credentials)
        }
        return Promise.reject(new Error("Invoker not set"));
    }

    toString() {
        return `${this.type}:${this.name}`
    }
}

export abstract class QueryUseCase<Query = any, Result = any> extends UseCase<Query, Result> {
    protected constructor(
        name: string,
        invoker?: UseCaseInvoker<Query, Result>) {
        super(name, "query", invoker);
    }
}

export abstract class CommandUseCase<Command = any> extends UseCase<Command, void> {
    protected constructor(
        name: string,
        invoker?: UseCaseInvoker<Command, any>) {
        super(name, "command", invoker);
    }
}

export abstract class RequestUseCase<Request = any, Reply = any> extends UseCase<Request, Reply> {
    protected constructor(
        name: string,
        invoker?: UseCaseInvoker<Request, Reply>) {
        super(name, "request", invoker);
    }
}
