import {UseCaseCollection} from "cinetex-core/dist/application";
import React from "react";

export function TicketsView({interactors}: { interactors: UseCaseCollection }) {
    return (
        <div id="TicketsView">
            <h1>Tickets</h1>
        </div>
    )
}

export default TicketsView;
