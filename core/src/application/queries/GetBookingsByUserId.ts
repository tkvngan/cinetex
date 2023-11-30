import {QueryUseCase, UseCaseInvokerFactory} from "../UseCase";
import {Booking} from "../../domain/entities";

export class GetBookingsByUserId extends QueryUseCase<{ userId: string }, Booking[]> {
    constructor(invokerFactory?: UseCaseInvokerFactory<{ userId: string }, Booking[]>) {
        super("GetBookingsByUserId", invokerFactory);
    }
}



