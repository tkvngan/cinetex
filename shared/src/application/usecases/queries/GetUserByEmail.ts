import {QueryUseCase} from "../UseCase";
import {User} from "../../../domain/entities";

export type GetUserByEmail = QueryUseCase<{ email: string }, User | undefined>
