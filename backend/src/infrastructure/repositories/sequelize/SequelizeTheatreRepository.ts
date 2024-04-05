import {Screen, Theatre} from "cinetex-core/dist/domain/entities/Theatre";
import {TheatreRepository} from "../../../application/repositories/TheatreRepository";
import {TheatresQuery} from "cinetex-core/dist/application/queries";
import {Attributes, DataTypes, Model, Op, Sequelize} from "sequelize";
import {Address} from "cinetex-core/dist/domain/types";
import {bracket, rawPredicate, removeNulls, sequelizePredicate} from "./SequelizeUtils";
import dedent from "dedent";
import {WhereOptions} from "sequelize/types/model";

export const AddressAttributes: Attributes<Model> = {
    theatreId: {type: DataTypes.STRING, allowNull: false, primaryKey: true},
    street: {type: DataTypes.STRING, allowNull: false},
    city: {type: DataTypes.STRING, allowNull: false},
    state: {type: DataTypes.STRING, allowNull: false},
    zip: {type: DataTypes.STRING, allowNull: false},
}

export const ScreenAttributes: Attributes<Model> = {
    theatreId: {type: DataTypes.STRING, allowNull: false, primaryKey: true},
    id: {type: DataTypes.NUMBER, allowNull: false, primaryKey: true},
    name: {type: DataTypes.STRING, allowNull: false},
    rows: {type: DataTypes.NUMBER, allowNull: false, field: "ROW_COUNT"},
    columns: {type: DataTypes.NUMBER, allowNull: false, field: "COLUMN_COUNT"},
    frontRows: {type: DataTypes.NUMBER, allowNull: false},
    sideColumns: {type: DataTypes.NUMBER, allowNull: false},
    seats: {type: DataTypes.STRING(2000), allowNull: false},
    imageUrl: {type: DataTypes.STRING, allowNull: true},
}

export const TheatreAttributes: Attributes<Model> = {
    id: {type: DataTypes.STRING, allowNull: false, primaryKey: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true},
    phone: {type: DataTypes.STRING, allowNull: true},
    imageUrl: {type: DataTypes.STRING, allowNull: true},
}

type AddressData = Address & { theatreId?: string }

type ScreenData = Omit<Screen, "seats"> & { theatreId?: string, seats: string }

type TheatreData = Omit<Theatre, "location" | "screens"> & {
    location: AddressData,
    screens: ScreenData[]
}

function toAddress(data: AddressData): Address {
    const location: any = {
        ...data,
    }
    delete location.theatreId
    return removeNulls(location);
}

function toAddressData(address: Address): AddressData {
    return { ...address }
}

function toScreen(data: ScreenData): Screen {
    const screen: any = {
        ...data,
        seats: JSON.parse(data.seats),
        theatreId: undefined,
    }
    delete screen.theatreId
    return removeNulls(screen);
}

function toScreenData(screen: Screen): ScreenData {
    return { ...screen, seats: JSON.stringify(screen.seats) }
}

function toTheatre(data: TheatreData): Theatre {
    const theatre: Theatre = {
        ...data,
        location: toAddress(data.location),
        screens: data.screens.sort((a, b) => a.id - b.id).map(data => toScreen(data))
    }
    return removeNulls(theatre);
}

function toTheatreData(theatre: Theatre): TheatreData {
    return {
        ...theatre,
        location: toAddressData(theatre.location),
        screens: theatre.screens.map(screen => toScreenData(screen))
    }

}

export class AddressModel extends Model<AddressData> {
    toObject(): Address {
        return this.get({ plain: true, clone: true });
    }
}

export class ScreenModel extends Model<ScreenData> {
    toObject(): Screen {
        return toScreen(this.get({ plain: true, clone: true }));
    }
}

export class TheatreModel extends Model<TheatreData> {
    declare setLocation: (address: AddressModel) => Promise<void>
    declare setScreens: (screens: ScreenModel[]) => Promise<void>
    declare addScreen: (screen: ScreenModel) => Promise<void>
    toObject(): Theatre {
        return toTheatre(this.get({ plain: true, clone: true }));
    }
}

export class SequelizeTheatreRepository implements TheatreRepository {

    constructor(private readonly sequelize: Sequelize) {

        AddressModel.init(AddressAttributes, {
            sequelize,
            modelName: "Address",
            tableName: "THEATRE_LOCATION",
            timestamps: false,
            underscored: true
        })
        ScreenModel.init(ScreenAttributes, {
            sequelize,
            modelName: "Screen",
            tableName: "THEATRE_SCREEN",
            timestamps: false,
            underscored: true
        })
        TheatreModel.init(TheatreAttributes, {
            sequelize,
            modelName: "Theatre",
            tableName: "THEATRE",
            timestamps: false,
            underscored: true
        })
        TheatreModel.hasOne(AddressModel, { foreignKey: "theatreId", as: "location" })
        TheatreModel.hasMany(ScreenModel, { foreignKey: "theatreId", as: "screens" })
        AddressModel.belongsTo(TheatreModel, { foreignKey: "theatreId" })
        ScreenModel.belongsTo(TheatreModel, { foreignKey: "theatreId" })
    }

    async getAllTheatres(): Promise<Theatre[]> {
        return await Promise.all((await TheatreModel.findAll({
            include: [
                {model: AddressModel, as: "location"},
                {model: ScreenModel, as: "screens"}
            ]
        })).map(model => model.toObject()));
    }

