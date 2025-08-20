import axios from "axios";

const instancia = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 5000,
});
 
window.api = api;