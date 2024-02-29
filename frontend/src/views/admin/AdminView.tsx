/** @jsxImportSource @emotion/react */
import {UseCaseCollection} from "cinetex-core/dist/application/UseCaseCollection";
import React from "react";
import {AdminToolbar} from "./AdminToolbar";
import wip from '../../assets/wip3.png';

export function AdminView({interactors}: {interactors: UseCaseCollection}) {
    return (
        <div>
            <AdminToolbar/>
            <div css={{
                    paddingTop: '4rem',
                    paddingLeft: '4rem',
                    height: '100%',
                    backgroundImage: `url(${wip})`,
                    objectFit: 'contain',
                }} className={"d-flex align-items-center justify-content-center"}>

            </div>
        </div>
    )
}
