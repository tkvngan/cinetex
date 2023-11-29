import {QueryUseCaseCollection} from "./QueryUseCaseCollection";
import {CommandUseCaseCollection} from "./CommandUseCaseCollection";
import {UseCaseCollection} from "./UseCaseCollection";
import {SignIn} from "./requests/SignIn";
import { SignUp } from "./requests/SignUp";

export interface UseCaseCollections extends UseCaseCollection, QueryUseCaseCollection, CommandUseCaseCollection {

    readonly SignIn: SignIn;
    readonly SignUp: SignUp;

}
