import {Entity, Id} from "../types/Entity";

export interface Movie extends Entity {
    readonly id: Id;
    readonly name: string;
    readonly releaseDate: string;
    readonly runtimeInMinutes: number;
    readonly genres: readonly string[];
    readonly synopsis?: string;
    readonly starring?: string;
    readonly director?: string;
    readonly producers?: string;
    readonly writers?: string;
    readonly ratings: readonly Rating[];

    readonly warning?: string;
    readonly languageCode: string;
    readonly movieLanguage: string;
    readonly movieSubtitleLanguage?: string;

    readonly smallPosterImageUrl?: string;
    readonly mediumPosterImageUrl?: string;
    readonly largePosterImageUrl?: string;
    readonly trailerUrl?: string;

    readonly cineplexId?: number;
}

export interface Rating {
    readonly provinceCode: string
    readonly warnings?: string
    readonly rating: string
    readonly ratingDescription: string
}
