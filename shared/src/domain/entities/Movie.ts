import {Entity, Id} from "../types/Entity";

export type Movie = Entity & Readonly<{
    id: Id;
    name: string;
    duration: number;
    synopsis: string;
    director: string;
    cast: readonly string[];
    releaseDate: string;
    rating: Rating;
    genres: readonly Genre[];
    imageId?: Id;
    trailerId?: Id;
}>

export type Rating = 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';

export type Genre = 'Action' | 'Adventure' | 'Comedy' | 'Drama' | 'Fantasy' | 'Horror' | 'Mystery' | 'Thriller' | 'Sci-Fi' | 'Animation' | 'Biography' | 'Crime' | 'History'

export const Ratings: readonly Rating[] = ['G', 'PG', 'PG-13', 'R', 'NC-17'];

export const Genres: readonly Genre[] = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Sci-Fi', 'Animation', 'Biography', 'Crime', 'History'];


