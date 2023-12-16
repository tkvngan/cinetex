import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Booking} from "../../domain/entities";

export class GetBookingsByTheatreId extends QueryUseCase<{ theatreId: string }, Booking[]> {
    constructor(invoker?: UseCaseInvoker<{ theatreId: string }, Booking[]>) {
        super("GetBookingsByTheatreId", invoker);
    }
}



