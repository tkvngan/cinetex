import {Theatre} from "core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetTheatreByName} from "core/dist/application/queries";

export function GetTheatreByNameInteractor(repositories: Repositories): GetTheatreByName {
    return GetTheatreByName(async (query: { name: string }): Promise<Theatre | undefined>  => {
        return await repositories.Theatre.getTheatreByName(query.name);
    })
}

