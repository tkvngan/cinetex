import {MovieRepository} from "./MovieRepository";
import {TheatreRepository} from "./TheatreRepository";
import {ScheduleRepository} from "./ScheduleRepository";
import {BookingRepository} from "./BookingRepository";
import {UserRepository} from "./UserRepository";
import {MediaContentRepository} from "./MediaContentRepository";

export interface Repositories {
    readonly Movie: MovieRepository
    readonly Theatre: TheatreRepository,
    readonly Schedule: ScheduleRepository,
    readonly Booking: BookingRepository,
    readonly User: UserRepository
    readonly MediaContent: MediaContentRepository
}
