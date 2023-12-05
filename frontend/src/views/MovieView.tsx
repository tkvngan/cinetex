/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {Movie} from "cinetex-core/dist/domain/entities";
import {UseCaseCollection} from "cinetex-core/dist/application";
import React, {useEffect} from "react";
import {Link, useParams} from "react-router-dom";

const movieViewStyle = css({
    fontFamily: 'var(--cinetex-font-family)',
    margin: '2rem',

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
    },
    ".movie-info-box": {
        margin: "0.25rem 1.5rem 0.25rem 1.5rem",
        ".movie-title": {
            fontSize: '1.75rem',
            fontWeight: 'bold',
            marginTop: '0rem',
            marginBottom: '1rem'
        },
        ".caption": {
            fontSize: '10px',
            lineHeight: '12px',
            fontWeight: 700,
            marginTop: '0',
            marginBottom: '0.25rem',
            paddingTop: '0.25rem',
            paddingBottom: '0.25rem',
            textTransform: 'uppercase',
        },
        article: {
            margin: '0 0 2rem 0',
            p: {
                fontSize: '1rem',
                fontWeight: 'normal',
                margin: '0',
            },
            "& > article": {
                marginBottom: 0,
                paddingLeft: 0,
                paddingRight: '1rem',
            }
        },
    }
})

export type MovieViewMode = "compact" | "normal" | "expanded"

export function MovieView({movie, viewMode, interactors}: {
    movie: Movie,
    viewMode: MovieViewMode,
    interactors: UseCaseCollection
}) {
    return (
        <div
            className={"movie row row-cols-2"}
            css={movieViewStyle}>
            <div className={"movie-image-box col d-flex align-items-center"}>{
                movie.mediumPosterImageUrl ?
                    <img className="col" src={movie.mediumPosterImageUrl} alt={movie.name}/> :
                    <h4 className="col text-center">{movie.name}</h4>
            }
            </div>
            <div className={`movie-info-box col ${viewMode === "compact" ? "d-none" : ""} col`}>
                <h1 className={"movie-title"}>{movie.name}</h1>
                <article className="row">
                    <article className="col">
                        <p className="caption">Length</p>
                        <p>{movie.runtimeInMinutes}min</p>
                    </article>
                    <article className="col">
                        <p className="caption">Rating</p>
                        <p>PG</p>
                    </article>
                    <article className="col">
                        <p className="caption">Genre</p>
                        <p>{movie.genres.join(", ")}</p>
                    </article>
                    <article className="col">
                        <p className="caption">Release Date</p>
                        <p>{movie.releaseDate.replaceAll("-", "\u2011")}</p>
                    </article>
                    <article className="col">
                        <p className="caption">Show Time</p>
                        <p>{"2:30pm 6:00pm 9:15pm"}</p>
                    </article>
                </article>
                <article className={movie.synopsis && movie.synopsis.length > 0 ? "" : "d-none"}>
                    <p>{movie.synopsis}</p>
                </article>
                <article className={movie.director && movie.director.length > 0 ? "" : "d-none"}>
                    <p className="caption">Director</p>
                    <p>{movie.director}</p>
                </article>
                <article className={movie.starring && movie.starring.length > 0 ? "" : "d-none"}>
                    <p className="caption">Cast</p>
                    <p>{movie.starring}</p>
                </article>
            </div>
        </div>
    )
}

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

export function MovieViewByPath({viewMode, interactors}: {
    viewMode: MovieViewMode,
    interactors: UseCaseCollection
}) {
    const { id } = useParams<{ id: string }>();
    if (id) {
        return (
            <div css={{padding: '2rem'}}>
                <MovieViewById movieId={id} viewMode={viewMode} interactors={interactors}/>
            </div>
        )
    }
    return <div>Error: Movie id not specified</div>
}

export default MovieView
