import {Theatre} from "cinetex-core/dist/domain/entities/Theatre"
import {Movie} from "cinetex-core/dist/domain/entities/Movie";
import {User} from "cinetex-core/dist/domain/entities/User";
import {Booking} from "cinetex-core/dist/domain/entities/Booking";
import {Schedule} from "cinetex-core/dist/domain/entities/Schedule";
import {Repositories} from "../../../application/repositories/Repositories";

export const testMovies: readonly Movie[] = [
    {
        id: "6563a43f92c740d467db925b",
        name: "All Of Us Strangers",
        releaseDate: "2024-01-05",
        runtimeInMinutes: 999,
        genres: [
            "Action",
            "Drama",
        ],
        starring: "Andrew Scott, Paul Mescal",
        director: "Andrew Haigh",
        producers: "Graham Broadbent, Peter Czernin, Sarah Harvey",
        writers: "Andrew Haigh",
        ratings: [],
        languageCode: "EN",
        movieLanguage: "English",
        smallPosterImageUrl: "/images/posters/35693_130_193.jpg",
        mediumPosterImageUrl: "/images/posters/35693_320_470.jpg",
        largePosterImageUrl: "/images/posters/35693_768_1024.jpg",
        cineplexId: 35693
    },
    {
        id: "6563a43f92c740d467db927b",
        name: "Bandra (Malayalam)",
        releaseDate: "2023-11-10",
        runtimeInMinutes: 155,
        genres: [
            "Action",
            "International",
            "Romance",
            "Thriller"
        ],
        synopsis: "Dileep plays the role of a gangster who is torn between his emotions and his profession in this head vs heart tale.",
        starring: "Dileep, Tamannaah, Amika Shali, Sarathkumar, Siddique etc.",
        director: "Arun Gopy",
        ratings: [
            {
                provinceCode: "AB",
                rating: "STC",
                ratingDescription: "Subject to Classification",
            },
            {
                provinceCode: "BC",
                rating: "STC",
                ratingDescription: "Subject to classification",
            },
            {
                provinceCode: "MB",
                warnings: "Violence, Coarse Language",
                rating: "PG",
                ratingDescription: "Parental guidance advised.",
            },
            {
                provinceCode: "ON",
                rating: "STC",
                ratingDescription: "Subject To Classification",
            },
        ],
        languageCode: "ML",
        movieLanguage: "Malayalam",
        movieSubtitleLanguage: "English",
        smallPosterImageUrl: "/images/posters/36015_130_193.jpg",
        mediumPosterImageUrl: "/images/posters/36015_320_470.jpg",
        largePosterImageUrl: "/images/posters/36015_768_1024.jpg",
        cineplexId: 36015
    },
]

export const testMovieX: Movie = {
    id: "6563a43f92c740d467db9287",
    name: "Barbie",
    releaseDate: "2023-07-21",
    runtimeInMinutes: 114,
    genres: [
        "Adaptation",
        "Comedy",
        "Family"
    ],
    synopsis: "Eccentric and individualistic, Barbie is exiled from Barbieland because of her imperfections. When her home world is in peril, Barbie returns with the knowledge that what makes her different also makes her stronger.",
    starring: "Margot Robbie, Ryan Gosling, Will Ferrell, Kate McKinnon, America Ferrera, Ariana Greenblatt, Emma Mackey, Alexandra Ship, Simu Liu, Issa Rae, Michael Cera, Hari Nef, Kingsley Ben-Adir, Rhea Perlman, Ncuti Gatwa, Emerald Fennell, Sharon Rooney, Scott Evans, Ana Cruz Kayne, Connor Swindells, Ritu Arya, Jamie Demetriou",
    director: "Greta Gerwig",
    producers: "David Heyman, Margot Robbie, Tom Ackerley, Robbie Brenner",
    writers: "Greta Gerwig, Noah Baumbach",
    ratings: [
        {
            provinceCode: "AB",
            warnings: "Not Recommended for Young Children",
            rating: "PG",
            ratingDescription: "Parental guidance is advised.",
        },
        {
            provinceCode: "BC",
            warnings: "Violence",
            rating: "PG",
            ratingDescription: "Parental guidance advised.",
        },
        {
            provinceCode: "ON",
            rating: "PG",
            ratingDescription: "Parental guidance advised.",
        },
        {
            provinceCode: "PE",
            warnings: "Not Recommended for Young Children",
            rating: "PG",
            ratingDescription: "Parental guidance is advised.",
        },
        {
            provinceCode: "QC",
            rating: "G",
            ratingDescription: "May be viewed by persons of all ages.",
        },
        {
            provinceCode: "SK",
            warnings: "Violence",
            rating: "PG",
            ratingDescription: "Parental guidance advised.",
        }
    ],
    languageCode: "EN",
    movieLanguage: "English",
    smallPosterImageUrl: "/images/posters/34071_130_193.jpg",
    mediumPosterImageUrl: "/images/posters/34071_320_470.jpg",
    largePosterImageUrl: "/images/posters/34071_768_1024.jpg",
    cineplexId: 34071,
}

