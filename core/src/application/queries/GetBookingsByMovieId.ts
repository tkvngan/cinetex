import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Booking} from "../../domain/entities";

export class GetBookingsByMovieId extends QueryUseCase<{ movieId: string }, Booking[]> {
    constructor(invoker?: UseCaseInvoker<{ movieId: string }, Booking[]>) {
        super("GetBookingsByMovieId", invoker);
    }
}



