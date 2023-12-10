import {Entity, Id} from "../types";

export type Movie = Entity & Readonly<{
    id: Id;
    name: string;
    releaseDate: string;
    runtimeInMinutes: number;
    genres: string[];
    synopsis?: string;
    starring?: string;
    director?: string;
    producers?: string;
    writers?: string;
    ratings: Rating[];

    billboard?: Billboard;
    warning?: string;
    languageCode: string;
    movieLanguage: string;
    movieSubtitleLanguage?: string;

    smallPosterImageUrl?: string;
    mediumPosterImageUrl?: string;
    largePosterImageUrl?: string;
    trailerUrl?: string;

    cineplexId?: number;
}>

export type Rating = Readonly<{
    provinceCode: string
    warnings: string[]
    rating: string
    ratingDescription: string
}>

export type Billboard = Readonly<{
    alt?: string
    mobileImageUrl?: string
    tabletImageUrl?: string
    desktopImageUrl?: string
    largeDesktopImageUrl?: string
}>
