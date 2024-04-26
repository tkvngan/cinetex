import {Entity, Id} from "../types/Entity";
import {Column, Row} from "./Theatre";

export interface Booking extends Entity {
    readonly id: Id
    readonly userId: Id
    readonly theatreId: Id,
    readonly bookingTime: string
    readonly totalPrice: number
    readonly tickets: readonly Ticket[]
}

export interface Ticket {
    readonly movieId: Id,
    readonly screenId: number
    readonly showDate: string
    readonly showTime: string
    readonly seat: SeatPosition
    readonly price: number,
    readonly ticketNo?: number,
    readonly token?: string,
}

export interface SeatPosition {
    readonly row: Row
    readonly column: Column
}
