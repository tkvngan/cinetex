import {GetMoviesByQuery, MoviesQuery} from "cinetex-core/dist/application/queries";
import {Movie} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories/Repositories";

export class GetMoviesByQueryInteractor extends GetMoviesByQuery {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(query: MoviesQuery): Promise<Movie[]> {
        return await this.repositories.Movie.getMoviesByQuery(query);
    }
}
