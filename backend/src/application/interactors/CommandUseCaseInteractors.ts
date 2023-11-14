import {CommandUseCaseCollection, UseCaseCollection} from "shared/dist/application/usecases";
import {Repositories} from "../repositories";

export function CommandUseCaseInteractors(repositories: Repositories): CommandUseCaseCollection {
    const base = UseCaseCollection();
    return {
        ...base,
    }
}
