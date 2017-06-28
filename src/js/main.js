window.jQuery = require("jquery");
window.$ = require("jquery");
import 'materialize-css/dist/css/materialize.css';
require("materialize-css/dist/js/materialize.js");
import '../css/main.css';

import {MainView} from './views';
import {CITIES} from './params';

let random_cities = (n) => {
    for (let i = 0; i < n; i++) {
        CITIES.push({
            'x': Math.floor(Math.random() * 100),
            'y': Math.floor(Math.random() * 100)
        });
    }
};

$(() => {
    random_cities(30);
    let main_view = new MainView();
});

