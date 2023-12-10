/** @jsxImportSource @emotion/react */
import React from "react";
import {Link, useMatch} from "react-router-dom";

export function Toolbar({tabs, theme, children}: {
    tabs: {name: string, path: string}[],
    theme?: "dark" | "light",
    children?: React.ReactNode
}) {
    const pathMatch = tabs.map((tab) => useMatch(tab.path)).find((match) => match !== null)

    function isActive(path: string) {
        return pathMatch?.pattern?.path === path
    }

    function isDarkTheme(): boolean {
        return (theme === 'dark')
    }

    return (
        <div
            className={"admin-toolbar d-flex align-items-center"}
            css={{
                paddingLeft: '3rem',
                paddingRight: '3rem',
                width: '100%',
                height: '4rem',
                position: "fixed",
                left: '0px',
                ...(isDarkTheme() ? {
                    backgroundColor: 'transparent',
                } : {
                    backgroundColor: 'white',
                }),
                span: {
                    margin: 0,
                    padding: 8,
                    ".btn": {
                        padding: 0,
                         svg: {
                            fontSize: '1.25rem',
                        },
                    },
                    "&:hover": {
                        cursor: "pointer",
                    }
                },
                ".nav-link.active": {
                    color: "var(--bs-nav-link-color)",
                }
            }} data-bs-theme={theme ?? "dark"}>
            <ul className="nav nav-underline me-auto"> {
                tabs.map((tab, index) => {
                    return <li key={index} className="nav-item">
                        <Link
                            className={`nav-link ${isActive(tab.path) ? "active" : ""}`}
                            aria-current={isActive(tab.path) ? "page" : "false"}
                            to={tab.path}>
                            {tab.name}
                        </Link>
                    </li>
                })
            }
            </ul>
            {children}
        </div>
    )
}

export default Toolbar
