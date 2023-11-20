import {Theatre} from "core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetAllTheatres} from "core/dist/application/queries";

export function GetAllTheatresInteractor(repositories: Repositories): GetAllTheatres {
    return GetAllTheatres(async (query: {}): Promise<Theatre[]>  => {
        return await repositories.Theatre.getAllTheatres();
    })
}

