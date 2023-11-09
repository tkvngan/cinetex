import {Entity, Id} from "../types/Entity";

export type Show = Entity & Readonly<{
    id: Id;
    theatreId: Id
    movieId: Id
    screenId: Id
    showStartDate: Date
    showEndDate: Date
    showTimes: readonly ShowTime[]
}>

export type ShowTime = 'afternoon' | 'evening' | 'night'

export const ShowTimes: readonly ShowTime[] = ['afternoon', 'evening', 'night']
