import {Pattern, Range} from "./Repository";
import {Theatre} from "@cinetex/shared/domain/entities/Theatre";

export type TheatreSearchCriteria = {
    name?: string | Pattern;
    location?: Pattern;
    screenCount?: number | Range<number>;
}

export interface TheatreRepository {
    getAllTheatres(): Promise<Theatre[]>;

    getTheatre(id: string): Promise<Theatre | undefined>;

    getTheatreByName(name: string): Promise<Theatre | undefined>;

    getTheatres(criteria: TheatreSearchCriteria): Promise<Theatre[]>;

    addTheatre(theatre: Theatre): Promise<Theatre>;

    deleteTheatre(id: string): Promise<Theatre | undefined>;

    deleteTheatreByName(name: string): Promise<Theatre | undefined>;

    deleteTheatres(criteria: TheatreSearchCriteria): Promise<number>;

    updateTheatre(id: string, theatre: Partial<Omit<Theatre, "id">>): Promise<Theatre | undefined>;
}
