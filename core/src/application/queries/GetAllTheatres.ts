import {QueryUseCase} from "../UseCase";
import {Theatre} from "../../domain/entities";

export type GetAllTheatres = QueryUseCase<{}, Theatre[]>

export function GetAllTheatres(invoke: (query: {}) => Promise<Theatre[]>): GetAllTheatres {
    return { name: "GetAllTheatres", type: "query", invoke }
}


