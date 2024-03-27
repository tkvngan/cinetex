import {MovieRepository} from "../../../application/repositories/MovieRepository";
import {filterArrayField, filterField, filterIdField, toObjectId} from "./MongoDBUtils";
import {FilterQuery, Model, Schema, SchemaDefinition} from "mongoose";
import {Movie} from "cinetex-core/dist/domain/entities/Movie";
import {MoviesQuery} from "cinetex-core/dist/application/queries";
import {DefaultSchemaOptions, DefaultSubSchemaOptions} from "./MongoDBRepositories";
import {MongoDBRepository} from "./MongoDBRepository";

const RatingSchemaDefinition: SchemaDefinition = {
    provinceCode: {type: String, required: true},
    warnings: {type: String, required: false},
    rating: {type: String, required: true},
    ratingDescription: {type: String, required: true},
}

const RatingSchema = new Schema(RatingSchemaDefinition, DefaultSubSchemaOptions)

const MovieSchemaDefinition: SchemaDefinition = {
    name: {type: String, required: true},
    releaseDate: {type: String, required: true},
    runtimeInMinutes: {type: Number, required: true},
    genres: {type: [String], required: true},
    synopsis: {type: String, required: false},
    starring: {type: String, required: false},
    director: {type: String, required: false},
    producers: {type: String, required: false},
    writers: {type: String, required: false},
    ratings: {type: [RatingSchema], required: true, options: DefaultSchemaOptions},

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

export const MovieSchema = new Schema(MovieSchemaDefinition, DefaultSchemaOptions)

export function createMovieFilter(query: MoviesQuery): FilterQuery<Movie> {
    const filter: FilterQuery<any> = {}
    if (query.id) {
        filterIdField(filter, "_id", query.id)
    }
    if (query.name) {
        filterField(filter, "name", query.name)
    }
    if (query.genres) {
        filterArrayField(filter, "genres", query.genres)
    }
    if (query.director) {
        filterField(filter, "directory", query.director)
    }
    if (query.starring) {
        filterArrayField(filter, "starring", query.starring)
    }
    if (query.releaseDate) {
        filterField(filter, "releaseDate", query.releaseDate)
    }
    return filter
}

export class MongoDBMovieRepository extends MongoDBRepository<Movie> implements MovieRepository {

    constructor(model: Model<Movie>) {
        super(model)
    }

    async getAllMovies(): Promise<Movie[]> {
        return (await this.model.find()).map(movie => movie.toObject(this.toObjectOptions));
    }

    async getMovieById(id: string): Promise<Movie | undefined> {
        return (await this.model.findById(toObjectId(id)))?.toObject(this.toObjectOptions);
    }

    async getMovieByName(name: string): Promise<Movie | undefined> {
        return (await this.model.findOne({name: name}))?.toObject(this.toObjectOptions);
    }

    async getMoviesByQuery(query: MoviesQuery): Promise<Movie[]> {
        const filter = createMovieFilter(query);
        return (await this.model.find(filter)).map(movie => movie.toObject(this.toObjectOptions));
    }


    async addMovie(movie: Movie): Promise<Movie> {
        return (await this.model.create(this.fromObject(movie))).toObject(this.toObjectOptions);
    }

    async deleteMovieById(id: string): Promise<Movie | undefined> {
        return (await this.model.findByIdAndDelete(toObjectId(id), {returnDocument: "before"}))?.toObject(this.toObjectOptions);
    }

    async deleteMovieByName(name: string): Promise<Movie | undefined> {
        return (await this.model.findOneAndDelete({name: name}, {returnDocument: "before"}))?.toObject(this.toObjectOptions);
    }

    async deleteMoviesByQuery(query: MoviesQuery): Promise<number> {
        const filter = createMovieFilter(query);
        return (await this.model.deleteMany(filter)).deletedCount || 0
    }

    async updateMovieById(id: string, movie: Partial<Omit<Movie, "id">>): Promise<Movie | undefined> {
        return (await this.model.findByIdAndUpdate(toObjectId(id), {$set: {...movie}}, {returnDocument: "after"}))?.toObject(this.toObjectOptions)
    }

    async deleteAllMovies(): Promise<number> {
        return (await this.model.deleteMany({})).deletedCount || 0
    }

}
