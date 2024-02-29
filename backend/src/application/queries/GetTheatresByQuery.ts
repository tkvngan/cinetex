import {GetTheatresByQuery, TheatresQuery} from "cinetex-core/dist/application/queries";
import {Theatre} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories/Repositories";

export class GetTheatresByQueryInteractor extends GetTheatresByQuery {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(query: TheatresQuery): Promise<Theatre[]> {
        return await this.repositories.Theatre.getTheatresByQuery(query);
    }
}
