/** @jsxImportSource @emotion/react */

import React, {ReactElement, ReactNode} from "react";
import {HomeView} from "./views/HomeView";
import {MoviesView} from "./views/MoviesView";
import {UseCaseCollection} from "cinetex-core/dist/application";
import {TheatresView} from "./views/TheatresView";
import {TicketsView} from "./views/TicketsView";
import {AdminView} from "./views/admin/AdminView";
import {MoviesAdminView} from "./views/admin/MoviesAdminView";
import {UsersAdminView} from "./views/admin/UsersAdminView";
import {TheatresAdminView} from "./views/admin/TheatresAdminView";
import {BookingsAdminView} from "./views/admin/BookingsAdminView";
import {SettingsAdminView} from "./views/admin/SettingsAdminView";
import {WIPView} from "./views/WIPView";
import {WIPAdminView} from "./views/admin/WIPAdminView";
import {SecurityContext} from "./security/SecurityContext";
import {MovieViewByPath} from "./views/MovieViewByPath";

export type AppFeatureItem = {
    view?: ReactNode | (() => ReactNode)
    items?: never;
}

export type AppFeatureGroup = {
    items: AppFeatureItem[];
    view?: never;
}

export type AppFeature = (AppFeatureItem | AppFeatureGroup) & {
    name: string;
    path: string;
    icon?: ReactElement;
    roles?: string[];
    visible?: "always" | "never" | "when-active";
    theme?: 'light' | 'dark';
}

export function AppFeatures(interactors: UseCaseCollection, security: SecurityContext): AppFeature[] {
    return [
        {name: "Home", path: "/", visible: "never", view: () => <HomeView/>},
        {name: "Movies", path: "/Movies", view: () => <MoviesView interactors={interactors}/>},
        {name: "Movie", path: "/Movie/:id", visible: "when-active", view: () => <MovieViewByPath viewMode="expanded" interactors={interactors}/>},
        {name: "Theatres", path: "/Theatres", view: () => <TheatresView interactors={interactors}/>},
        {name: "Tickets", path: "/Tickets", view: () => <WIPView/>},
        {name: "System", path: "/System", roles: ["admin"], visible: "always", theme: "light", view: () => <WIPAdminView interactors={interactors}/>},
        {name: "System - Users", path: "/System/Users", roles: ["admin"], visible: "never", theme: "light", view: () => <WIPAdminView interactors={interactors}/>},
        {name: "System - Movies", path: "/System/Movies", roles: ["admin"], visible: "never", theme: "light", view: () => <MoviesAdminView interactors={interactors} credentials={security.credentials}/>},
        {name: "System - Theatres", path: "/System/Theatres", roles: ["admin"], visible: "never", theme: "light", view: () => <WIPAdminView interactors={interactors}/>},
        {name: "System - Bookings", path: "/System/Bookings", roles: ["admin"], visible: "never", theme: "light", view: () => <WIPAdminView interactors={interactors}/>},
        {name: "System - Settings", path: "/System/Settings", roles: ["admin"], visible: "never", theme: "light", view: () => <WIPAdminView interactors={interactors}/>},
        {name: "About", path: "/About", theme: "light", view: () => <WIPView/> },
    ]
}

export default AppFeatures
