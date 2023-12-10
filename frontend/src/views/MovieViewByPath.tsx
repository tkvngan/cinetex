/** @jsxImportSource @emotion/react */

import {UseCaseCollection} from "cinetex-core/dist/application";
import {useParams} from "react-router-dom";
import React from "react";
import {MovieViewMode} from "./MovieView";
import {MovieViewById} from "./MovieViewById";

export function MovieViewByPath({viewMode, interactors}: {
    viewMode: MovieViewMode,
    interactors: UseCaseCollection
}) {
    const {id} = useParams<{ id: string }>();
    if (id) {
        return (
            <div id="MovieViewByPath"
                 className={"container-fluid"}
                 css={{
                     padding: '2rem 0 0 0',
                     marginLeft: "1rem",
                     marginRight: "1rem"
                 }}>
                <MovieViewById movieId={id} viewMode={viewMode} interactors={interactors}/>
            </div>
        )
    }
    return <div>Error: Movie id not specified</div>
}

export default MovieViewByPath
