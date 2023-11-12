import {Repositories} from "../repositories";
import {QueryUseCaseCollection, UseCaseCollection} from "shared/dist/application/usecases";
import * as interactors from "./queries";

export function QueryUseCaseInteractors(repositories: Repositories): QueryUseCaseCollection {
    const base = UseCaseCollection();
    return {
        ...base,
        GetAllBookings: base.$(interactors.GetAllBookingsInteractor(repositories)),
        GetAllMovies: base.$(interactors.GetAllMoviesInteractor(repositories)),
        GetAllSchedules: base.$(interactors.GetAllSchedulesInteractor(repositories)),
        GetAllTheatres: base.$(interactors.GetAllTheatresInteractor(repositories)),
        GetAllUsers: base.$(interactors.GetAllUsersInteractor(repositories)),
        GetBookingById: base.$(interactors.GetBookingByIdInteractor(repositories)),
        GetBookingsByMovieId: base.$(interactors.GetBookingsByMovieIdInteractor(repositories)),
        GetBookingsByQuery: base.$(interactors.GetBookingsByQueryInteractor(repositories)),
        GetBookingsByTheatreId: base.$(interactors.GetBookingsByTheatreIdInteractor(repositories)),
        GetBookingsByUserId: base.$(interactors.GetBookingsByUserIdInteractor(repositories)),
        GetMovieById: base.$(interactors.GetMovieByIdInteractor(repositories)),
        GetMovieByName: base.$(interactors.GetMovieByNameInteractor(repositories)),
        GetMoviesByQuery: base.$(interactors.GetMoviesByQueryInteractor(repositories)),
        GetScheduleById: base.$(interactors.GetScheduleByIdInteractor(repositories)),
        GetSchedulesByQuery: base.$(interactors.GetSchedulesByQueryInteractor(repositories)),
        GetTheatreById: base.$(interactors.GetTheatreByIdInteractor(repositories)),
        GetTheatreByName: base.$(interactors.GetTheatreByNameInteractor(repositories)),
        GetTheatresByQuery: base.$(interactors.GetTheatresByQueryInteractor(repositories)),
        GetUserByEmail: base.$(interactors.GetUserByEmailInteractor(repositories)),
        GetUserById: base.$(interactors.GetUserByIdInteractor(repositories)),
        GetUsersByQuery: base.$(interactors.GetUsersByQueryInteractor(repositories)),
    }
}
