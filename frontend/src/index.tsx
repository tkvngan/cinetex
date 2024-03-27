/** @jsxImportSource @emotion/react */

import React from "react";
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import {App} from "./App";
import {AxiosUseCaseInvoker} from "cinetex-shared/dist/infrastructure/interactors/AxiosUseCaseInvoker";
import {UseCaseCollection} from "cinetex-core/dist/application/UseCaseCollection";
import {css} from "@emotion/react";
import {injectGlobal} from "@emotion/css";
import {AppThemeManager} from "./AppThemeManager";
import {BrowserRouter} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import {SecurityModel} from "./models/SecurityModel";
import {CartModel} from "./models/CartModel";
import {setObjectIdFactory} from "cinetex-core/dist/domain/types";

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

setObjectIdFactory(() => {
    function hex (value: number) {
        return Math.floor(value).toString(16)
    }
    return hex(Date.now() / 1000) +
        ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16))
    }
)

const axiosInstance = axios.create({
    baseURL: "/service",
    headers: {
        "Content-Type": "application/json",
        "Accept": ["application/json", "text/plain", "*/*"],
    },
    timeout: 1000 * 30,
})

const invoker = AxiosUseCaseInvoker(axiosInstance)
const interactors: UseCaseCollection = UseCaseCollection(invoker)
const security = new SecurityModel(interactors.SignIn, interactors.SignUp)
const cart = CartModel()

const themeManager = new AppThemeManager("dark")

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <App interactors={interactors} security={security} cart={cart} themeManager={themeManager}/>
    </BrowserRouter>
)

reportWebVitals();
