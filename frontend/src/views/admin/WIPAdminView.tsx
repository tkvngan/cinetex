/** @jsxImportSource @emotion/react */

import wip from "../../assets/wip1.png";
import React from "react";
import {UseCaseCollection} from "cinetex-core/dist/application/UseCaseCollection";
import {AdminToolbar} from "./AdminToolbar";


export function WIPAdminView({interactors}: { interactors?: UseCaseCollection}) {
    return (
        <div>
            <AdminToolbar/>
            <div className={"d-flex align-items-center justify-content-center"} css={{
                paddingTop: '4rem',
                paddingLeft: '4rem',
                height: '45rem',
                backgroundImage: `url(${wip})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                objectFit: 'contain',
            }}>
            </div>
        </div>

    )
}
