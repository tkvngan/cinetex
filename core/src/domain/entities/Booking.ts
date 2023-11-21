import {Entity, Id} from "../types";
import {ShowTime} from "./Schedule";
import {Column, Row, Theatre} from "./Theatre";
import {User} from "./User";
import {Movie} from "./Movie";

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
    screenId: number
    showDate: string
    showTime: ShowTime
    seat: SeatPosition
    price: number,
}>

export type SeatPosition = Readonly<{
    row: Row
    column: Column
}>
