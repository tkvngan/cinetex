import {Theatre} from "shared/dist/domain/entities";
import {Repositories} from "../../repositories";
import {GetAllTheatres} from "shared/dist/application/usecases/queries";

export function GetAllTheatresInteractor(repositories: Repositories): GetAllTheatres {
    return GetAllTheatres(async (query: {}): Promise<Theatre[]>  => {
        return await repositories.Theatre.getAllTheatres();
    })
}


