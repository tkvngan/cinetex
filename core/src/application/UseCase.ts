import {SecurityCredentials} from "../security/SecurityCredentials";

export type UseCaseType = "query" | "command" | "request";

export type UseCaseInvoker<Input = any, Output = any> = (input: Input, credentials?: SecurityCredentials) => Promise<Output>

export type UseCaseInvokerFactory<Input = any, Output = any> = (usecase: UseCase<Input, Output>) => UseCaseInvoker<Input, Output>

export abstract class UseCase<Input = any, Output = any> {

    protected readonly invoker: UseCaseInvoker<Input, Output>;

    protected constructor(
        readonly name: string,
        readonly type: UseCaseType,
        invokerFactory?: UseCaseInvokerFactory<Input, Output>
    ) {
        this.invoker = invokerFactory ? invokerFactory(this) : () => {
            throw new Error("invoker not initialized")
        }
    }

    invoke(input: Input, credentials?: SecurityCredentials): Promise<Output> {
        return this.invoker(input, credentials);
    }

    toString() {
        return `${this.type}:${this.name}`
    }

}

export abstract class QueryUseCase<Query = any, Result = any> extends UseCase<Query, Result> {
    protected constructor(
        readonly name: string,
        invokerFactory?: UseCaseInvokerFactory<Query, Result>) {
        super(name, "query", invokerFactory);
    }
}

export abstract class CommandUseCase<Command = any> extends UseCase<Command, void> {
    protected constructor(
        readonly name: string,
        invokerFactory?: UseCaseInvokerFactory<Command, any>) {
        super(name, "command", invokerFactory);
    }
}

export abstract class RequestUseCase<Request = any, Reply = any> extends UseCase<Request, Reply> {
    protected constructor(
        readonly name: string,
        invokerFactory?: UseCaseInvokerFactory<Request, Reply>) {
        super(name, "request", invokerFactory);
    }
}
