import {QueryUseCase, UseCaseInvokerFactory} from "../UseCase";
import {Booking} from "../../domain/entities";

export class GetBookingsByTheatreId extends QueryUseCase<{ theatreId: string }, Booking[]> {
    constructor(invokerFactory?: UseCaseInvokerFactory<{ theatreId: string }, Booking[]>) {
        super("GetBookingsByTheatreId", invokerFactory);
    }
}



