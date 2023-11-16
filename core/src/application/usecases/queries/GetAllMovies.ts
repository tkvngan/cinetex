import {QueryUseCase} from "../UseCase";
import {Movie} from "../../../domain/entities";

export type GetAllMovies = QueryUseCase<{}, Movie[]>

export function GetAllMovies(invoke: (query: {}) => Promise<Movie[]>): GetAllMovies {
    return { name: "GetAllMovies", type: "query", invoke }
}


