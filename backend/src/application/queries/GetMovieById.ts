import {Movie} from "cinetex-core/dist/domain/entities/Movie";
import {Repositories} from "../repositories/Repositories";
import {GetMovieById} from "cinetex-core/dist/application/queries";

export class GetMovieByIdInteractor extends GetMovieById {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(query: { id: string }): Promise<Movie | undefined> {
        return await this.repositories.Movie.getMovieById(query.id);
    }
}
