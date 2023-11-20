import {Schedule, Theatre} from "../entities";
import {Aggregate} from "./Aggregate";

export type TheatreAggregate = Aggregate<Theatre> & Readonly<{
    schedules: readonly (Schedule & Readonly<{
        movieName: string,
        screenName: string,
    }>)[]

}>
