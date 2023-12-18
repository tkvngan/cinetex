import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Movie} from "../../domain/entities";

declare module "../" {
    interface UseCaseDefinitions {
        readonly GetAllMovies: GetAllMovies
    }
}

export class GetAllMovies extends QueryUseCase<{}, Movie[]> {
    constructor(invoker?: UseCaseInvoker<{}, Movie[]>) {
        super(GetAllMovies.name, invoker);
    }
}



