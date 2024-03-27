import {CommandUseCase, UseCaseInvoker} from "../UseCase";
import {Booking} from "../../domain/entities/Booking";


declare module "../index" {
     export interface UseCaseDefinitions {
        readonly CreateBooking: CreateBooking
    }
}

export class CreateBooking extends CommandUseCase<Booking> {
    constructor(invoker?: UseCaseInvoker<Booking, void>) {
        super("CreateBooking", invoker);
    }
}
