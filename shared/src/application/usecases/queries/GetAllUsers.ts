import {QueryUseCase} from "../UseCase";
import {User} from "../../../domain/entities";

export type GetAllUsers = QueryUseCase<{}, User[]>
