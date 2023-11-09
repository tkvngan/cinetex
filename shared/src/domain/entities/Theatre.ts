import {Entity, Id} from "../types/Entity";
import {Address} from "../types/Address";

export type Row = number
export type Column = number

export type Theatre = Entity & Readonly<{
    id: Id;
    name: string;
    location: Address;
    screens: readonly Screen[];
}>

export type Screen = Readonly<{
    id: number;
    name: string;
    rows: number;
    columns: number;
    seats: readonly Seat[];
}>

export type Seat = Readonly<{
    row: number;
    column: number;
    priceClass: SeatClass;
}>

export type SeatClass = "economy" | "standard" | "luxury"

export const SeatClasses: readonly SeatClass[] = ["economy", "standard", "luxury"] as const
