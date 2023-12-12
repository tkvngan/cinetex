import {UseCaseCollection, UseCaseInvokerFactory} from "./";
import * as queries from "./queries";
import * as requests from "./requests";
import * as commands from "./commands";

export class UseCaseCollectionClient extends UseCaseCollection {
    constructor(readonly invokerFactory: UseCaseInvokerFactory) {
        super();
    }

    readonly GetAllBookings = new queries.GetAllBookings(this.invokerFactory);
    readonly GetAllMovies = new queries.GetAllMovies(this.invokerFactory);
    readonly GetAllSchedules = new queries.GetAllSchedules(this.invokerFactory);
    readonly GetAllTheatres = new queries.GetAllTheatres(this.invokerFactory);
    readonly GetAllUsers = new queries.GetAllUsers(this.invokerFactory);

    readonly GetBookingById = new queries.GetBookingById(this.invokerFactory);
    readonly GetBookingsByMovieId = new queries.GetBookingsByMovieId(this.invokerFactory);
    readonly GetBookingsByQuery = new queries.GetBookingsByQuery(this.invokerFactory);
    readonly GetBookingsByTheatreId = new queries.GetBookingsByTheatreId(this.invokerFactory);
    readonly GetBookingsByUserId = new queries.GetBookingsByUserId(this.invokerFactory);

    readonly GetMovieById = new queries.GetMovieById(this.invokerFactory);
    readonly GetMovieByName = new queries.GetMovieByName(this.invokerFactory);
    readonly GetMoviesByQuery = new queries.GetMoviesByQuery(this.invokerFactory);

    readonly GetScheduleById = new queries.GetScheduleById(this.invokerFactory);
    readonly GetSchedulesByMovieId = new queries.GetSchedulesByMovieId(this.invokerFactory);
    readonly GetSchedulesByTheatreId = new queries.GetSchedulesByTheatreId(this.invokerFactory);
    readonly GetSchedulesByQuery = new queries.GetSchedulesByQuery(this.invokerFactory);

    readonly GetTheatreById = new queries.GetTheatreById(this.invokerFactory);
    readonly GetTheatreByName = new queries.GetTheatreByName(this.invokerFactory);
    readonly GetTheatresByQuery = new queries.GetTheatresByQuery(this.invokerFactory);

    readonly GetUserByEmail = new queries.GetUserByEmail(this.invokerFactory);
    readonly GetUserById = new queries.GetUserById(this.invokerFactory);
    readonly GetUsersByQuery = new queries.GetUsersByQuery(this.invokerFactory);

    readonly SignIn = new requests.SignIn(this.invokerFactory);
    readonly SignUp = new requests.SignUp(this.invokerFactory);

    readonly DeleteMovies = new commands.DeleteMovies(this.invokerFactory);
    readonly CreateBooking = new commands.CreateBooking(this.invokerFactory);
}

