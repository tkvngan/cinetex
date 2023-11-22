import {Address, Entity, Id} from "../types";

export type Row = number
export type Column = number

export type Theatre = Entity & Readonly<{
    id: Id;
    name: string;
    location: Address;
    phone: string;
    screens: readonly Screen[];
    imageUrl?: string;
}>

export type Screen = Readonly<{
    id: number;
    name: string;
    rows: number;
    columns: number;
    frontRows: number;
    sideColumns: number;
    seats: readonly SeatType[][];
    imageUrl?: string;
}>

export enum SeatType {
    Unavailable = 0,
    Economy = 1,
    Standard = 2,
    Luxury = 3,
    Wheelchair = 4,
}
