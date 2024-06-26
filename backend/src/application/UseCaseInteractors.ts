import {UseCase} from "cinetex-core/dist/application/UseCase";
import {UseCaseCollection} from "cinetex-core/dist/application/UseCaseCollection";
import {Repositories} from "./repositories/Repositories";
import * as queries from "./queries";
import * as requests from "./requests";
import * as commands from "./commands";

interface UseCaseCollectionConstructor {
    new (repositories: Repositories): UseCaseCollection
}

export const UseCaseInteractors: UseCaseCollectionConstructor = class implements UseCaseCollection {
    constructor(private readonly repositories: Repositories) {}

    readonly GetAllBookings = new queries.GetAllBookingsInteractor(this.repositories)
    readonly GetAllMovies = new queries.GetAllMoviesInteractor(this.repositories)
    readonly GetAllSchedules = new queries.GetAllSchedulesInteractor(this.repositories)
    readonly GetAllTheatres = new queries.GetAllTheatresInteractor(this.repositories)
    readonly GetAllUsers = new queries.GetAllUsersInteractor(this.repositories)
    readonly GetBookingById = new queries.GetBookingByIdInteractor(this.repositories)
    readonly GetBookingsByMovieId = new queries.GetBookingsByMovieIdInteractor(this.repositories)
    readonly GetBookingsByQuery = new queries.GetBookingsByQueryInteractor(this.repositories)
    readonly GetBookingsByTheatreId = new queries.GetBookingsByTheatreIdInteractor(this.repositories)
    readonly GetBookingsByUserId = new queries.GetBookingsByUserIdInteractor(this.repositories)
    readonly GetMovieById = new queries.GetMovieByIdInteractor(this.repositories)
    readonly GetMovieByName = new queries.GetMovieByNameInteractor(this.repositories)
    readonly GetMoviesByQuery = new queries.GetMoviesByQueryInteractor(this.repositories)
    readonly GetScheduleById = new queries.GetScheduleByIdInteractor(this.repositories)
    readonly GetSchedulesByMovieId = new queries.GetSchedulesByMovieIdInteractor(this.repositories)
    readonly GetSchedulesByTheatreId = new queries.GetSchedulesByTheatreIdInteractor(this.repositories)
    readonly GetSchedulesByQuery = new queries.GetSchedulesByQueryInteractor(this.repositories)
    readonly GetTheatreById = new queries.GetTheatreByIdInteractor(this.repositories)
    readonly GetTheatreByName = new queries.GetTheatreByNameInteractor(this.repositories)
    readonly GetTheatresByQuery = new queries.GetTheatresByQueryInteractor(this.repositories)
    readonly GetUserByEmail = new queries.GetUserByEmailInteractor(this.repositories)
    readonly GetUserById = new queries.GetUserByIdInteractor(this.repositories)
    readonly GetUsersByQuery = new queries.GetUsersByQueryInteractor(this.repositories)
    readonly SignIn = new requests.SignInInteractor(this.repositories)
    readonly SignUp = new requests.SignUpInteractor(this.repositories)
    readonly DeleteMovies = new commands.DeleteMoviesInteractor(this.repositories)
    readonly CreateBooking = new commands.CreateBookingInteractor(this.repositories);

    [Symbol.iterator]() {
        return Object.values(this).filter(value => value instanceof UseCase)[Symbol.iterator]();
    }
}
