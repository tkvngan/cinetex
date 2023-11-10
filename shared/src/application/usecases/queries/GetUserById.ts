import {QueryUseCase} from "../UseCase";
import {User} from "../../../domain/entities";

export type GetUserById = QueryUseCase<{ id: string }, User | undefined>
