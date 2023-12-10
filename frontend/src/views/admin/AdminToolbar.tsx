/** @jsxImportSource @emotion/react */
import React from "react";
import Toolbar from "../Toolbar";


const adminTabs = [
    {name:"System", path:"/System"},
    {name:"Users", path:"/System/Users"},
    {name:"Movies", path:"/System/Movies"},
    {name:"Theatres", path:"/System/Theatres"},
    {name:"Bookings", path:"/System/Bookings"},
    {name:"Settings", path:"/System/Settings"},
]

export function AdminToolbar({children}: {
    children?: React.ReactNode
}) {
    return (
        <Toolbar tabs={adminTabs} theme={"light"}>
            {children}
        </Toolbar>
    )
}
