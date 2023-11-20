import {Movie, Schedule} from "../entities";
import {Aggregate} from "./Aggregate";

export type MovieAggregate = Aggregate<Movie> & Readonly<{
    schedules: readonly (Schedule & Readonly<{
        theatreName: string,
        screenName: string,
    }>)[]
}>
