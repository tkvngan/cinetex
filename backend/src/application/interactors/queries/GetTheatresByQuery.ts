import {GetTheatresByQuery, QueryCriteria, QueryPattern, QueryRange} from "shared/dist/application/usecases/queries";
import {Theatre} from "shared/dist/domain/entities";
import {Repositories} from "../../repositories";

export type TheatreQueryCriteria = QueryCriteria & {
    name?: string | QueryPattern;
    location?: QueryPattern;
    screenCount?: number | QueryRange<number>;
}

export function GetTheatresByQueryInteractor(repositories: Repositories): GetTheatresByQuery {
    return GetTheatresByQuery(async (query: { criteria: TheatreQueryCriteria }): Promise<Theatre[]>  => {
        return await repositories.Theatre.getTheatresByQuery(query.criteria);
    })
}


