import {Attributes, DataTypes, Model, Op, Sequelize} from "sequelize";
import {Movie, Rating} from "cinetex-core/dist/domain/entities/Movie";
import {MovieRepository} from "../../../application/repositories/MovieRepository";
import {MoviesQuery} from "cinetex-core/dist/application/queries";
import {bracket, rawPredicate, removeNulls, sequelizePredicate} from "./SequelizeUtils";
import dedent from "dedent";
import {WhereOptions} from "sequelize/types/model";

const MovieAttributes: Attributes<Model> = {
    id: {type: DataTypes.STRING, allowNull: false, primaryKey: true},
    name: {type: DataTypes.STRING, allowNull: false},
    releaseDate: {type: DataTypes.STRING, allowNull: false},
    runtimeInMinutes: {type: DataTypes.NUMBER, allowNull: false},
    synopsis: {type: DataTypes.STRING(2000), allowNull: true},
    starring: {type: DataTypes.STRING(1000), allowNull: true},
    director: {type: DataTypes.STRING, allowNull: true},
    producers: {type: DataTypes.STRING, allowNull: true},
    writers: {type: DataTypes.STRING, allowNull: true},
    warning: {type: DataTypes.STRING(1000), allowNull: true},
    languageCode: {type: DataTypes.STRING, allowNull: false},
    movieLanguage: {type: DataTypes.STRING, allowNull: false},
    movieSubtitleLanguage: {type: DataTypes.STRING, allowNull: true},
    smallPosterImageUrl: {type: DataTypes.STRING, allowNull: true},
    mediumPosterImageUrl: {type: DataTypes.STRING, allowNull: true},
    largePosterImageUrl: {type: DataTypes.STRING, allowNull: true},
    trailerUrl: {type: DataTypes.STRING, allowNull: true},
    cineplexId: {type: DataTypes.NUMBER, allowNull: true},
}

const GenreAttributes: Attributes<Model> = {
    name: {type: DataTypes.STRING, allowNull: false, primaryKey: true},
}

const MovieGenreAttributes: Attributes<Model> = {
    MovieId: {type: DataTypes.STRING, allowNull: false, primaryKey: true},
    GenreName: {type: DataTypes.STRING, allowNull: false, primaryKey: true},
}

const RatingAttributes: Attributes<Model> = {
    movieId: {type: DataTypes.STRING, allowNull: false, primaryKey: true},
    provinceCode: {type: DataTypes.STRING, allowNull: false, primaryKey: true},
    warnings: {type: DataTypes.STRING, allowNull: true},
    rating: {type: DataTypes.STRING, allowNull: false},
    ratingDescription: {type: DataTypes.STRING, allowNull: false},
}

type MovieData = Omit<Movie, "genres" | "ratings">

export class GenreModel extends Model<{ name: string }> {}

export class RatingModel extends Model<Rating & { movieId?: string }> {}

export class MovieGenreModel extends Model<{ MovieId: string, GenreName: string }> {}

export class MovieModel extends Model<MovieData> {
    declare getGenres: () => Promise<GenreModel[]>
    declare setGenres: (genres: GenreModel[]) => Promise<void>
    declare getRatings: () => Promise<RatingModel[]>
    declare setRatings: (ratings: RatingModel[]) => Promise<void>
    declare Genres: GenreModel
    declare Ratings: RatingModel

    async toObject(): Promise<Movie> {
        const movie: any = {
            ...this.get({ plain: true, clone: true }),
            genres: (await this.getGenres()).map(model => model.dataValues.name).sort(),
            ratings: (await this.getRatings()).map(model => {
                const rating = { ...model.dataValues }
                delete rating.movieId
                return removeNulls(rating)
            })
        }
        movie.ratings.sort((a: Rating, b: Rating) => a.provinceCode.localeCompare(b.provinceCode))
        delete movie.createdAt
        delete movie.updatedAt
        delete movie.Genres
        delete movie.Ratings
        return removeNulls(movie as Movie);
    }
}

export class SequelizeMovieRepository implements MovieRepository {

