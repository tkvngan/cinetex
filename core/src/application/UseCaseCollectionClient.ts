import {UseCaseCollection, UseCaseInvoker} from "./";
import * as queries from "./queries";
import * as requests from "./requests";
import * as commands from "./commands";

export class UseCaseCollectionClient extends UseCaseCollection {
    constructor(readonly invoker?: UseCaseInvoker) {
        super();
    }

    readonly GetAllBookings = new queries.GetAllBookings(this.invoker);
    readonly GetAllMovies = new queries.GetAllMovies(this.invoker);
    readonly GetAllSchedules = new queries.GetAllSchedules(this.invoker);
    readonly GetAllTheatres = new queries.GetAllTheatres(this.invoker);
    readonly GetAllUsers = new queries.GetAllUsers(this.invoker);

    readonly GetBookingById = new queries.GetBookingById(this.invoker);
    readonly GetBookingsByMovieId = new queries.GetBookingsByMovieId(this.invoker);
    readonly GetBookingsByQuery = new queries.GetBookingsByQuery(this.invoker);
    readonly GetBookingsByTheatreId = new queries.GetBookingsByTheatreId(this.invoker);
    readonly GetBookingsByUserId = new queries.GetBookingsByUserId(this.invoker);

    readonly GetMovieById = new queries.GetMovieById(this.invoker);
    readonly GetMovieByName = new queries.GetMovieByName(this.invoker);
    readonly GetMoviesByQuery = new queries.GetMoviesByQuery(this.invoker);

    readonly GetScheduleById = new queries.GetScheduleById(this.invoker);
    readonly GetSchedulesByMovieId = new queries.GetSchedulesByMovieId(this.invoker);
    readonly GetSchedulesByTheatreId = new queries.GetSchedulesByTheatreId(this.invoker);
    readonly GetSchedulesByQuery = new queries.GetSchedulesByQuery(this.invoker);

    readonly GetTheatreById = new queries.GetTheatreById(this.invoker);
    readonly GetTheatreByName = new queries.GetTheatreByName(this.invoker);
    readonly GetTheatresByQuery = new queries.GetTheatresByQuery(this.invoker);

    readonly GetUserByEmail = new queries.GetUserByEmail(this.invoker);
    readonly GetUserById = new queries.GetUserById(this.invoker);
    readonly GetUsersByQuery = new queries.GetUsersByQuery(this.invoker);

    readonly SignIn = new requests.SignIn(this.invoker);
    readonly SignUp = new requests.SignUp(this.invoker);

    readonly DeleteMovies = new commands.DeleteMovies(this.invoker);
    readonly CreateBooking = new commands.CreateBooking(this.invoker);
}

