import {MovieRepository} from "../../application/repositories";
import {asArrayFieldFilter, asFieldFilter, asIdFieldFilter, toObjectId} from "./MongoDBUtils";
import {FilterQuery, Model, SchemaDefinition} from "mongoose";
import {Movie} from "cinetex-core/dist/domain/entities/Movie";
import {MoviesQuery} from "cinetex-core/dist/application/queries";

export const MovieSchemaDefinition: SchemaDefinition = {
    name: {type: String, required: true, unique: true, index: true},
    duration: {type: Number, required: true},
    synopsis: {type: String, required: true},
    director: {type: String, required: true},
    cast: {type: [String], required: true},
    releaseDate: {type: String, required: true},
    rating: {type: String, required: true},
    genres: {type: [String], required: true},
    imageUrl: {type: String, required: false},
    trailerUrl: {type: String, required: false},
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
    if (query.rating) {
        filter.rating = asFieldFilter(query.rating)
    }
    if (query.director) {
        filter.director = asFieldFilter(query.director)
    }
    if (query.cast) {
        filter.cast = asArrayFieldFilter(query.cast)
    }
    if (query.releaseDate) {
        filter.releaseDate = asFieldFilter(query.releaseDate)
    }
    return filter
}

export function MongoDBMovieRepository(model: Model<Movie>): MovieRepository {
    return {
        async getAllMovies(): Promise<Movie[]> {
            return (await model.find()).map(movie => movie.toObject());
        },

        async getMovieById(id: string): Promise<Movie | undefined> {
            return (await model.findById(toObjectId(id)))?.toObject();
        },

        async getMovieByName(name: string): Promise<Movie | undefined> {
            return (await model.findOne({name: name}))?.toObject();
        },

        async getMoviesByQuery(query: MoviesQuery): Promise<Movie[]> {
            const filter = createMovieFilter(query);
            return (await model.find(filter)).map(movie => movie.toObject());
        },

        async addMovie(movie: Movie): Promise<Movie> {
            return (await model.create(movie)).toObject();
        },

        async deleteMovieById(id: string): Promise<Movie | undefined> {
            return (await model.findByIdAndDelete(toObjectId(id), {returnDocument: "before"}))?.toObject();
        },

        async deleteMovieByName(name: string): Promise<Movie | undefined> {
            return (await model.findOneAndDelete({name: name}, {returnDocument: "before"}))?.toObject();
        },

        async deleteMoviesByQuery(query: MoviesQuery): Promise<number> {
            const filter = createMovieFilter(query);
            return (await model.deleteMany(filter)).deletedCount || 0
        },

        async updateMovieById(id: string, movie: Partial<Omit<Movie, "id">>): Promise<Movie | undefined> {
            delete (movie as any).id
            return (await model.findByIdAndUpdate(toObjectId(id), {$set: movie}, {returnDocument: "after"}))?.toObject()
        },

        async deleteAllMovies(): Promise<number> {
            return (await model.deleteMany({})).deletedCount || 0
        }
    }

}
