import {QueryUseCase, UseCaseProperties} from "../UseCase";
import {Movie} from "../../../domain/entities";

export type GetMovieByName = QueryUseCase<{ name: string }, Movie | undefined>

export function GetMovieByName(invoke: (query: { name: string }) => Promise<Movie | undefined>): GetMovieByName {
    return { name: "GetMovieByName", type: "query", invoke }
}


