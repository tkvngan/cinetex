import {QueryUseCase} from "../UseCase";
import {Movie} from "../../../domain/entities";

export type GetMovieByName = QueryUseCase<{ name: string }, Movie | undefined>