    constructor(private readonly sequelize: Sequelize) {
        MovieModel.init(MovieAttributes, {
            sequelize,
            modelName: "Movie",
            timestamps: false,
            tableName: "MOVIE",
            indexes: [
                {fields: ['name'], name: "MOVIE_NAME_IDX"},
                {fields: ['release_date'], name: "MOVIE_RELEASE_DATE_IDX"},
            ],
            underscored: true
        });
        GenreModel.init(GenreAttributes, {
            sequelize, modelName: "Genre", timestamps: false, tableName: "GENRE",
            underscored: true
        });
        RatingModel.init(RatingAttributes, {
            sequelize, modelName: "Rating", timestamps: false, tableName: "MOVIE_RATING",
            underscored: true
        });
        MovieGenreModel.init(MovieGenreAttributes, {
            sequelize, modelName: "MovieGenre", timestamps: false, tableName: "MOVIE_GENRE",
            underscored: true
        });
        MovieModel.belongsToMany(GenreModel, { through: MovieGenreModel, timestamps: false });
        GenreModel.belongsToMany(MovieModel, { through: MovieGenreModel, timestamps: false });
        MovieModel.hasMany(RatingModel, { foreignKey: 'movieId' });
        RatingModel.belongsTo(MovieModel, { foreignKey: 'movieId' });


    }

    async getAllMovies(): Promise<Movie[]> {
        return await Promise.all((await MovieModel.findAll({ include: [GenreModel, RatingModel] })).map(movieModel => movieModel.toObject()));
    }

    async getMovieById(id: string): Promise<Movie | undefined> {
        return (await MovieModel.findByPk(id, { include: [GenreModel, RatingModel] }))?.toObject();
    }

    async getMovieByName(name: string): Promise<Movie | undefined> {
        return (await MovieModel.findOne({ where: { name }, include: [GenreModel, RatingModel] }))?.toObject();
    }

    async getMoviesByQuery(query: MoviesQuery): Promise<Movie[]> {
        const where = sequelizeMovieQuery(query);
        return await Promise.all(
            (await MovieModel.findAll({ where, include: [GenreModel, RatingModel] })).map(movieModel => movieModel.toObject()));
    }

    async deleteAllMovies(): Promise<number> {
        return await MovieModel.destroy({ where: {} });
    }

    async deleteMovieById(id: string): Promise<Movie | undefined> {
        const movieModel = await MovieModel.findByPk(id, { include: [GenreModel, RatingModel] });
        if (movieModel) {
            const movie = await movieModel.toObject()
            await movieModel.destroy();
            return movie
        }
        return undefined;
    }

    async deleteMovieByName(name: string): Promise<Movie | undefined> {
        const movieModel = await MovieModel.findOne({ where: { name } });
        if (movieModel) {
            const movie = await movieModel.toObject();
            await movieModel.destroy();
            return movie;
        }
        return undefined;
    }

    async deleteMoviesByQuery(query: MoviesQuery): Promise<number> {
        const where = sequelizeMovieQuery(query);
        return await MovieModel.destroy({ where });
    }

    async addMovie(movie: Movie): Promise<Movie> {
        try {
            console.log("Adding movie:", movie.id);
            const movieModel: MovieModel = await MovieModel.create(movie);
            const genreModels: GenreModel[] = (await Promise.all(
                movie.genres.map(async (genre: string) =>
                    await GenreModel.findOrCreate({where: {name: genre}, defaults: {name: genre}}))
            )).map(([genreModel]: [GenreModel, boolean]) => genreModel);
            await movieModel.setGenres(genreModels);
            const ratingModels: RatingModel[] = (await Promise.all(
                movie.ratings.map(async (rating: Rating) =>
                    await RatingModel.findOrCreate({
                        where: {movieId: movie.id, provinceCode: rating.provinceCode},
                        defaults: {...rating, movieId: movie.id}
                    }))
            )).map(([ratingModel]: [RatingModel, boolean]) => ratingModel);
            await movieModel.setRatings(ratingModels);
            return await (await movieModel.reload({include: GenreModel})).toObject();
        } catch (e) {
            console.error(e);
            console.log("Error adding movie:", movie.id, "synopsis:", movie.synopsis?.length);
            throw e;
        }
    }

