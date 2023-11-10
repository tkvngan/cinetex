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
    seats: readonly SeatType[][];
}>

export enum SeatType {
    Unavailable = 0,
    Economy = 1,
    Standard = 2,
    Luxury = 3,
}
