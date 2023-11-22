import {Theatre} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetAllTheatres} from "cinetex-core/dist/application/queries";

export function GetAllTheatresInteractor(repositories: Repositories): GetAllTheatres {
    return GetAllTheatres(async (query: {}): Promise<Theatre[]>  => {
        return await repositories.Theatre.getAllTheatres();
    })
}

