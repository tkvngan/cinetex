import {QueryUseCaseCollection} from "./QueryUseCaseCollection";
import {CommandUseCaseCollection} from "./CommandUseCaseCollection";
import {UseCaseCollection} from "./UseCaseCollection";

export interface UseCaseCollections extends UseCaseCollection, QueryUseCaseCollection, CommandUseCaseCollection {

}
