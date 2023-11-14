import {QueryTheatres, QueryTheatreCriteria} from "shared/dist/application/usecases/queries";
import {Theatre} from "shared/dist/domain/entities";
import {Repositories} from "../../repositories";

export function QueryTheatresInteractor(repositories: Repositories): QueryTheatres {
    return QueryTheatres(async (query: { criteria: QueryTheatreCriteria }): Promise<Theatre[]>  => {
        return await repositories.Theatre.queryTheatres(query.criteria);
    })
}

