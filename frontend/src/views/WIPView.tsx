/** @jsxImportSource @emotion/react */

import wip from "../assets/wip1.png";
import React from "react";
import {UseCaseCollection} from "cinetex-core/dist/application";


export function WIPView({interactors}: { interactors?: UseCaseCollection}) {
    return (
        <div>
            <div className={"d-flex align-items-center justify-content-center"} css={{
                paddingTop: '4rem',
                paddingLeft: '4rem',
                height: '35rem',
                backgroundImage: `url(${wip})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                objectFit: 'contain',
            }}>
            </div>
        </div>

    )
}
