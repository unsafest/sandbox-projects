import { key } from './.gitignore/weatherKey.js';

fetch(`https://api.weatherapi.com/v1/current.json?key=${key}=london`,{ mode: 'cors'})
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        console.log(response);
    })

 