import React from "react";
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import App from "./App";
import {AxiosUseCaseInvokerFactory} from "cinetex-shared/dist/infrastructure/interactors";
import {UseCaseCollection, UseCaseCollectionClient} from "cinetex-core/dist/application";
import {SecurityContext} from "./security/SecurityContext";

require("bootstrap/dist/css/bootstrap.min.css");
require("./css/index.css");

const axiosInstance = axios.create({
    baseURL: "/service",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 1000,
})

const invokerFactory = AxiosUseCaseInvokerFactory(axiosInstance)
const interactors: UseCaseCollection = new UseCaseCollectionClient(invokerFactory)
const security = new SecurityContext(interactors.SignIn)
const root = document.getElementById('root') as HTMLElement

ReactDOM.createRoot(root).render(<App interactors={interactors} security={security}/>)

reportWebVitals();
