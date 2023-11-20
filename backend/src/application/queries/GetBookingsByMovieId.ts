import {Booking} from "core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetBookingsByMovieId} from "core/dist/application/queries";

export function GetBookingsByMovieIdInteractor(repositories: Repositories): GetBookingsByMovieId {
    return GetBookingsByMovieId(async (query: { movieId: string }): Promise<Booking[]>  => {
        return await repositories.Booking.getBookingsByMovieId(query.movieId);
    })
}

