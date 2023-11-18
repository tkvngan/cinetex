import {Schedule, Theatre} from "../entities";
import {Aggregate} from "./Aggregate";

export type TheatreScheduleAggregate = Aggregate<Theatre> & Readonly<{
    schedules: readonly (Schedule & Readonly<{
        movieName: string,
        screenName: string,
    }>)[]

}>
