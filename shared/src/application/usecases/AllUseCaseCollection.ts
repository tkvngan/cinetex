import {QueryUseCaseCollection} from "./QueryUseCaseCollection";
import {CommandUseCaseCollection} from "./CommandUseCaseCollection";

export interface AllUseCaseCollection extends QueryUseCaseCollection, CommandUseCaseCollection {}
