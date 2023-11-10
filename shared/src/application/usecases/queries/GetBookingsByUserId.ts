import {QueryUseCase} from "../UseCase";
import {Booking} from "../../../domain/entities";

export type GetBookingsByUserId = QueryUseCase<{ userId: string }, Booking[]>
