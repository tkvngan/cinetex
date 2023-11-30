import {QueryUseCase, UseCaseInvokerFactory} from "../UseCase";
import {Booking} from "../../domain/entities";

export class GetBookingsByMovieId extends QueryUseCase<{ movieId: string }, Booking[]> {
    constructor(invokerFactory?: UseCaseInvokerFactory<{ movieId: string }, Booking[]>) {
        super("GetBookingsByMovieId", invokerFactory);
    }
}



