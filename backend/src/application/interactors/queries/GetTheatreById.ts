import {Theatre} from "core/dist/domain/entities";
import {Repositories} from "../../repositories";
import {GetTheatreById} from "core/dist/application/usecases/queries";

export function GetTheatreByIdInteractor(repositories: Repositories): GetTheatreById {
    return GetTheatreById(async (query: { id: string }): Promise<Theatre | undefined>  => {
        return await repositories.Theatre.getTheatreById(query.id);
    })
}

