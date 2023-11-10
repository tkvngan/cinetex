import {QueryUseCase} from "../UseCase";
import {Theatre} from "../../../domain/entities";

export type GetTheatreByName = QueryUseCase<{ name: string }, Theatre | undefined>
