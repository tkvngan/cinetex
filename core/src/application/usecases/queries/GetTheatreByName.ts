import {QueryUseCase} from "../UseCase";
import {Theatre} from "../../../domain/entities";

export type GetTheatreByName = QueryUseCase<{ name: string }, Theatre | undefined>

export function GetTheatreByName(invoke: (query: { name: string }) => Promise<Theatre | undefined>): GetTheatreByName {
    return { name: "GetTheatreByName", type: "query", invoke }
}


