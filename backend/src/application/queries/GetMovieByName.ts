import {Movie} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories/Repositories";
import {GetMovieByName} from "cinetex-core/dist/application/queries";

export class GetMovieByNameInteractor extends GetMovieByName {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(query: { name: string }): Promise<Movie | undefined> {
        return await this.repositories.Movie.getMovieByName(query.name);
    }
}
