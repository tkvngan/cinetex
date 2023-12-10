import {MovieRepository} from "../../application/repositories";
import {asArrayFieldFilter, asFieldFilter, asIdFieldFilter, toObjectId} from "./MongoDBUtils";
import {FilterQuery, Model, SchemaDefinition, ToObjectOptions} from "mongoose";
import {Movie} from "cinetex-core/dist/domain/entities/Movie";
import {MoviesQuery} from "cinetex-core/dist/application/queries";
import {DefaultSubSchemaOptions, DefaultToObjectOptions, fromObject} from "./MongoDBRepositories";

export const RatingSchemaDefinition: SchemaDefinition = {
    provinceCode: {type: String, required: true},
    warnings: {type: [String], required: true},
    rating: {type: String, required: true},
    ratingDescription: {type: String, required: true},
}

export const BillboardSchemaDefinition: SchemaDefinition = {
    alt: {type: String, required: false},
    mobileImageUrl: {type: String, required: false},
    tabletImageUrl: {type: String, required: false},
    desktopImageUrl: {type: String, required: false},
    largeDesktopImageUrl: {type: String, required: false},
}

export const MovieSchemaDefinition: SchemaDefinition = {
    name: {type: String, required: true},
    releaseDate: {type: String, required: true},
    runtimeInMinutes: {type: Number, required: true},
    genres: {type: [String], required: true},
    synopsis: {type: String, required: false},
    starring: {type: String, required: false},
    director: {type: String, required: false},
    producers: {type: String, required: false},
    writers: {type: String, required: false},
    ratings: {type: [RatingSchemaDefinition], required: true, options: DefaultSubSchemaOptions},

    billboard: {type: BillboardSchemaDefinition, required: false, options: DefaultSubSchemaOptions},
    warning: {type: String, required: false},
    languageCode: {type: String, required: true},
    movieLanguage: {type: String, required: true},
    movieSubtitleLanguage: {type: String, required: false},

    smallPosterImageUrl: {type: String, required: false},
    mediumPosterImageUrl: {type: String, required: false},
    largePosterImageUrl: {type: String, required: false},
    trailerUrl: {type: String, required: false},

    cineplexId: {type: Number, required: false},
}

export function createMovieFilter(query: MoviesQuery): FilterQuery<Movie> {
    const filter: FilterQuery<any> = {}
    if (query.id) {
        filter._id = asIdFieldFilter(query.id)
        return filter
    }
    if (query.name) {
        filter.name = asFieldFilter(query.name)
    }
    if (query.genre) {
        filter.genres = asArrayFieldFilter(query.genre)
    }
    if (query.director) {
        filter.director = asFieldFilter(query.director)
    }
    if (query.starring) {
        filter.starring = asArrayFieldFilter(query.starring)
    }
    if (query.releaseDate) {
        filter.releaseDate = asFieldFilter(query.releaseDate)
    }
    return filter
}

export function MongoDBMovieRepository(model: Model<Movie>): MovieRepository {
    return {
        async getAllMovies(): Promise<Movie[]> {
            return (await model.find()).map(movie => movie.toObject(DefaultToObjectOptions));
        },

        async getMovieById(id: string): Promise<Movie | undefined> {
            return (await model.findById(toObjectId(id)))?.toObject(DefaultToObjectOptions);
        },

        async getMovieByName(name: string): Promise<Movie | undefined> {
            return (await model.findOne({name: name}))?.toObject(DefaultToObjectOptions);
        },

        async getMoviesByQuery(query: MoviesQuery): Promise<Movie[]> {
            const filter = createMovieFilter(query);
            return (await model.find(filter)).map(movie => movie.toObject(DefaultToObjectOptions));
        },


        async addMovie(movie: Movie): Promise<Movie> {
            return (await model.create(fromObject(movie))).toObject(DefaultToObjectOptions);
        },

        async deleteMovieById(id: string): Promise<Movie | undefined> {
            return (await model.findByIdAndDelete(toObjectId(id), {returnDocument: "before"}))?.toObject(DefaultToObjectOptions);
        },

        async deleteMovieByName(name: string): Promise<Movie | undefined> {
            return (await model.findOneAndDelete({name: name}, {returnDocument: "before"}))?.toObject(DefaultToObjectOptions);
        },

        async deleteMoviesByQuery(query: MoviesQuery): Promise<number> {
            const filter = createMovieFilter(query);
            return (await model.deleteMany(filter)).deletedCount || 0
        },

        async updateMovieById(id: string, movie: Partial<Omit<Movie, "id">>): Promise<Movie | undefined> {
            delete (movie as any).id
            return (await model.findByIdAndUpdate(toObjectId(id), {$set: movie}, {returnDocument: "after"}))?.toObject(DefaultToObjectOptions)
        },

        async deleteAllMovies(): Promise<number> {
            return (await model.deleteMany({})).deletedCount || 0
        }
    }

}
