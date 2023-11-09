import {Entity, Id} from "../types/Entity";

export type Movie = Entity & Readonly<{
    id: Id;
    title: string;
    duration: number;
    synopsis: string;
    director: string;
    cast: readonly string[];
    releaseDate: Date;
    rating: Rating;
    genres: readonly Genre[];
}>

export type Rating = 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';

export type Genre = 'Action' | 'Adventure' | 'Comedy' | 'Drama' | 'Fantasy' | 'Horror' | 'Mystery' | 'Thriller' | 'Sci-Fi';

export const Ratings: readonly Rating[] = ['G', 'PG', 'PG-13', 'R', 'NC-17'];

export const Genres: readonly Genre[] = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Sci-Fi'];
