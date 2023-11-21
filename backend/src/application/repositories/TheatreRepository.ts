import {Theatre} from "core/dist/domain/entities/Theatre";
import {TheatresQuery} from "core/dist/application/queries";

export interface TheatreRepository {
    getAllTheatres(): Promise<Theatre[]>;

    getTheatreById(id: string): Promise<Theatre | undefined>;

    getTheatreByName(name: string): Promise<Theatre | undefined>;

    addTheatre(theatre: Theatre): Promise<Theatre>;

    deleteTheatreById(id: string): Promise<Theatre | undefined>;

    deleteTheatreByName(name: string): Promise<Theatre | undefined>;

    deleteTheatresByQuery(query: TheatresQuery): Promise<number>;

    updateTheatreById(id: string, theatre: Partial<Omit<Theatre, "id">>): Promise<Theatre | undefined>;

    getTheatresByQuery(query: TheatresQuery): Promise<Theatre[]>;

}
