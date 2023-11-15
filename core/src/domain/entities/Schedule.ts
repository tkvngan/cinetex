import {Entity, Id} from "../types";

export type Schedule = Entity & Readonly<{
    id: Id;
    movieId: Id
    theatreId: Id
    auditoriumId: number
    showStartDate: string
    showEndDate: string
    showTimes: readonly ShowTime[]
}>

export enum ShowTime { afternoon = "afternoon", evening = "evening", night = "night" }
