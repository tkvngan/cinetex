/** @jsxImportSource @emotion/react */
import React from "react";
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import App from "./App";
import {AxiosUseCaseInvokerFactory} from "cinetex-shared/dist/infrastructure/interactors";
import {UseCaseCollection, UseCaseCollectionClient} from "cinetex-core/dist/application";
import {SecurityContext} from "./security/SecurityContext";
import {css} from "@emotion/react";
import {injectGlobal, css as cssJs} from "@emotion/css";
import "bootstrap/dist/css/bootstrap.min.css"
import {ThemeManager} from "./ThemeManager";
import {BrowserRouter} from "react-router-dom";

const globalStyle = css(`
    :root {
        --cinetex-primary-color: #5f0f4f;
        --cinetex-primary-light-color: #ED70EF;
        --cinetex-solid-light-color: white;
        --cinetex-solid-dark-color: black;
        --cinetex-font-size: 2rem;
        --cinetex-font-family: Raleway, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        --cinetex-font-weight: 500;
    }
    html {
        text-rendering: optimizeLegibility;
    }
`)

injectGlobal(globalStyle)

const axiosInstance = axios.create({
    baseURL: "/service",
    headers: {
        "Content-Type": "application/json",
        "Accept": ["application/json", "text/plain", "*/*"],
    },
    timeout: 1000,
})

const invokerFactory = AxiosUseCaseInvokerFactory(axiosInstance)
const interactors: UseCaseCollection = new UseCaseCollectionClient(invokerFactory)
const security = new SecurityContext(interactors.SignIn, interactors.SignUp)
const themeManager = new ThemeManager("dark")

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <App interactors={interactors} security={security} themeManager={themeManager}/>
    </BrowserRouter>
)

reportWebVitals();
