import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Axios from 'axios';
import { AxiosUseCaseDispatchers } from 'shared/dist/infrastructure/dispatchers'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const client = Axios.create({
  baseURL: 'http://localhost:3001/service',
  headers: {
    'Content-Type': 'application/json',
  },
});

const dispatchers = AxiosUseCaseDispatchers(client);
dispatchers.GetAllMovies.invoke({}).then((res) => {
    console.log("Response: " + JSON.stringify(res, null, 2));
}).catch((err) => {
    console.log("Error: " + err);
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
