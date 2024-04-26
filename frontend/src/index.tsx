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
import {AuthenticationModel} from "./models/AuthenticationModel";
import {CartModel} from "./models/CartModel";
import {setObjectIdFactory} from "cinetex-core/dist/domain/types";
import {AuditoriumModel} from "./models/AuditoriumModel";
import AppFeatures from "./AppFeatures";

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
const authentication = new AuthenticationModel(interactors.SignIn, interactors.SignUp)
const cart = new CartModel(interactors.CreateBooking)
const auditorium = new AuditoriumModel(interactors.GetMovieById, interactors.GetTheatreById, interactors.GetBookingsByTheatreId)
const themeManager = new AppThemeManager("dark")
const features = AppFeatures(interactors, authentication, cart, auditorium)

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <App features={features} authentication={authentication} cart={cart} themeManager={themeManager}/>
    </BrowserRouter>
)

reportWebVitals();
