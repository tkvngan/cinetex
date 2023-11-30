import {QueryUseCase, UseCaseInvokerFactory} from "../UseCase";
import {Theatre} from "../../domain/entities";

export class GetTheatreById extends QueryUseCase<{ id: string }, Theatre | undefined> {
    constructor(invokerFactory?: UseCaseInvokerFactory<{ id: string }, Theatre | undefined>) {
        super("GetTheatreById", invokerFactory);
    }
}



