import {MovieRepository} from "../../application/repositories";
import {toObjectId, toPatternFilter, toRangeFilter} from "./MongoDBUtils";
import {FilterQuery, Model} from "mongoose";
import {Movie} from "shared/dist/domain/entities/Movie";
import {MovieQueryCriteria} from "shared/dist/application/usecases/queries/GetMoviesByQuery";

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

        async getMoviesByQuery(criteria: MovieQueryCriteria): Promise<Movie[]> {
            const filter = createMovieFilter(criteria);
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

        async deleteMoviesByQuery(criteria: MovieQueryCriteria): Promise<number> {
            const filter = createMovieFilter(criteria);
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

    function createMovieFilter(criteria: MovieQueryCriteria): FilterQuery<Movie> {
        const filter: FilterQuery<any> = {}
        if (criteria.name) {
            filter.name = toPatternFilter(criteria.name)
        }
        if (criteria.genres) {
            filter.genres = { $all: criteria.genres }
        }
        if (criteria.rating) {
            filter.rating = { $in: criteria.rating }
        }
        if (criteria.director) {
            filter.director = toPatternFilter(criteria.director)
        }
        if (criteria.cast) {
            filter.cast = { $all: criteria.cast }
        }
        if (criteria.releaseDate) {
            filter.releaseDate = toRangeFilter(criteria.releaseDate)
        }
        return filter as FilterQuery<Movie>
    }
}
