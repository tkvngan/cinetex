/** @jsxImportSource @emotion/react */

import {UseCaseCollection} from "cinetex-core/dist/application/UseCaseCollection";
import React, {useEffect} from "react";
import {Movie} from "cinetex-core/dist/domain/entities/Movie";
import {MovieView, MovieViewMode} from "./MovieView";

export function MovieViewById({movieId, viewMode, interactors}: {
    movieId: string,
    viewMode: MovieViewMode,
    interactors: UseCaseCollection
}) {
    const [movie, setMovie] = React.useState<Movie | undefined>(undefined)
    const [isNotFound, setIsNotFound] = React.useState<boolean>(false)
    const [error, setError] = React.useState<any>(undefined)
    useEffect(() => {
        interactors.GetMovieById.invoke({id: movieId}).then((movie: Movie | undefined) => {
            setMovie(movie)
            if (movie === undefined) {
                setIsNotFound(true)
            }
        }).catch((error: any) => {
            setIsNotFound(true)
            setError(error)
        })
    }, []);
    if (error) {
        return <div>{`Error: ${error}`}</div>
    }
    if (isNotFound) {
        return <div>{`Error: No such movie with id = ${movieId}`}</div>
    }
    if (movie === undefined) {
        return <div></div>
    }
    return <MovieView movie={movie} viewMode={viewMode} interactors={interactors}/>
}

export default MovieViewById
