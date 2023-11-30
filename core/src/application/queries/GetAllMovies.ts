import {QueryUseCase, UseCaseInvokerFactory} from "../UseCase";
import {Movie} from "../../domain/entities";

export class GetAllMovies extends QueryUseCase<{}, Movie[]> {
    constructor(invokerFactory?: UseCaseInvokerFactory<{}, Movie[]>) {
        super("GetAllMovies", invokerFactory);
    }
}



