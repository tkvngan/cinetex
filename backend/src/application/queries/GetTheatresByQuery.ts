import {TheatresQuery, GetTheatresByQuery} from "cinetex-core/dist/application/queries";
import {Theatre} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories";

export function GetTheatresByQueryInteractor(repositories: Repositories): GetTheatresByQuery {
    return GetTheatresByQuery(async (query: TheatresQuery): Promise<Theatre[]>  => {
        return await repositories.Theatre.getTheatresByQuery(query);
    })
}

