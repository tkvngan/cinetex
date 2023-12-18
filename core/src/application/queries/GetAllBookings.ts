import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Booking} from "../../domain/entities";

declare module "../" {
    interface UseCaseDefinitions {
        readonly GetAllBookings: GetAllBookings
    }
}

export class GetAllBookings extends QueryUseCase<{}, Booking[]> {
    constructor(invoker?: UseCaseInvoker<{}, Booking[]>) {
        super(GetAllBookings.name, invoker);
    }
}
