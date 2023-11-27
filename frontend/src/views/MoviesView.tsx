/** @jsxImportSource @emotion/react */
import {UseCaseCollections} from "cinetex-core/dist/application";
import React, {useEffect, useState} from "react";
import {Movie} from "cinetex-core/dist/domain/entities";
import * as Icons from 'react-bootstrap-icons';
import {css} from "@emotion/react";

const moviesViewStyle = css({
    ".movie-image-box": {
        boxShadow: '5px 10px 18px #000000',
        height: '300px',
        width: '200px',
        padding: '0',
        textAlign: 'center',
        verticalAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        img: {
            objectFit: 'cover',
            height: '100%',
            width: '100%',
            padding: '0',
            backgroundColor: "transparent",
        }
    }
});

export default function MoviesView({interactors}: {interactors: UseCaseCollections}) {
    const {GetAllMovies} = interactors
    const [movies, setMoves] = useState<Movie[]>([])
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

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
            <div className="text-end pe-5">
                <span className="dropdown">
                    <a className="btn" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                        <Icons.FilterRight/>
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <li><a className="dropdown-item fs-4" href="#"><Icons.SortDown/> Name</a></li>
                        <li><a className="dropdown-item fs-4" href="#"><Icons.SortUp/> Release Date</a></li>
                        <li><a className="dropdown-item fs-4" href="#"><Icons.SortUp/> Show Time</a></li>
                    </ul>
                </span>
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
        <div id="MoviesView" className="container" css={moviesViewStyle}>
            <Toolbar/>
            <div className={"row " + gridOrList()}>{movies && movies.map(movie =>
                <div key={movie.id} className="col row row-cols-2 m-5">
                    <div className="col movie-image-box">{
                        movie.mediumPosterImageUrl ?
                        <img className="col" src={ movie.mediumPosterImageUrl} alt={movie.name}/> :
                        <div className="col d-flex flex-column justify-content-center">
                            <h1 className="text-center">
                                {movie.name}
                            </h1>
                        </div>
                    }
                    </div>
                    <MovieInfo movie={movie}/>
                </div>
            )}
            </div>
        </div>
    )

}
