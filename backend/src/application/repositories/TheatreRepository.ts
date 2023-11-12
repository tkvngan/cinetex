import {Theatre} from "shared/dist/domain/entities/Theatre";
import {TheatreQueryCriteria} from "shared/dist/application/usecases/queries/GetTheatresByQuery";

export interface TheatreRepository {
    getAllTheatres(): Promise<Theatre[]>;

    getTheatreById(id: string): Promise<Theatre | undefined>;

    getTheatreByName(name: string): Promise<Theatre | undefined>;

    getTheatresByQuery(criteria: TheatreQueryCriteria): Promise<Theatre[]>;

    addTheatre(theatre: Theatre): Promise<Theatre>;

    deleteTheatreById(id: string): Promise<Theatre | undefined>;

    deleteTheatreByName(name: string): Promise<Theatre | undefined>;

    deleteTheatresByQuery(criteria: TheatreQueryCriteria): Promise<number>;

    updateTheatreById(id: string, theatre: Partial<Omit<Theatre, "id">>): Promise<Theatre | undefined>;
}
