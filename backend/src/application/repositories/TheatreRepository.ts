import {Theatre} from "core/dist/domain/entities/Theatre";
import {TheatresQuery} from "core/dist/application/usecases/queries";

export interface TheatreRepository {
    getAllTheatres(): Promise<Theatre[]>;

    getTheatreById(id: string): Promise<Theatre | undefined>;

    getTheatreByName(name: string): Promise<Theatre | undefined>;

    addTheatre(theatre: Theatre): Promise<Theatre>;

    deleteTheatreById(id: string): Promise<Theatre | undefined>;

    deleteTheatreByName(name: string): Promise<Theatre | undefined>;

    deleteTheatresByQuery(criteria: TheatresQuery): Promise<number>;

    updateTheatreById(id: string, theatre: Partial<Omit<Theatre, "id">>): Promise<Theatre | undefined>;

    queryTheatres(criteria: TheatresQuery): Promise<Theatre[]>;

}
