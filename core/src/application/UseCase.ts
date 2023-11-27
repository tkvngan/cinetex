export type UseCaseType = "query" | "command" | "request";

export interface UseCaseProperties<T extends UseCaseType = UseCaseType> {
    readonly name: string;
    readonly type: T;
    readonly parameters?: [key: string, type: "string" | "number" | "boolean"][]
}

export type UseCaseInvoker<Input, Output> = (input: Input) => Promise<Output>

export interface UseCase<Input = any, Output = any> extends UseCaseProperties {
    readonly name: string;
    readonly type: UseCaseType;
    invoke(input: Input): Promise<Output>;
}

export interface QueryUseCase<Query = any, Result = any> extends UseCase<Query, Result>, UseCaseProperties<"query"> {
    readonly type: "query";
}

export interface CommandUseCase<Command = any> extends UseCase<Command, void>, UseCaseProperties<"command"> {
    readonly type: "command";
}

export interface RequestUseCase<Request = any, Reply = any> extends UseCase<Request, Reply>, UseCaseProperties<"request"> {
    readonly type: "request";
}

export function UseCase<Type extends UseCaseType, Input = any, Output = any>(properties: UseCaseProperties<Type>, invoke: UseCaseInvoker<Input, Output>): UseCase<Input, Output> {
    return {
        ...properties,
        invoke
    }
}

export function QueryUseCase<Query = any, Result = any>(name: string, invoke: (input: Query) => Promise<Result>): QueryUseCase<Query, Result> {
    return UseCase({ name, type: "query" }, invoke) as QueryUseCase<Query, Result>;
}

export function CommandUseCase<Command = any>(name: string, invoke: (input: Command) => Promise<void>): CommandUseCase<Command> {
    return UseCase({ name, type: "command" }, invoke) as CommandUseCase<Command>;
}

export function RequestUseCase<Request = any, Reply = any>(name: string, invoke: (input: Request) => Promise<Reply>): RequestUseCase<Request, Reply> {
    return UseCase({ name, type: "request" }, invoke) as RequestUseCase<Request>;
}
