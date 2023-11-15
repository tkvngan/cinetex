import {Entity, Id} from "../types";
import {Address} from "../types";

export type Row = number
export type Column = number

export type Theatre = Entity & Readonly<{
    id: Id;
    name: string;
    location: Address;
    auditoriums: readonly Auditorium[];
    imageUrl?: string;
}>

export type Auditorium = Readonly<{
    id: number;
    name: string;
    rows: number;
    columns: number;
    sideColumns: number;
    seats: readonly SeatType[][];
    imageUrl?: string;
}>

export enum SeatType {
    Unavailable = 0,
    Economy = 1,
    Standard = 2,
    Luxury = 3,
}
