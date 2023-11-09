import {QueryUseCase} from "../UseCase";
import {Movie, Rating} from "../../../domain/entities/Movie";

export type GetMovies = QueryUseCase<{
    name?: string,
    cast?: string,
    director?: string,
    theatre?: string,
    genre?: string,
    rating?: Rating
}, readonly Movie[]>;
