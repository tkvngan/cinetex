import {QueryUseCase} from "../UseCase";
import {Movie} from "../../../domain/entities";

export type GetMovieById = QueryUseCase<{ id: string }, Movie | undefined>

export function GetMovieById(invoke: (query: { id: string }) => Promise<Movie | undefined>): GetMovieById {
    return { name: "GetMovieById", type: "query", invoke }
}


