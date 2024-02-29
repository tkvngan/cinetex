import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Theatre} from "../../domain/entities/Theatre";

declare module "../index" {
     export interface UseCaseDefinitions {
        readonly GetAllTheatres: GetAllTheatres
    }
}

export class GetAllTheatres extends QueryUseCase<{}, Theatre[]> {
    constructor(invoker?: UseCaseInvoker<{}, Theatre[]>) {
        super(GetAllTheatres.name, invoker);
    }
}



