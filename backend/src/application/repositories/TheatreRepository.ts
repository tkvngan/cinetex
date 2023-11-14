import {Theatre} from "shared/dist/domain/entities/Theatre";
import {QueryTheatreCriteria} from "shared/dist/application/usecases/queries";

export interface TheatreRepository {
    getAllTheatres(): Promise<Theatre[]>;

    getTheatreById(id: string): Promise<Theatre | undefined>;

    getTheatreByName(name: string): Promise<Theatre | undefined>;

    addTheatre(theatre: Theatre): Promise<Theatre>;

    deleteTheatreById(id: string): Promise<Theatre | undefined>;

    deleteTheatreByName(name: string): Promise<Theatre | undefined>;

    deleteTheatresByQuery(criteria: QueryTheatreCriteria): Promise<number>;

    updateTheatreById(id: string, theatre: Partial<Omit<Theatre, "id">>): Promise<Theatre | undefined>;

    queryTheatres(criteria: QueryTheatreCriteria): Promise<Theatre[]>;

}
