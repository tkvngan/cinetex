import {Entity, Id} from "../types/Entity";

export type Schedule = Entity & Readonly<{
    id: Id;
    movieId: Id
    theatreId: Id
    screenId: number
    showTimes: readonly TimeSlot[]
}>

export type TimeSlot = Readonly<{
    date: string
    times: string[]
}>
