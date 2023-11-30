import {QueryUseCase, UseCaseInvokerFactory} from "../UseCase";
import {Theatre} from "../../domain/entities";

export class GetTheatreByName extends QueryUseCase<{ name: string }, Theatre | undefined> {
    constructor(invokerFactory?: UseCaseInvokerFactory<{ name: string }, Theatre | undefined>) {
        super("GetTheatreByName", invokerFactory);
    }
}



