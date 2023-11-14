import {Booking} from "shared/dist/domain/entities";
import {Repositories} from "../../repositories";
import {GetBookingsByMovieId} from "shared/dist/application/usecases/queries";

export function GetBookingsByMovieIdInteractor(repositories: Repositories): GetBookingsByMovieId {
    return GetBookingsByMovieId(async (query: { movieId: string }): Promise<Booking[]>  => {
        return await repositories.Booking.getBookingsByMovieId(query.movieId);
    })
}

