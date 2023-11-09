import {QueryUseCase} from "../UseCase";
import {Movie} from "../../../domain/entities/Movie";

export type GetAllMovies = QueryUseCase<{}, readonly Movie[]>;
