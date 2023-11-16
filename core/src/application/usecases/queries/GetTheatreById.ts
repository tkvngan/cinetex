import {QueryUseCase} from "../UseCase";
import {Theatre} from "../../../domain/entities";

export type GetTheatreById = QueryUseCase<{ id: string }, Theatre | undefined>

export function GetTheatreById(invoke: (query: { id: string }) => Promise<Theatre | undefined>): GetTheatreById {
    return { name: "GetTheatreById", type: "query", invoke }
}


