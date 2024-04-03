import {Movie} from "cinetex-core/dist/domain/entities/Movie";
import {MoviesQuery} from "cinetex-core/dist/application/queries";
import {getRepositoriesForTest} from "../test-setup";
import {clearTestData, loadTestData, testMovies, testMovieX} from "../test-data";

describe.each(getRepositoriesForTest())('Test MovieRepository', (repositories) => {

    const repository = repositories.Movie;

    beforeEach(async () => {
        await clearTestData(repositories);
        await loadTestData(repositories);
    })

    test('getAllMovies returns an array of movies', async () => {
        const movies = (await repository.getAllMovies());
        expect(movies).toBeInstanceOf(Array);
        expect(movies).toHaveLength(movies.length)
        expect(movies).toEqual(movies);
    });

    test('getMovieById returns a movie', async () => {
        const movie = (await repository.getMovieById(testMovies[0].id));
        expect(movie).toEqual(testMovies[0]);
    });

    test('getMovieByName returns a movie', async () => {
        const movie = (await repository.getMovieByName(testMovies[0].name));
        expect(movie).toEqual(testMovies[0]);
    });

    test('deleteMovieById deletes a movie', async () => {
        const movie: Movie | undefined = (await repository.deleteMovieById(testMovies[0].id));
        expect(movie).toEqual(testMovies[0]);
        expect(await repository.getMovieById(testMovies[0].id)).toBeUndefined();
        expect(await repository.getAllMovies()).toHaveLength(testMovies.length - 1);
    });

    test('deleteMovieByName deletes a movie', async () => {
        const movie: Movie | undefined = (await repository.deleteMovieByName(testMovies[0].name));
        expect(movie).toEqual(testMovies[0]);
        expect(await repository.getMovieByName(testMovies[0].name)).toBeUndefined();
        expect(await repository.getAllMovies()).toHaveLength(testMovies.length - 1);
    });

    test('deleteMoviesByQuery deletes movies', async () => {
        const query = {name: testMovies[0].name};
        const count = await repository.deleteMoviesByQuery(query);
        expect(count).toEqual(1);
        expect(await repository.getMovieById(testMovies[0].id)).toBeUndefined();
        expect(await repository.getAllMovies()).toHaveLength(testMovies.length - 1);
    });

    test('deleteAllMovies deletes all movies', async () => {
        const count = await repository.deleteAllMovies();
        expect(count).toEqual(testMovies.length);
        expect(await repository.getAllMovies()).toHaveLength(0);
    });

    test('updateMovieById updates a movie', async () => {
        const updatedMovie = {...testMovies[0], name: 'updatedName'};
        const movie = await repository.updateMovieById(updatedMovie.id, updatedMovie);
        expect(movie).toEqual(updatedMovie);
        const movies = await repository.getAllMovies();
        expect(movies).toHaveLength(movies.length);
        expect(movies).toContainEqual(updatedMovie);
    });

    test('getMoviesByQuery returns an array of movies whose name is "All Of Us Strangers"', async () => {
        const query: MoviesQuery = {name: "All Of Us Strangers"};
        const movies = (await repository.getMoviesByQuery(query));
        expect(movies).toBeInstanceOf(Array);
        expect(movies).toHaveLength(1);
        expect(movies).toContainEqual(testMovies[0]);
    });

    test('getMoviesByQuery returns an array of movies whose name contains "All"', async () => {
        const query: MoviesQuery = {name: {pattern: ".*all .*", options: "i"}};
        const movies = (await repository.getMoviesByQuery(query));
        expect(movies).toBeInstanceOf(Array);
        expect(movies).toHaveLength(1);
        expect(movies).toContainEqual(testMovies[0]);
    });

    test('getMoviesByQuery returns an array of movies with matching ids', async () => {
        const query: MoviesQuery = {id: ["6563a43f92c740d467db925b", "6563a43f92c740d467db927b"]};
        const movies = (await repository.getMoviesByQuery(query));
        expect(movies).toBeInstanceOf(Array);
        expect(movies).toHaveLength(2);
        expect(movies).toContainEqual(testMovies[0]);
        expect(movies).toContainEqual(testMovies[1]);
    });

    test('getMoviesByQuery returns an array of 1 movie with matching genres', async () => {
        const query: MoviesQuery = {genres: ["Action", "Romance"]};
        const movies = (await repository.getMoviesByQuery(query));
        expect(movies).toBeInstanceOf(Array);
        expect(movies).toHaveLength(1);
        expect(movies).toContainEqual(testMovies[1]);
    });

    test('getMoviesByQuery returns an array of 2 movies with matching genres', async () => {
        const query: MoviesQuery = {genres: ["Action"]};
        const movies = (await repository.getMoviesByQuery(query));
        expect(movies).toBeInstanceOf(Array);
        expect(movies).toHaveLength(2);
        expect(movies).toContainEqual(testMovies[0]);
        expect(movies).toContainEqual(testMovies[1]);
    });

    test('getMoviesByQuery returns an array of 0 movie with no matching genres', async () => {
        const query: MoviesQuery = {genres: ["Drama", "Thriller"]};
        const movies = (await repository.getMoviesByQuery(query));
        expect(movies).toBeInstanceOf(Array);
        expect(movies).toHaveLength(0);
    });

    test('getMoviesByQuery returns array of movies with empty genres', async () => {
        const query: MoviesQuery = {genres: []};
        const movies = (await repository.getMoviesByQuery(query));
        expect(movies).toBeInstanceOf(Array);
        expect(movies).toHaveLength(0);

        await repository.updateMovieById(testMovies[0].id, {genres: []});
        const moviesWithNoGenre = (await repository.getMoviesByQuery(query));
        expect(moviesWithNoGenre).toBeInstanceOf(Array);
        expect(moviesWithNoGenre).toHaveLength(1);

    });

    test('addMovie adds a movie', async () => {
        const movie = (await repository.addMovie(testMovieX));
        expect(movie).toEqual(testMovieX);
        const movies = (await repository.getAllMovies());
        expect(movies).toHaveLength(testMovies.length + 1);
        expect(movies).toContainEqual(testMovieX);
        expect(movies).toContainEqual(testMovies[0]);
        expect(movies).toContainEqual(testMovies[1]);
    });
});
