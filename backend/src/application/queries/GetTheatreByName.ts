import {Theatre} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetTheatreByName} from "cinetex-core/dist/application/queries";

export class GetTheatreByNameInteractor extends GetTheatreByName {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(query: { name: string }): Promise<Theatre | undefined> {
        return await this.repositories.Theatre.getTheatreByName(query.name);
    }
}
