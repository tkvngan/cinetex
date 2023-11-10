import {MovieRepository} from "./MovieRepository";
import {TheatreRepository} from "./TheatreRepository";
import {ScheduleRepository} from "./ScheduleRepository";
import {BookingRepository} from "./BookingRepository";
import {UserRepository} from "./UserRepository";

export interface Repositories {

    readonly movie: MovieRepository

    readonly theatre: TheatreRepository,

    readonly schedule: ScheduleRepository,

    readonly booking: BookingRepository,

    readonly user: UserRepository
}
