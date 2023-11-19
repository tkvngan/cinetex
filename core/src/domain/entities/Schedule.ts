import {Entity, Id} from "../types";

export type Schedule = Entity & Readonly<{
    id: Id;
    movieId: Id
    theatreId: Id
    screenId: number
    showStartDate: string
    showEndDate: string
    showTimes: readonly ShowTime[]
}>

export type ShowTime = string