export const testTheatres: readonly Theatre[] = [
    {
        id: "6557da2297929c35968ffbcd",
        name: "Cineplex - Yonge-Dundas and VIP",
        location: {
            street: "10 Dundas St E #402",
            city: "Toronto",
            state: "ON",
            zip: "M5B 2G9",
        },
        phone: "416-977-9262",
        screens: [
            {
                id: 0,
                name: "A",
                rows: 20,
                columns: 25,
                frontRows: 4,
                sideColumns: 5,
                seats: [
                    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
                ]
            },
            {
                id: 1,
                name: "B",
                rows: 20,
                columns: 25,
                frontRows: 4,
                sideColumns: 5,
                seats: [
                    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
                ]
            },
            {
                id: 2,
                name: "C",
                rows: 20,
                columns: 20,
                frontRows: 4,
                sideColumns: 4,
                seats: [
                    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
                ]
            }
        ],
        imageUrl: "./images/theatres/Cineplex-YongeDundas.jpg"
    },
    {
        id: "6557da2297929c35968ffbd0",
        name: "Carlton Cinema",
        location: {
            street: "20 Carlton St.",
            city: "Toronto",
            state: "ON",
            zip: "M5B 2H5",
        },
        phone: "416-598-5454",
        screens: [
            {
                id: 0,
                name: "A",
                rows: 15,
                columns: 20,
                frontRows: 3,
                sideColumns: 4,
                seats: [
                    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
                ]
            },
            {
                id: 1,
                name: "B",
                rows: 25,
                columns: 25,
                frontRows: 5,
                sideColumns: 5,
                seats: [
                    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
                ]
            },
            {
                id: 2,
                name: "C",
                rows: 20,
                columns: 30,
                frontRows: 4,
                sideColumns: 6,
                seats: [
                    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
                    [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
                    [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
                    [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
                    [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
                    [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
                    [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
                    [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
                    [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
                    [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
                    [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
                    [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
                ]
            }
        ],
        imageUrl: "./images/theatres/CarltonCinema.jpg",
    },
]

export const testTheatreX: Theatre = {
    id: "6557da2297929c35968ffbd3",
    name: "Fox Theatre",
    location: {
        street: "2236 Queen St E",
        city: "Toronto",
        state: "ON",
        zip: "M4E 1G2",
    },
    phone: "416-691-7330",
    screens: [
        {
            id: 0,
            name: "A",
            rows: 15,
            columns: 20,
            frontRows: 3,
            sideColumns: 4,
            seats: [
                [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
                [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
                [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
                [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
                [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
                [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
                [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
                [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
                [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
                [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
                [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
                [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
                [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
                [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
                [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
            ]
        },
        {
            id: 1,
            name: "B",
            rows: 20,
            columns: 20,
            frontRows: 4,
            sideColumns: 4,
            seats: [
                [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
                [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
                [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
                [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
                [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
                [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
                [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
                [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
                [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
                [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
                [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
                [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
                [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
                [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
                [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
                [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
                [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
                [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
                [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
                [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
            ]
        }
    ],
    imageUrl: "./images/theatres/Fox.jpg",
}

export const testSchedules: readonly Schedule[] = [
    {
        id: "65f272ef550e5cddd3dd4724",
        movieId: "6563a43f92c740d467db925b", // All of Us Strangers
        theatreId: "6557da2297929c35968ffbcd",  // Cineplex - Yonge-Dundas and VIP
        screenId: 0,
        showTimes: [{ date: '2023-03-12', times: ['10:00', '13:00', '16:00'] }],
    },
    {
        id: "65f272ef550e5cddd3dd4725",
        movieId: "6563a43f92c740d467db927b", // Bandra (Malayalam)
        theatreId: "6557da2297929c35968ffbcd",  // Cineplex - Yonge-Dundas and VIP
        screenId: 1,
        showTimes: [{ date: '2023-03-15', times: ['10:00', '13:00', '16:00'] }],
    }
]

export const testScheduleX: Schedule = {
    id: "65f272ef550e5cddd3dd4726",
    movieId: "6563a43f92c740d467db927b",   // Bandra (Malayalam)
    theatreId: "6557da2297929c35968ffbd0", // Carlton Cinema
    screenId: 0,
    showTimes: [{ date: '2023-03-12', times: ['10:00', '13:00', '16:00'] }],
}

export const testBookings: Booking[] = [
    {
        id: "65f269ff62a11600a56e4be5",
        userId: "65f269ff62a11600a56e4be7",     // peter.smith@centennial.ca
        theatreId: "6557da2297929c35968ffbcd",  // Cineplex - Yonge-Dundas and VIP
        bookingTime: "2024-03-10T14:30:00Z",
        totalPrice: 30,
        tickets: [
            {
                movieId: "6563a43f92c740d467db925b", // All of Us Strangers
                screenId: 0,
                showDate: "2024-03-12",
                showTime: "13:00",
                seat: {
                    row: 5,
                    column: 8,
                },
                price: 15,
            },
            {
                movieId: "6563a43f92c740d467db927b", // Bandra (Malayalam)
                screenId: 1,
                showDate: "2024-03-15",
                showTime: "16:00",
                seat: {
                    row: 5,
                    column: 9,
                },
                price: 15,
            }
        ]
    },
    {
        id: "65f269ff62a11600a56e4be6",
        userId: "65f269ff62a11600a56e4be8",     // paul.williams@centennial.ca
        theatreId: "6557da2297929c35968ffbd0",  // Carlton Cinema
        bookingTime: "2024-03-09T16:00:00Z",
        totalPrice: 20,
        tickets: [
            {
                movieId: "6563a43f92c740d467db927b", // Bandra (Malayalam)
                screenId: 0,
                showDate: "2024-03-16",
                showTime: "20:30",
                seat: {
                    row: 3,
                    column: 4,
                },
                price: 20,
            }
        ]
    }
]

export const testBookingX: Booking = {
    id: "65f269ff62a11600a56e4be7",
    userId: "65f269ff62a11600a56e4be9",     // michael.miller@happy.ca
    theatreId: "6557da2297929c35968ffbcd",  // Cineplex - Yonge-Dundas and VIP
    bookingTime: "2024-03-14T18:00:00Z",
    totalPrice: 20,
    tickets: [
        {
            movieId: "6563a43f92c740d467db925b", // All of Us Strangers
            screenId: 1,
            showDate: "2024-03-16",
            showTime: "19:00",
            seat: {
                row: 5,
                column: 8,
            },
            price: 20,
        }
    ]
}


export const testUsers: readonly User[] = [
    {
        id: "65f269ff62a11600a56e4be7",
        email: 'peter.smith@centennial.ca',
        password: 'password0',
        emailVerified: false,
        firstName: 'Peter',
        lastName: 'Smith',
        phoneNumber: '567-890-1234',
        roles: ["user"],
    },
    {
        id: "65f269ff62a11600a56e4be8",
        email: 'paul.williams@centennial.ca',
        password: 'password1',
        emailVerified: false,
        firstName: 'Paul',
        lastName: 'Williams',
        phoneNumber: '456-789-0123',
        roles: ["admin", "user"],
    },
    {
        id: "65f269ff62a11600a56e4be9",
        email: 'paul.johnson@happy.ca',
        password: 'password2',
        emailVerified: false,
        firstName: 'Paul',
        lastName: 'Johnson',
        phoneNumber: '234-567-8901',
        roles: ["admin"],
    },
]

export const testUserX: User = {
    id: "65f269ff62a11600a56e4bea",
    email: 'michael.miller@happy.ca',
    password: 'passwordX',
    emailVerified: false,
    firstName: 'Michael',
    lastName: 'Miller',
    phoneNumber: '123-456-7890',
    roles: ["admin", "user"],
}

export async function loadTestData(repositories: Repositories): Promise<void> {
    await Promise.all(testUsers.map(user => repositories.User.createUser(user)))
    await Promise.all(testTheatres.map(theatre => repositories.Theatre.addTheatre(theatre)))
    await Promise.all(testMovies.map(movie => repositories.Movie.addMovie(movie)))
    await Promise.all(testSchedules.map(schedule => repositories.Schedule.addSchedule(schedule)))
    await Promise.all(testBookings.map(booking => repositories.Booking.addBooking(booking)))
}

export async function clearTestData(repositories: Repositories): Promise<void> {
    await repositories.User.deleteAllUsers()
    await repositories.Theatre.deleteTheatresByQuery({})
    await repositories.Movie.deleteAllMovies()
    await repositories.Schedule.deleteSchedulesByQuery({})
    await repositories.Booking.deleteBookingsByQuery({})
}
