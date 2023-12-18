import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Booking} from "../../domain/entities";

declare module "../" {
    interface UseCaseDefinitions {
        readonly GetBookingsByMovieId: GetBookingsByMovieId
    }
}

export class GetBookingsByMovieId extends QueryUseCase<{ movieId: string }, Booking[]> {
    constructor(invoker?: UseCaseInvoker<{ movieId: string }, Booking[]>) {
        super(GetBookingsByMovieId.name, invoker);
    }
}



