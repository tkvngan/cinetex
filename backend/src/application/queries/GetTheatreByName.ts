import {Theatre} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetTheatreByName} from "cinetex-core/dist/application/queries";

export function GetTheatreByNameInteractor(repositories: Repositories): GetTheatreByName {
    return GetTheatreByName(async (query: { name: string }): Promise<Theatre | undefined>  => {
        return await repositories.Theatre.getTheatreByName(query.name);
    })
}

