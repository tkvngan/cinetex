import {TheatresQuery, GetTheatresByQuery} from "core/dist/application/usecases/queries";
import {Theatre} from "core/dist/domain/entities";
import {Repositories} from "../../repositories";

export function GetTheatresByQueryInteractor(repositories: Repositories): GetTheatresByQuery {
    return GetTheatresByQuery(async (query: TheatresQuery): Promise<Theatre[]>  => {
        return await repositories.Theatre.queryTheatres(query);
    })
}

