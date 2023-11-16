import {QueryTheatreCriteria, QueryTheatres} from "core/dist/application/usecases/queries";
import {Theatre} from "core/dist/domain/entities";
import {Repositories} from "../../repositories";

export function QueryTheatresInteractor(repositories: Repositories): QueryTheatres {
    return QueryTheatres(async (query: { criteria: QueryTheatreCriteria }): Promise<Theatre[]>  => {
        return await repositories.Theatre.queryTheatres(query.criteria);
    })
}

