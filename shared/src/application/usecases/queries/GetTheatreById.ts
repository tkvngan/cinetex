import {QueryUseCase} from "../UseCase";
import {Theatre} from "../../../domain/entities";

export type GetTheatreById = QueryUseCase<{ id: string }, Theatre | undefined>
