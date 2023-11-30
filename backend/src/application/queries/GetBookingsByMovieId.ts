import {Booking} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetBookingsByMovieId} from "cinetex-core/dist/application/queries";

export class GetBookingsByMovieIdInteractor extends GetBookingsByMovieId {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(query: { movieId: string }): Promise<Booking[]> {
        return await this.repositories.Booking.getBookingsByMovieId(query.movieId);
    }
}
