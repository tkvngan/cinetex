import {UseCase} from "./UseCase";
import * as queries from "./queries";
import * as requests from "./requests";

export abstract class UseCaseCollection {

    abstract readonly GetAllBookings: queries.GetAllBookings;
    abstract readonly GetAllMovies: queries.GetAllMovies;
    abstract readonly GetAllSchedules: queries.GetAllSchedules;
    abstract readonly GetAllTheatres: queries.GetAllTheatres;
    abstract readonly GetAllUsers: queries.GetAllUsers;

    abstract readonly GetBookingById: queries.GetBookingById;
    abstract readonly GetBookingsByMovieId: queries.GetBookingsByMovieId;
    abstract readonly GetBookingsByQuery: queries.GetBookingsByQuery;
    abstract readonly GetBookingsByTheatreId: queries.GetBookingsByTheatreId;
    abstract readonly GetBookingsByUserId: queries.GetBookingsByUserId;

    abstract readonly GetMovieById: queries.GetMovieById;
    abstract readonly GetMovieByName: queries.GetMovieByName;
    abstract readonly GetMoviesByQuery: queries.GetMoviesByQuery;

    abstract readonly GetScheduleById: queries.GetScheduleById;
    abstract readonly GetSchedulesByQuery: queries.GetSchedulesByQuery;

    abstract readonly GetTheatreById: queries.GetTheatreById;
    abstract readonly GetTheatreByName: queries.GetTheatreByName;
    abstract readonly GetTheatresByQuery: queries.GetTheatresByQuery;

    abstract readonly GetUserByEmail: queries.GetUserByEmail;
    abstract readonly GetUserById: queries.GetUserById;
    abstract readonly GetUsersByQuery: queries.GetUsersByQuery;

    abstract readonly SignIn: requests.SignIn;
    abstract readonly SignUp: requests.SignUp;

    [Symbol.iterator](): Iterator<UseCase> {
        return (Object.values(this).filter((value: any): boolean => value instanceof UseCase))[Symbol.iterator]();
    }
}
