import {QueryUseCase, UseCaseProperties} from "../UseCase";
import {Booking} from "../../../domain/entities";

export type GetBookingsByMovieId = QueryUseCase<{ movieId: string }, Booking[]>

export function GetBookingsByMovieId(invoke: (query: { movieId: string }) => Promise<Booking[]>): GetBookingsByMovieId {
    return { name: "GetBookingsByMovieId", type: "query", invoke }
}


