import './app.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import App from './App.svelte'
import './api/axios.js';

const app = new App({
  target: document.getElementById('app'),
})

export default app
