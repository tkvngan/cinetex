import {Entity, Id} from "../types/Entity";
import {Schedule, ShowTime} from "./Schedule";
import {Column, Row} from "./Theatre";

export type Booking = Entity & Readonly<{
    id: Id
    userId: Id
    theatreId: Id,
    bookingTime: string
    totalPrice: number
    bookingItems: readonly BookingItem[]
}>

export type BookingItem = Readonly<{
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
