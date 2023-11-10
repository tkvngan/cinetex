import {QueryUseCase} from "../UseCase";
import {Booking} from "../../../domain/entities";

export type GetBookingById = QueryUseCase<{ id: string }, Booking | undefined>
