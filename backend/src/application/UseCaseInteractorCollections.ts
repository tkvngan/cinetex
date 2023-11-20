import {UseCase, UseCaseCollections} from "core/dist/application";
import {Repositories} from "./repositories";
import {QueryUseCaseInteractors} from "./QueryUseCaseInteractors";
import {CommandUseCaseInteractors} from "./CommandUseCaseInteractors";

export function UseCaseInteractorCollections(repositories: Repositories): UseCaseCollections {
    const queries = QueryUseCaseInteractors(repositories);
    const commands = CommandUseCaseInteractors(repositories);
    const array: readonly UseCase[]= queries.toArray().concat(commands.toArray());
    return {
        ...QueryUseCaseInteractors(repositories),
        ...CommandUseCaseInteractors(repositories),
        toArray: () => array,

    }
}
