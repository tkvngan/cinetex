import {Entity, Id} from "../types/Entity";

export interface Schedule extends Entity {
    readonly id: Id;
    readonly movieId: Id
    readonly theatreId: Id
    readonly screenId: number
    readonly showTimes: readonly TimeSlot[]
}

export interface TimeSlot {
    readonly date: string
    readonly times: readonly string[]
}
