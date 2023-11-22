import {Theatre} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetTheatreById} from "cinetex-core/dist/application/queries";

export function GetTheatreByIdInteractor(repositories: Repositories): GetTheatreById {
    return GetTheatreById(async (query: { id: string }): Promise<Theatre | undefined>  => {
        return await repositories.Theatre.getTheatreById(query.id);
    })
}

