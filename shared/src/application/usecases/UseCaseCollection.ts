import {UseCase} from "./UseCase";

export interface UseCaseCollection {
    readonly array: readonly UseCase[];
    readonly map: ReadonlyMap<UseCaseCollectionKeys, UseCase>;
}

export type UseCaseCollectionKeys = keyof Omit<UseCaseCollection, "array" | "map">

export function getUseCaseArray(collection: UseCaseCollection): readonly UseCase[] {
    return Object.getOwnPropertyNames(collection).filter((name) => {
        if (name !== "array" && name !== "map") {
            const property = (collection as any)[name]
            return property != undefined
                && property.name !== undefined
                && property.name === name
                && (property.type === "query" || property.type === "command")
        }
        return false
    }).map((name) => (collection as any)[name])
}

export function getUseCaseMap(collection: UseCaseCollection): ReadonlyMap<UseCaseCollectionKeys, UseCase> {
    return new Map<UseCaseCollectionKeys, UseCase>(getUseCaseArray(collection).map((useCase) => {
        return [useCase.name as UseCaseCollectionKeys, useCase]
    }))
}
