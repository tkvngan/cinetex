import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Theatre} from "../../domain/entities";

export class GetTheatreById extends QueryUseCase<{ id: string }, Theatre | undefined> {
    constructor(invoker?: UseCaseInvoker<{ id: string }, Theatre | undefined>) {
        super(GetTheatreById.name, invoker);
    }
}



