import {Movie} from "cinetex-core/dist/domain/entities";
import {GetAllMovies} from "cinetex-core/dist/application/queries";
import {Repositories} from "../repositories/Repositories";

export class GetAllMoviesInteractor extends GetAllMovies {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(query: {}): Promise<Movie[]> {
        return await this.repositories.Movie.getAllMovies();
    }
}

