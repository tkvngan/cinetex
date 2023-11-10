import {QueryUseCase} from "../UseCase";
import {Booking} from "../../../domain/entities";

export type GetBookingsByMovieId = QueryUseCase<{ movieId: string }, Booking[]>
