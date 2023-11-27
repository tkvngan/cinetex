import {UseCase, UseCaseCollection, UseCaseCollections, UseCaseProperties} from "cinetex-core/dist/application";
import {AxiosInstance, HttpStatusCode} from "axios";
import * as queries from "cinetex-core/dist/application/queries";

export function AxiosUseCaseInteractorCollections(client: AxiosInstance): UseCaseCollections {
    const base = UseCaseCollection();
    return {
        ...base,
        GetAllBookings: base.add(interactor(queries.GetAllBookings)),
        GetAllMovies: base.add(interactor(queries.GetAllMovies)),
        GetAllSchedules: base.add(interactor(queries.GetAllSchedules)),
        GetAllTheatres: base.add(interactor(queries.GetAllTheatres)),
        GetAllUsers: base.add(interactor(queries.GetAllUsers)),
        GetBookingById: base.add(interactor(queries.GetBookingById)),
        GetBookingsByMovieId: base.add(interactor(queries.GetBookingsByMovieId)),
        GetBookingsByQuery: base.add(interactor(queries.GetBookingsByQuery)),
        GetBookingsByTheatreId: base.add(interactor(queries.GetBookingsByTheatreId)),
        GetBookingsByUserId: base.add(interactor(queries.GetBookingsByUserId)),
        GetMovieById: base.add(interactor(queries.GetMovieById)),
        GetMovieByName: base.add(interactor(queries.GetMovieByName)),
        GetMoviesByQuery: base.add(interactor(queries.GetMoviesByQuery)),
        GetScheduleById: base.add(interactor(queries.GetScheduleById)),
        GetSchedulesByQuery: base.add(interactor(queries.GetSchedulesByQuery)),
        GetTheatreById: base.add(interactor(queries.GetTheatreById)),
        GetTheatreByName: base.add(interactor(queries.GetTheatreByName)),
        GetTheatresByQuery: base.add(interactor(queries.GetTheatresByQuery)),
        GetUserByEmail: base.add(interactor(queries.GetUserByEmail)),
        GetUserById: base.add(interactor(queries.GetUserById)),
        GetUsersByQuery: base.add(interactor(queries.GetUsersByQuery)),
    }

    function interactor<T extends UseCase, Input, Output>(factory: (invoke: (query: Input) => Promise<Output>) => T): T {
        const dispatcher = factory((request) => {
            return invoke(dispatcher, request)
        })
        return dispatcher;
    }

    async function invoke<Input, Output>(usecase: UseCaseProperties, request: Input): Promise<Output> {
        const response = await client({
            method: (usecase.type === "query") ? "GET" : "POST",
            url: `/${usecase.type}/${usecase.name}`,
            data: request,
            headers: {
                "Content-Type": "application/json"
            },
            responseType: "json",
            responseEncoding: "utf8",
            validateStatus: status => (status === HttpStatusCode.Ok) || (status === HttpStatusCode.NotFound && usecase.type === "query")
        })
        if (response.status === HttpStatusCode.Ok && (response.data !== undefined && response.data !== "")) {
            return response.data as Output
        }
        return undefined as Output
    }

}
