import {UseCaseCollections} from "core/dist/application";
import React, {useEffect, useState} from "react";
import {Movie} from "core/dist/domain/entities";
import * as Icons from 'react-bootstrap-icons';
import "../css/MoviesView.css"

export default function MoviesView({interactors}: {interactors: UseCaseCollections}) {
    const {GetAllMovies} = interactors
    const [movies, setMoves] = useState<Movie[]>([])
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

    useEffect(() => {
        GetAllMovies.invoke({}).then((movies: Movie[]) => {
            setMoves(movies)
        })
    }, [])

    function gridOrList(): string {
        switch (viewMode) {
            case 'grid':
                return 'row-cols-auto'
            case 'list':
                return 'row-cols-1'
            default:
                return ''
        }
    }

    function Toolbar() {
        return (
            <div className="text-end pe-5" >
                {viewMode === 'grid' && <Icons.List onClick = {() => setViewMode('list')}/>}
                {viewMode === 'list' && <Icons.Grid onClick = {() => setViewMode('grid')}/>}
            </div>
        )
    }

    function MovieInfo({movie}: {movie: Movie}) {
        return (
            <div className={`col ${viewMode === 'grid' ? "d-none" : ""} ms-4 mt-1`}>
                <h1>{movie.name}</h1>
                <h4>{movie.synopsis}</h4>
                <h4><small className="text-muted">{movie.releaseDate}</small></h4>
            </div>
        )
    }

    return (
        <div id="MoviesView" className="container">
            <Toolbar/>
            <div className={"row " + gridOrList()}>{movies && movies.map(movie =>
                <div key={movie.id} className="col row row-cols-2 m-5">
                    <img className="col _movie_image" src={movie.imageUrl} alt={movie.name}/>
                    <MovieInfo movie={movie}/>
                </div>
            )}
            </div>
        </div>
    )

}
