import {AllUseCaseCollection, UseCase} from "shared/dist/application/usecases";
import {Repositories} from "../repositories";
import {QueryUseCaseInteractors} from "./QueryUseCaseInteractors";
import {CommandUseCaseInteractors} from "./CommandUseCaseInteractors";

export function AllUseCaseInteractors(repositories: Repositories): AllUseCaseCollection {
    const queries = QueryUseCaseInteractors(repositories);
    const commands = CommandUseCaseInteractors(repositories);
    const array: readonly UseCase[]= queries.toArray().concat(commands.toArray());
    return {
        ...QueryUseCaseInteractors(repositories),
        ...CommandUseCaseInteractors(repositories),
        toArray: () => array,

    }
}
