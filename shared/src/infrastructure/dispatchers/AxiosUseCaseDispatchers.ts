import {
    AllUseCaseCollection,
    QueryUseCaseCollection,
    UseCase,
    UseCaseCollection,
    UseCaseProperties
} from "../../application/usecases";
import {AxiosInstance, AxiosResponse} from "axios";
import {
    GetAllBookings,
    GetAllMovies,
    GetAllSchedules,
    GetAllTheatres,
    GetAllUsers,
    GetBookingById,
    GetBookingsByMovieId,
    GetBookingsByQuery,
    GetBookingsByTheatreId,
    GetBookingsByUserId,
    GetMovieById,
    GetMovieByName,
    GetMoviesByQuery,
    GetScheduleById,
    GetSchedulesByQuery,
    GetTheatreById,
    GetTheatreByName, GetTheatresByQuery, GetUserByEmail, GetUserById, GetUsersByQuery
} from "../../application/usecases/queries";

export function AxiosUseCaseDispatchers(client: AxiosInstance): AllUseCaseCollection {
    const base = UseCaseCollection();
    return {
        ...base,
        GetAllBookings: base.$(toDispatcher(client, GetAllBookings)),
        GetAllMovies: base.$(toDispatcher(client, GetAllMovies)),
        GetAllSchedules: base.$(toDispatcher(client, GetAllSchedules)),
        GetAllTheatres: base.$(toDispatcher(client, GetAllTheatres)),
        GetAllUsers: base.$(toDispatcher(client, GetAllUsers)),
        GetBookingById: base.$(toDispatcher(client, GetBookingById)),
        GetBookingsByMovieId: base.$(toDispatcher(client, GetBookingsByMovieId)),
        GetBookingsByQuery: base.$(toDispatcher(client, GetBookingsByQuery)),
        GetBookingsByTheatreId: base.$(toDispatcher(client, GetBookingsByTheatreId)),
        GetBookingsByUserId: base.$(toDispatcher(client, GetBookingsByUserId)),
        GetMovieById: base.$(toDispatcher(client, GetMovieById)),
        GetMovieByName: base.$(toDispatcher(client, GetMovieByName)),
        GetMoviesByQuery: base.$(toDispatcher(client, GetMoviesByQuery)),
        GetScheduleById: base.$(toDispatcher(client, GetScheduleById)),
        GetSchedulesByQuery: base.$(toDispatcher(client, GetSchedulesByQuery)),
        GetTheatreById: base.$(toDispatcher(client, GetTheatreById)),
        GetTheatreByName: base.$(toDispatcher(client, GetTheatreByName)),
        GetTheatresByQuery: base.$(toDispatcher(client, GetTheatresByQuery)),
        GetUserByEmail: base.$(toDispatcher(client, GetUserByEmail)),
        GetUserById: base.$(toDispatcher(client, GetUserById)),
        GetUsersByQuery: base.$(toDispatcher(client, GetUsersByQuery)),
    }
}

type UseCaseFactory<T extends UseCase<Input, Output>, Input, Output> = (invoke: (query: Input) => Promise<Output>) => T

function toDispatcher<T extends UseCase<Input, Output>, Input, Output>(client: AxiosInstance, factory: UseCaseFactory<T, Input, Output>): T {
    const dispatcher = factory((request) => {
        return dispatch(client, dispatcher, request)
    })
    return dispatcher;
}

async function dispatch<Input, Output>(client: AxiosInstance, usecase: UseCaseProperties, request: Input): Promise<Output> {
    const response = await client({
        method: (usecase.type === "query") ? "GET" : "POST",
        url: `/${usecase.type}/${usecase.name}`,
        data: request,
        headers: {
            "Content-Type": "application/json"
        },
        responseType: "json",
        responseEncoding: "utf8",
        validateStatus: status => {
            return (status === 200) || (status === 404 && usecase.type === "query")
        }
    })
    if (response.status === 200 && (response.data !== undefined && response.data !== "")) {
        return response.data as Output
    }
    return undefined as Output
}
