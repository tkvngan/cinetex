import {Entity, Id} from "../types/Entity";
import {Show, ShowTime} from "./Show";
import {Column, Row} from "./Theatre";

export type Booking = Entity & Readonly<{
    id: Id
    userId: Id
    bookingTime: Date
    totalPrice: number,
    bookingItems: readonly BookingItem[]
}>

export type BookingItem = Readonly<{
    showId: Id
    showDate: Date
    showTime: ShowTime
    seat: readonly [Row, Column]
    price: number
}>
