import {UseCaseCollections} from "core/dist/application/usecases";
import React, {useEffect, useState} from "react";
import {Movie} from "core/dist/domain/entities";

export default function MoviesPage({interactors}: {interactors: UseCaseCollections}) {
    const {GetAllMovies} = interactors
    const [movies, setMoves] = useState<Movie[]>([])
    useEffect(() => {
        GetAllMovies.invoke({}).then((movies: Movie[]) => {
            setMoves(movies)
        })
    }, [])
    return (
        <div id="MoviesPage">
            {movies && movies.map((movie) =>
                <img key={movie.id} src={movie.imageUrl} alt={movie.name}/>
            )}
        </div>
    )
}
