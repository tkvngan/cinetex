import {Theatre} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories/Repositories";
import {GetTheatreById} from "cinetex-core/dist/application/queries";

export class GetTheatreByIdInteractor extends GetTheatreById {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(query: { id: string }): Promise<Theatre | undefined> {
        return await this.repositories.Theatre.getTheatreById(query.id);
    }
}
