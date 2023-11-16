import {Entity, Id} from "../types";
import {ShowTime} from "./Schedule";
import {Column, Row} from "./Theatre";

export type Booking = Entity & Readonly<{
    id: Id
    userId: Id
    theatreId: Id,
    bookingTime: string
    totalPrice: number
    tickets: readonly Ticket[]
}>

export type Ticket = Readonly<{
    movieId: Id,
    auditoriumId: number
    showDate: string
    showTime: ShowTime
    seat: SeatPosition
    price: number,
}>

export type SeatPosition = Readonly<{
    row: Row
    column: Column
}>
