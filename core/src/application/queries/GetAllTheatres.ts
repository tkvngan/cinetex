import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Theatre} from "../../domain/entities";

declare module "../" {
    interface UseCaseDefinitions {
        readonly GetAllTheatres: GetAllTheatres
    }
}

export class GetAllTheatres extends QueryUseCase<{}, Theatre[]> {
    constructor(invoker?: UseCaseInvoker<{}, Theatre[]>) {
        super(GetAllTheatres.name, invoker);
    }
}



