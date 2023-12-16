/** @jsxImportSource @emotion/react */

import React from "react";
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import {App} from "./App";
import {AxiosUseCaseInvoker} from "cinetex-shared/dist/infrastructure/interactors";
import {UseCaseCollection} from "cinetex-core/dist/application";
import {SecurityContext} from "./security/SecurityContext";
import {css} from "@emotion/react";
import {injectGlobal} from "@emotion/css";
import {AppThemeManager} from "./AppThemeManager";
import {BrowserRouter} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import {createCartModel} from "./models/CartModel";

/*#5f0f4f;*/
const globalStyle = css(`
    :root {
        --cinetex-primary-color: rgb(100,32,98);
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

const invoker = AxiosUseCaseInvoker(axiosInstance)
const interactors: UseCaseCollection = UseCaseCollection(invoker)
const security = new SecurityContext(interactors.SignIn, interactors.SignUp)
const cart = createCartModel()

const themeManager = new AppThemeManager("dark")

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <App interactors={interactors} security={security} cart={cart} themeManager={themeManager}/>
    </BrowserRouter>
)

reportWebVitals();
