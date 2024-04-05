import {Model, ModelStatic, Op, Sequelize} from "sequelize";
import {ByPattern, ByRange} from "cinetex-core/dist/application/queries/QueryCriteria";
import {error} from "cinetex-core/dist/utils";
import {WhereOptions} from "sequelize/types/model";

export function sequelizePredicate<TAttributes extends {}, T>(
        model: ModelStatic<Model<TAttributes>>,
        field: keyof TAttributes,
        value?: T | T[] | ByRange<T> | ByPattern): WhereOptions<TAttributes> {

    if (value === undefined || value === null) {
        return { [field]: {[Op.is]: null} } as WhereOptions<TAttributes>
    }
    if (Array.isArray(value)) {
        if (value.length === 0) {
            return { [field]: {[Op.is]: null} } as WhereOptions<TAttributes>
        }
        return { [field]: {[Op.in]: value} } as WhereOptions<TAttributes>
    }
    if (value instanceof Object) {
        const operand: { min?: any; max?: any; pattern?: string; options?: string; } = value
        if (operand.pattern) {
            const qualifiedField: string = `${model.name}.${field as string}`
            return Sequelize.fn('REGEXP_LIKE', Sequelize.col(qualifiedField), operand.pattern, operand.options ?? "")
        } else if (operand.max && operand.min) {
            return { [field]: { [Op.between]: [operand.min, operand.max] } } as WhereOptions<TAttributes>
        } else if (operand.min) {
            return { [field]: { [Op.gte]: operand.min } } as WhereOptions<TAttributes>
        } else if (operand.max) {
            return { [field]: { [Op.lte]: operand.max } } as WhereOptions<TAttributes>
        } else {
            error(`Invalid query for field: ${field as string}, operand: ${JSON.stringify(operand)}`)
        }
    }
    return { [field]: value } as WhereOptions<TAttributes>
}

export function rawPredicate<T>(field: string, value: T | T[] | ByRange<T> | ByPattern): string {
    if (value === undefined || value === null) {
        return `${field} IS NULL`;
    }
    if (Array.isArray(value)) {
        if (value.length === 0) {
            return `${field} IS NULL`
        }
        return `${field} IN (${value.map(v => `${quote(v)}`).join(", ")})`
    }
    if (value instanceof Object) {
        const operand: { min?: any; max?: any; pattern?: string; options?: string; } = value
        if (operand.pattern) {
            return `REGEXP_LIKE(${field}, '${operand.pattern}', '${operand?.options ?? ""}')`
        } else if (operand.max && operand.min) {
            return `${field} BETWEEN ${quote(operand.min)} AND ${quote(operand.max)}`
        } else if (operand.min) {
            return `${field} >= ${quote(operand.min)}`
        } else if (operand.max) {
            return `${field} <= ${quote(operand.max)}`
        } else {
            error(`Invalid query for field: ${field}, operand: ${JSON.stringify(operand)}`)
        }
    }
    return `${field} = ${quote(value)}`;
}

export function quote(value: any): string {
    if (typeof value === "string") {
        return `'${value}'`;
    } else {
        return value;
    }
}

export function removeNulls<T>(obj: T): T {
    if (obj) {
        return Object.fromEntries(Object.entries(obj as any).filter(([_, v]) => v !== null)) as T;
    } else return obj;
}

export function bracket(predicate: string): string {
    return `(${predicate})`;
}
