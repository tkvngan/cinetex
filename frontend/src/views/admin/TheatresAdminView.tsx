/** @jsxImportSource @emotion/react */
import {UseCaseCollection} from "cinetex-core/dist/application/UseCaseCollection";
import React from "react";
import {AdminToolbar} from "./AdminToolbar";

export function TheatresAdminView({interactors}: {interactors: UseCaseCollection}) {
    return (
        <div>
            <AdminToolbar/>
            <div css={{
                paddingTop: '4rem',
                paddingLeft: '4rem',
                height: '30rem',
            }}>
            </div>
        </div>
    )
}
