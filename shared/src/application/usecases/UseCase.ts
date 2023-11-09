export type UseCaseType = "query" | "command" ;

export type UseCaseProperties = {
    readonly name: string;
    readonly type: UseCaseType;
}

export type QueryUseCaseProperties = UseCaseProperties & {
    readonly type: "query";
}

export type CommandUseCaseProperties = UseCaseProperties & {
    readonly type: "command";
}

export type UseCase<Input = any, Output = any> = UseCaseProperties & {
    invoke(input: Input): Promise<Output>;
}

export type QueryUseCase<Query = any, Result = any> = UseCase<Query, Result> & QueryUseCaseProperties

export type CommandUseCase<Command = any> = UseCase<Command, void> & CommandUseCaseProperties
