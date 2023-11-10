import {QueryUseCase} from "../UseCase";
import {Booking} from "../../../domain/entities";

export type GetBookingsByTheatreId = QueryUseCase<{ theatreId: string }, Booking[]>
