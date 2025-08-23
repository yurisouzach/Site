import axios from "axios";

const instancia = axios.create({
    baseURL: 'https://site-production-a8bd-casamento.up.railway.app/',
    timeout: 5000,
});
 
window.api = api;
