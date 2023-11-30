import {ByPattern, ByRange} from "./QueryCriteria";
import {QueryUseCase, UseCaseInvokerFactory} from "../UseCase";
import {Theatre} from "../../domain/entities";

export type TheatresQuery = {
    id: string | [string];
    name?: never;
    location?: never;
    screenCount?: never;
} | {
    id?: never;
    name?: string | [string] |ByPattern;
    location?: ByPattern;
    screenCount?: number | ByRange<number>;
}

export class GetTheatresByQuery extends QueryUseCase<TheatresQuery, Theatre[]> {
    constructor(invokerFactory?: UseCaseInvokerFactory<TheatresQuery, Theatre[]>) {
        super("GetTheatresByQuery", invokerFactory);
    }
}

