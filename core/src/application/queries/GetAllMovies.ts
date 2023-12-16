import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Movie} from "../../domain/entities";

export class GetAllMovies extends QueryUseCase<{}, Movie[]> {
    constructor(invoker?: UseCaseInvoker<{}, Movie[]>) {
        super("GetAllMovies", invoker);
    }
}



