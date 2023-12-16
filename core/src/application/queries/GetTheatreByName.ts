import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Theatre} from "../../domain/entities";

export class GetTheatreByName extends QueryUseCase<{ name: string }, Theatre | undefined> {
    constructor(invoker?: UseCaseInvoker<{ name: string }, Theatre | undefined>) {
        super("GetTheatreByName", invoker);
    }
}



