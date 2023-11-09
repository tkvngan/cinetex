import {QueryUseCase} from "../UseCase";
import {Movie} from "../../../domain/entities/Movie";

export type GetMovieByName = QueryUseCase<{ movieName: string }, Movie | undefined>;
