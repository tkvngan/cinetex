import {FilterQuery, Types} from "mongoose";
import {QueryPattern, QueryRange} from "core/dist/application/usecases/queries/QueryCriteria";

export function toObjectId(id: string) {
    return new Types.ObjectId(id);
}

export function toPatternFilter(value: string | QueryPattern) {
    if (typeof value === "object") {
        return {$regex: value.pattern, $options: value.options}
    }
    return {$eq: value};
}

export function toRangeFilter<T>(value: T | QueryRange<T>) {
    const filter: FilterQuery<any> = {}
    if (typeof value === "object") {
        const range = value as QueryRange<T>;
        if (range.min) {
            filter.$gte = range.min
        }
        if (range.max) {
            filter.$lte = range.max
        }
    } else {
        filter.$eq = value
    }
    return filter;
}
