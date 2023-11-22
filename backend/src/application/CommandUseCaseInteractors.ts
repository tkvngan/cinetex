import {CommandUseCaseCollection, UseCaseCollection} from "cinetex-core/dist/application";
import {Repositories} from "./repositories";

export function CommandUseCaseInteractors(repositories: Repositories): CommandUseCaseCollection {
    const base = UseCaseCollection();
    return {
        ...base,
    }
}
