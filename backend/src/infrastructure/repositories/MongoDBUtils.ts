import { FilterQuery, Types } from "mongoose";
import { QueryPattern, QueryRange } from "core/dist/application/queries/QueryCriteria";
import { error } from "core/dist/utils";

export function toObjectId(id: string) {
    return new Types.ObjectId(id);
}

export function asIdFieldFilter(id: string | string[]) {
    if (Array.isArray(id)) {
        return { $in: id.map(toObjectId) }
    }
    return { $eq: toObjectId(id) };
}

export function asArrayFieldFilter<T>(value: T | T[] | QueryPattern) {
    if (Array.isArray(value)) {
        return { $all: value }
    }
    if (value instanceof Object) {
        value = value as QueryPattern
        if (value.pattern) {
            return { $elemMatch: { $regex: value.pattern, $options: value.options } }
        }
        error("Invalid filter value: " + JSON.stringify(value))
    }
    return { $all: [value] };
}

export function asFieldFilter<T>(value: T | T[] | QueryRange<T> | QueryPattern | { min?: any; max?: any; pattern?: any; options?: any }) {
    if (Array.isArray(value)) {
        return { $in: value }
    }
    if (value instanceof Object) {
        value = value as { min?: any; max?: any; pattern?: any; options?: any;  }
        if (value.pattern) {
            return { $regex: value.pattern, $options: value.options }
        }
        if (value.max || value.min) {
            if (value.min) {
                return value.max ? { $gte: value.min, $lte: value.max } : { $gte: value.min }
            } else {
                return { $lte: value.max }
            }
        }
        error("Invalid filter value: " + JSON.stringify(value))
    }
    return { $eq: value };
}