    async getTheatreById(id: string): Promise<Theatre | undefined> {
        return (await TheatreModel.findByPk(id, {
            include: [
                {model: AddressModel, as: "location"},
                {model: ScreenModel, as: "screens"}
            ]
        }))?.toObject();
    }


    async getTheatreByName(name: string): Promise<Theatre | undefined> {
        return (await TheatreModel.findOne({ where: { name },
            include: [
                {model: AddressModel, as: "location"},
                {model: ScreenModel, as: "screens"}
            ]
        }))?.toObject();
    }

    async getTheatresByQuery(query: TheatresQuery): Promise<Theatre[]> {
        const where = sequelizeTheatreQuery(query);
        return await Promise.all((await TheatreModel.findAll({ where,
            include: [
                {model: AddressModel, as: "location"},
                {model: ScreenModel, as: "screens"}
            ]
        })).map(theatreModel => theatreModel.toObject()));
    }

    async deleteTheatreById(id: string): Promise<Theatre | undefined> {
        const theatreModel = (await TheatreModel.findByPk(id, {
            include: [
                {model: AddressModel, as: "location"},
                {model: ScreenModel, as: "screens"}
            ]
        }));
        if (theatreModel) {
            const theatre = theatreModel.toObject()
            await theatreModel.destroy();
            return theatre
        }
        return undefined;
    }

    async deleteTheatreByName(name: string): Promise<Theatre | undefined> {
        const theatreModel = await TheatreModel.findOne({ where: { name },
            include: [
                {model: AddressModel, as: "location"},
                {model: ScreenModel, as: "screens"}
            ]
        });
        if (theatreModel) {
            const theatre = theatreModel.toObject();
            await theatreModel.destroy();
            return theatre;
        }
        return undefined;
    }

    async deleteTheatresByQuery(query: TheatresQuery): Promise<number> {
        const where = sequelizeTheatreQuery(query);
        return await TheatreModel.destroy({ where });
    }

    async addTheatre(theatre: Theatre): Promise<Theatre> {
        const theatreData = toTheatreData(theatre)
        const theatreModel = await TheatreModel.create(theatreData, {
            include: [
                {model: AddressModel, as: "location"},
                {model: ScreenModel, as: "screens"},
            ]
        })
        await theatreModel.save()
        return theatreModel.toObject();
    }

    async updateTheatreById(id: string, theatre: Partial<Omit<Theatre, "id">>): Promise<Theatre | undefined> {
        const theatreModel = await TheatreModel.findByPk(id, {
            include: [
                {model: AddressModel, as: "location"},
                {model: ScreenModel, as: "screens"}
            ]
        });
        if (theatreModel) {
            if (theatre.location) {
                await theatreModel.setLocation(AddressModel.build(toAddressData(theatre.location)));
                delete (theatre as any).location
            }
            if (theatre.screens) {
                await theatreModel.setScreens(
                    theatre.screens.map((screen: Screen) => ScreenModel.build(toScreenData(screen)))
                );
                delete (theatre as any).screens
            }
            await theatreModel.update({
                name: theatre.name,
                phone: theatre.phone,
                imageUrl: theatre.imageUrl
            });
            return theatreModel.toObject();
        }
        return undefined;
    }
}

function sequelizeTheatreQuery(query: TheatresQuery): WhereOptions<typeof TheatreAttributes> {
    const predicates: any[] = []
    if (query.id) {
        predicates.push(sequelizePredicate<TheatreData, string>(TheatreModel, "id", query.id))
    }
    if (query.name) {
        predicates.push(sequelizePredicate<TheatreData, string>(TheatreModel, "name", query.name))
    }
    if (query.screenCount) {
        predicates.push(Sequelize.literal(dedent`${query.screenCount} = (
            SELECT count(*) 
            FROM ${ScreenModel.tableName} 
            WHERE theatre_id = ${TheatreModel.name}.id)`
        ))
    }
    if (query.location) {
        predicates.push(Sequelize.literal(dedent`EXISTS (
            SELECT 1
                FROM ${AddressModel.tableName}
                WHERE theatre_id = ${TheatreModel.name}.id AND (
                    ${rawPredicate("street", query.location)} OR
                    ${rawPredicate("city", query.location)} OR
                    ${rawPredicate("state", query.location)} OR
                    ${rawPredicate("zip", query.location)}
            )`
        ))
    }
    return { [Op.and]: predicates }
}

export function rawTheatreSubquery(query: TheatresQuery): string | undefined {
    const predicates: string[] = []
    if (query.name) {
        predicates.push(rawPredicate("name", query.name))
    }
    if (query.screenCount) {
        predicates.push(
            rawPredicate(dedent`(
                SELECT count(*) 
                    FROM ${ScreenModel.tableName}
                    WHERE theatre_id = ${TheatreModel.tableName}.id
                )`, query.screenCount
            )
        )
    }
    if (query.location) {
        predicates.push(dedent`EXISTS (
            SELECT 1 
                FROM ${AddressModel.tableName}
                WHERE theatre_id = ${TheatreModel.tableName}.id AND (
                    ${rawPredicate("street", query.location)} OR
                    ${rawPredicate("city", query.location)} OR
                    ${rawPredicate("state", query.location)} OR
                    ${rawPredicate("zip", query.location)}
                )
            )`
        )
    }
    if (predicates.length > 0) {
        return dedent`(
            SELECT id 
                FROM ${TheatreModel.tableName}
                WHERE ${predicates.map(bracket).join(" AND ")}
            )`
    } return undefined;
}
