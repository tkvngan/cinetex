import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Booking} from "../../domain/entities";

export class GetBookingsByUserId extends QueryUseCase<{ userId: string }, Booking[]> {
    constructor(invoker?: UseCaseInvoker<{ userId: string }, Booking[]>) {
        super("GetBookingsByUserId", invoker);
    }
}



