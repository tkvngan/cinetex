import {QueryUseCase} from "../UseCase";
import {Booking} from "../../../domain/entities";

export type GetAllBookings = QueryUseCase<{}, Booking[]>