    async updateMovieById(id: string, movie: Partial<Omit<Movie, "id">>): Promise<Movie | undefined> {
        const movieModel = await MovieModel.findByPk(id, { include: [GenreModel, RatingModel] });
        if (movieModel) {
            await movieModel.update(movie);
            if (movie.genres) {
                const genreModels = await Promise.all(movie.genres.map((genre: string) => GenreModel.findOrCreate({ where: { name: genre }, defaults: { name: genre } })));
                await movieModel.setGenres(genreModels.map(([genreModel]) => genreModel));
            }
            if (movie.ratings) {
                const ratingModels = await Promise.all(movie.ratings.map((rating: Rating) => RatingModel.findOrCreate({ where: { movieId: id, provinceCode: rating.provinceCode }, defaults: {...rating, movieId: id} })));
                await movieModel.setRatings(ratingModels.map(([ratingModel]) => ratingModel));
            }
            if (movie.genres || movie.ratings) {
                await movieModel.reload({ include: [GenreModel, RatingModel] });
            }
            return await movieModel.toObject();
        }
        return undefined;
    }
}

function sequelizeMovieQuery(query: MoviesQuery): WhereOptions<MovieData> {
    const predicates: WhereOptions<MovieData>[] = []
    if (query.id) {
        predicates.push(sequelizePredicate<MovieData, string>(MovieModel, "id", query.id))
    }
    if (query.name) {
        predicates.push(sequelizePredicate<MovieData, string>(MovieModel, "name", query.name))
    }
    if (query.director) {
        predicates.push(sequelizePredicate<MovieData, string>(MovieModel, "director", query.director))
    }
    if (query.starring) {
        predicates.push(sequelizePredicate<MovieData, string>(MovieModel, "starring", query.starring))
    }
    if (query.releaseDate) {
        predicates.push(sequelizePredicate<MovieData, string>(MovieModel, "releaseDate", query.releaseDate))
    }
    if (query.genres) {
        const genres: string[] = [];
        if (Array.isArray(query.genres)) {
            genres.push(...query.genres)
        } else {
            genres.push(query.genres)
        }
        if (genres.length === 0) {
            predicates.push(Sequelize.literal(dedent`NOT EXISTS (
                SELECT movie_id FROM ${MovieGenreModel.tableName} WHERE movie_id = ${MovieModel.name}.id)`)
            )
        } else {
            predicates.push(Sequelize.literal(dedent`(
                SELECT count(*) FROM ${MovieGenreModel.tableName}  
                    WHERE movie_id = ${MovieModel.name}.id 
                    AND genre_name IN (${genres.map(genre => `'${genre}'`).join(", ")})
                ) = ${genres.length}`)
            )
        }
    }
    return { [Op.and]: predicates }
}

export function rawMovieSubquery(query: MoviesQuery): string | undefined {
    const predicates: string[] = [];
    if (query.name) {
        predicates.push(rawPredicate("name", query.name));
    }
    if (query.director) {
        predicates.push(rawPredicate("director", query.director));
    }
    if (query.starring) {
        predicates.push(rawPredicate("starring", query.starring));
    }
    if (query.releaseDate) {
        predicates.push(rawPredicate("releaseDate", query.releaseDate));
    }
    if (query.genres) {
        const genres: string[] = [];
        if (Array.isArray(query.genres)) {
            genres.push(...query.genres)
        } else {
            genres.push(query.genres)
        }
        if (genres.length === 0) {
            predicates.push(dedent`NOT EXISTS (
                SELECT * FROM ${MovieGenreModel.tableName}
                    WHERE movie_id = ${MovieModel.tableName}.id
                )`
            )
        } else {
            predicates.push(dedent`${genres.length} = (
                SELECT count(*) FROM ${MovieGenreModel.tableName}
                    WHERE movie_id = ${MovieModel.name}.id
                    AND genre_name IN (${genres.map(genre => `'${genre}'`).join(", ")})
                )`
            )
        }
    }
    if (predicates.length > 0) {
        return dedent`(
            SELECT ${MovieModel.tableName}.id 
                FROM ${MovieModel.tableName}
                WHERE ${predicates.map(bracket).join(" AND ")}
            )`
    } return undefined;
}
