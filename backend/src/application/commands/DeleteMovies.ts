import {DeleteMovies} from "cinetex-core/dist/application/commands";
import {Repositories} from "../repositories";
import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";
import {UnauthorizedException} from "cinetex-core/dist/application/exceptions/Exceptions";

export class DeleteMoviesInteractor extends DeleteMovies {
    constructor(readonly repositories: Repositories) {
        super();
    }

    override async invoke(input: string[], credentials?: SecurityCredentials): Promise<void> {
        if (credentials && credentials.user.roles.includes("admin")) {
            for (const id of input) {
                await this.repositories.Movie.deleteMovieById(id);
            }
        } else {
            throw new UnauthorizedException("Only admins can delete movies")
        }
    }
}
