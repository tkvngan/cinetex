import {MovieRepository} from "./MovieRepository";
import {TheatreRepository} from "./TheatreRepository";
import {ScheduleRepository} from "./ScheduleRepository";
import {BookingRepository} from "./BookingRepository";
import {UserRepository} from "./UserRepository";

export type Pattern = { pattern: string, options?: string }

export type Range<T> = { from?: T, to?: T };

export interface Repository extends MovieRepository, TheatreRepository, ScheduleRepository, BookingRepository, UserRepository {}
