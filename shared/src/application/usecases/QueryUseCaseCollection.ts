import * as queries from "./queries";
import {UseCaseCollection} from "./UseCaseCollection";

export interface QueryUseCaseCollection extends UseCaseCollection {
    readonly GetAllBookings: queries.GetAllBookings;
    readonly GetAllMovies: queries.GetAllMovies;
    readonly GetAllSchedules: queries.GetAllSchedules;
    readonly GetAllTheatres: queries.GetAllTheatres;
    readonly GetAllUsers: queries.GetAllUsers;
    readonly GetBookingById: queries.GetBookingById;
    readonly GetBookingsByMovieId: queries.GetBookingsByMovieId;
    readonly GetBookingsByQuery: queries.GetBookingsByQuery;
    readonly GetBookingsByTheatreId: queries.GetBookingsByTheatreId;
    readonly GetBookingsByUserId: queries.GetBookingsByUserId;
    readonly GetMovieById: queries.GetMovieById;
    readonly GetMovieByName: queries.GetMovieByName;
    readonly GetMoviesByQuery: queries.GetMoviesByQuery;
    readonly GetScheduleById: queries.GetScheduleById;
    readonly GetSchedulesByQuery: queries.GetSchedulesByQuery;
    readonly GetTheatreById: queries.GetTheatreById;
    readonly GetTheatreByName: queries.GetTheatreByName;
    readonly GetTheatresByQuery: queries.GetTheatresByQuery;
    readonly GetUserByEmail: queries.GetUserByEmail;
    readonly GetUserById: queries.GetUserById;
    readonly GetUsersByQuery: queries.GetUsersByQuery;
}
