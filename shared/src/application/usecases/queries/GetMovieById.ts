import {QueryUseCase} from "../UseCase";
import {Id} from "../../../domain/types/Entity";
import {Movie} from "../../../domain/entities/Movie";

export type GetMovieById = QueryUseCase<{ movieId: Id }, (Movie | undefined)>;
