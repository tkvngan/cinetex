import {UseCaseInvoker} from "./UseCase";
import * as queries from "./queries";
import * as requests from "./requests";
import * as commands from "./commands";
import {UseCaseDefinitions} from "./UseCaseDefinitions";

export type UseCaseCollection = UseCaseDefinitions & {
    [K in keyof UseCaseDefinitions]: UseCaseDefinitions[K];
}

export function UseCaseCollection(invoker: UseCaseInvoker): UseCaseCollection {
    return {
        GetAllBookings: new queries.GetAllBookings(invoker),
        GetAllMovies: new queries.GetAllMovies(invoker),
        GetAllSchedules: new queries.GetAllSchedules(invoker),
        GetAllTheatres: new queries.GetAllTheatres(invoker),
        GetAllUsers: new queries.GetAllUsers(invoker),

        GetBookingById: new queries.GetBookingById(invoker),
        GetBookingsByMovieId: new queries.GetBookingsByMovieId(invoker),
        GetBookingsByQuery: new queries.GetBookingsByQuery(invoker),
        GetBookingsByTheatreId: new queries.GetBookingsByTheatreId(invoker),
        GetBookingsByUserId: new queries.GetBookingsByUserId(invoker),

        GetMovieById: new queries.GetMovieById(invoker),
        GetMovieByName: new queries.GetMovieByName(invoker),
        GetMoviesByQuery: new queries.GetMoviesByQuery(invoker),

        GetScheduleById: new queries.GetScheduleById(invoker),
        GetSchedulesByMovieId: new queries.GetSchedulesByMovieId(invoker),
        GetSchedulesByTheatreId: new queries.GetSchedulesByTheatreId(invoker),
        GetSchedulesByQuery: new queries.GetSchedulesByQuery(invoker),

        GetTheatreById: new queries.GetTheatreById(invoker),
        GetTheatreByName: new queries.GetTheatreByName(invoker),
        GetTheatresByQuery: new queries.GetTheatresByQuery(invoker),

        GetUserByEmail: new queries.GetUserByEmail(invoker),
        GetUserById: new queries.GetUserById(invoker),
        GetUsersByQuery: new queries.GetUsersByQuery(invoker),

        SignIn: new requests.SignIn(invoker),
        SignUp: new requests.SignUp(invoker),

        DeleteMovies: new commands.DeleteMovies(invoker),
        CreateBooking: new commands.CreateBooking(invoker),
    }
}
