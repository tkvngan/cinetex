import {QueryUseCase, UseCaseInvokerFactory} from "../UseCase";
import {Theatre} from "../../domain/entities";

export class GetAllTheatres extends QueryUseCase<{}, Theatre[]> {
    constructor(invokerFactory?: UseCaseInvokerFactory<{}, Theatre[]>) {
        super("GetAllTheatres", invokerFactory);
    }
}



