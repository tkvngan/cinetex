import React from "react";
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import App from "./App";
import {AxiosUseCaseInvokerFactory} from "cinetex-shared/dist/infrastructure/interactors";
import {UseCaseCollection, UseCaseCollectionClient} from "cinetex-core/dist/application";

require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/js/bootstrap.bundle.min.js");
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
const root = document.getElementById('root') as HTMLElement

ReactDOM.createRoot(root).render(<App interactors={interactors}/>)

reportWebVitals();
