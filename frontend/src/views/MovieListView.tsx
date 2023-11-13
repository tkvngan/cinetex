import React, {useEffect, useState} from 'react'

import {AllUseCaseCollection} from "shared/dist/application/usecases";
import {Movie} from "shared/dist/domain/entities";

export function MovieListView({interactors}: {interactors: AllUseCaseCollection}) {
    const {GetAllMovies} = interactors
    const [movies, setMoves] = useState<Movie[]>([])

    useEffect(() => {
        renderMovies()
    }, [])

    function reloadMovies() {
        GetAllMovies.invoke({}).then((movies) => {
            console.log("Movies", JSON.stringify(movies, null, 2))
            setMoves(movies)
        })
    }

    function renderMovies() {
        return movies.map((movie) => (
            <tr key={movie.id}>
                <td>{movie.name}</td>
                <td>{movie.duration}</td>
                <td>{movie.synopsis}</td>
                <td>{movie.director}</td>
                <td>{movie.cast.join(", ")}</td>
                <td>{movie.releaseDate}</td>
                <td>{movie.rating}</td>
                <td>{movie.genres.join(", ")}</td>
            </tr>
        ))
    }

    return (
        <div>
            <h1 className={"text-center"}>Movies</h1>
            <button className="btn btn-primary" onClick={reloadMovies}>Refresh</button>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Duration</th>
                    <th scope="col">Synopsis</th>
                    <th scope="col">Director</th>
                    <th scope="col">Cast</th>
                    <th scope="col">Release Date</th>
                    <th scope="col">Rating</th>
                    <th scope="col">Genres</th>
                </tr>
                </thead>
                <tbody>
                {renderMovies()}
                </tbody>
            </table>
        </div>
    )
}
