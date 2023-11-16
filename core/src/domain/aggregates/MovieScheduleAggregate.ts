import {Movie, Schedule, ShowTime} from "../entities";
import {Aggregate} from "./Aggregate";

export type MovieScheduleAggregate = Aggregate<Movie> & Readonly<{
    schedules: readonly (Schedule & Readonly<{
        theatreName: string,
        auditoriumName: string,
    }>)[]
}>
