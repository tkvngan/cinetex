import {QueryUseCase} from "../UseCase";
import {Movie} from "../../../domain/entities";

export type GetMovieById = QueryUseCase<{ id: string }, Movie | undefined>
