import {Theatre} from "cinetex-core/dist/domain/entities/Theatre";
import {Repositories} from "../repositories/Repositories";
import {GetAllTheatres} from "cinetex-core/dist/application/queries";

export class GetAllTheatresInteractor extends GetAllTheatres {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(query: {}): Promise<Theatre[]> {
        return await this.repositories.Theatre.getAllTheatres();
    }
}
