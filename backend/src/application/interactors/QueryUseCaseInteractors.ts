import {Repositories} from "../repositories";
import {QueryUseCaseCollection, UseCaseCollection} from "core/dist/application/usecases";
import * as interactors from "./queries";

export function QueryUseCaseInteractors(repositories: Repositories): QueryUseCaseCollection {
    const base = UseCaseCollection();
    return {
        ...base,
        GetAllBookings: base.add(interactors.GetAllBookingsInteractor(repositories)),
        GetAllMovies: base.add(interactors.GetAllMoviesInteractor(repositories)),
        GetAllSchedules: base.add(interactors.GetAllSchedulesInteractor(repositories)),
        GetAllTheatres: base.add(interactors.GetAllTheatresInteractor(repositories)),
        GetAllUsers: base.add(interactors.GetAllUsersInteractor(repositories)),
        GetBookingById: base.add(interactors.GetBookingByIdInteractor(repositories)),
        GetBookingsByMovieId: base.add(interactors.GetBookingsByMovieIdInteractor(repositories)),
        QueryBookings: base.add(interactors.QueryBookingsInteractor(repositories)),
        GetBookingsByTheatreId: base.add(interactors.GetBookingsByTheatreIdInteractor(repositories)),
        GetBookingsByUserId: base.add(interactors.GetBookingsByUserIdInteractor(repositories)),
        GetMovieById: base.add(interactors.GetMovieByIdInteractor(repositories)),
        GetMovieByName: base.add(interactors.GetMovieByNameInteractor(repositories)),
        QueryMovies: base.add(interactors.QueryMoviesInteractor(repositories)),
        GetScheduleById: base.add(interactors.GetScheduleByIdInteractor(repositories)),
        QuerySchedules: base.add(interactors.QuerySchedulesInteractor(repositories)),
        GetTheatreById: base.add(interactors.GetTheatreByIdInteractor(repositories)),
        GetTheatreByName: base.add(interactors.GetTheatreByNameInteractor(repositories)),
        QueryTheatres: base.add(interactors.QueryTheatresInteractor(repositories)),
        GetUserByEmail: base.add(interactors.GetUserByEmailInteractor(repositories)),
        GetUserById: base.add(interactors.GetUserByIdInteractor(repositories)),
        QueryUsers: base.add(interactors.QueryUsersInteractor(repositories)),
    }
}
