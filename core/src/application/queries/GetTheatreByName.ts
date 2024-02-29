import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Theatre} from "../../domain/entities/Theatre";

declare module "../index" {
     export interface UseCaseDefinitions {
        readonly GetTheatreByName: GetTheatreByName
    }
}

export class GetTheatreByName extends QueryUseCase<{ name: string }, Theatre | undefined> {
    constructor(invoker?: UseCaseInvoker<{ name: string }, Theatre | undefined>) {
        super(GetTheatreByName.name, invoker);
    }
}



