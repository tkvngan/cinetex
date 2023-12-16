import {UseCaseCollection} from "cinetex-core/dist/application";
import {Repositories} from "./repositories";
import * as queries from "./queries";
import * as requests from "./requests";
import * as commands from "./commands";

export function UseCaseInteractors(repositories: Repositories): UseCaseCollection {
    return {
        GetAllBookings: new queries.GetAllBookingsInteractor(repositories),
        GetAllMovies: new queries.GetAllMoviesInteractor(repositories),
        GetAllSchedules: new queries.GetAllSchedulesInteractor(repositories),
        GetAllTheatres: new queries.GetAllTheatresInteractor(repositories),
        GetAllUsers: new queries.GetAllUsersInteractor(repositories),
        GetBookingById: new queries.GetBookingByIdInteractor(repositories),
        GetBookingsByMovieId: new queries.GetBookingsByMovieIdInteractor(repositories),
        GetBookingsByQuery: new queries.GetBookingsByQueryInteractor(repositories),
        GetBookingsByTheatreId: new queries.GetBookingsByTheatreIdInteractor(repositories),
        GetBookingsByUserId: new queries.GetBookingsByUserIdInteractor(repositories),
        GetMovieById: new queries.GetMovieByIdInteractor(repositories),
        GetMovieByName: new queries.GetMovieByNameInteractor(repositories),
        GetMoviesByQuery: new queries.GetMoviesByQueryInteractor(repositories),
        GetScheduleById: new queries.GetScheduleByIdInteractor(repositories),
        GetSchedulesByMovieId: new queries.GetSchedulesByMovieIdInteractor(repositories),
        GetSchedulesByTheatreId: new queries.GetSchedulesByTheatreIdInteractor(repositories),
        GetSchedulesByQuery: new queries.GetSchedulesByQueryInteractor(repositories),
        GetTheatreById: new queries.GetTheatreByIdInteractor(repositories),
        GetTheatreByName: new queries.GetTheatreByNameInteractor(repositories),
        GetTheatresByQuery: new queries.GetTheatresByQueryInteractor(repositories),
        GetUserByEmail: new queries.GetUserByEmailInteractor(repositories),
        GetUserById: new queries.GetUserByIdInteractor(repositories),
        GetUsersByQuery: new queries.GetUsersByQueryInteractor(repositories),
        SignIn: new requests.SignInInteractor(repositories),
        SignUp: new requests.SignUpInteractor(repositories),
        DeleteMovies: new commands.DeleteMoviesInteractor(repositories),
        CreateBooking: new commands.CreateBookingInteractor(repositories),
    }
}
