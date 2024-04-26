import {Entity, Id} from "../types/Entity";
import {Address} from "../types/Address";

export type Row = number
export type Column = number

export interface Theatre extends Entity {
    readonly id: Id;
    readonly name: string;
    readonly location: Address;
    readonly phone?: string;
    readonly screens: readonly Screen[];
    readonly imageUrl?: string;
}

export interface Screen {
    readonly id: number;
    readonly name: string;
    readonly rows: number;
    readonly columns: number;
    readonly frontRows: number;
    readonly sideColumns: number;
    readonly seats: readonly (readonly SeatType[])[];
    readonly imageUrl?: string;
}

export enum SeatType {
    Unavailable = 0,
    Economy = 1,
    Standard = 2,
    Luxury = 3,
    Wheelchair = 4,
}
