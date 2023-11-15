import {UseCase} from "./UseCase";

export interface UseCaseCollection {
    toArray(): readonly UseCase[]
}

export function UseCaseCollection(): UseCaseCollection & { add<T extends UseCase>(item: T): T } {
    const array: UseCase[] = [];
    return {
        add<T extends UseCase>(item: T): T {
            array.push(item);
            return item;
        },
        toArray(): readonly UseCase[] {
            return array;
        }
    }
}
