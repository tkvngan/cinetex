import {UseCaseCollections} from "core/dist/application/usecases";
import React from "react";
import "../css/TicketsView.css"

export default function TicketsView({interactors}: { interactors: UseCaseCollections }) {
    return (
        <div id="TicketsView">
            <h1>Tickets</h1>
        </div>
    )
}
