import { key } from './weatherKey.js';
import { giphyKey } from './giphyKey.js';

function processWeatherData(response) {
    return {
        Location: response.location.name,
        Temperature: response.current.temp_c + "°C", 
        Wind: "Wind - " + response.current.wind_kph + " km/h  🧭 " + response.current.wind_dir,
        Humidity: "Humidity - " + response.current.humidity + "%",
        FeelsLike: "Feels like - " + response.current.feelslike_c + "°C",
        Condition: response.current.condition.text,
        Icon: response.current.condition.icon,
        //More
        WindDirection:"Wind direction - °" + response.current.wind_degree + " (" + response.current.wind_dir + ")",
        WindChill: "Wind chill - " + response.current.windchill_c + "°C",
        Precipitation: "Precipitation - " + response.current.precip_mm + " mm",
        Pressure: "Pressure - " + response.current.pressure_mb + " mb",
        Gusts: "Wind gusts - " + response.current.gust_kph + " km/h",
        UV: "UV Index - " + response.current.uv,
        Visibility: "Visibility - " + response.current.vis_km + " km",
        Cloud: "Cloud cover - " + response.current.cloud + "%",

    }
}

function getWeather(location){
    fetch(`https://api.weatherapi.com/v1/current.json?key=${key}&q=${location}`,{ mode: 'cors'})
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            let weatherData = processWeatherData(response);
            getGif(weatherData.Condition);
            return weatherData;
        })
        .then(function(response) {
            console.log(response);
            Object.keys(response).forEach(key => {
                let element = document.querySelector(`#${key}`);
                if (element) {
                    if (key === "Icon") {
                        element.src = response[key];
                    } else {
                        element.innerHTML = response[key];
                    }
                }
            })
        });
}

function processGiphyData(response) {
    return {
        Gif: response.data.images.original.url
    }
}

function getGif(condition) {
    fetch(`https://api.giphy.com/v1/gifs/translate?api_key=${giphyKey}&s=${condition}`, { mode : 'cors'})
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            console.log(response);
            let giphyData = processGiphyData(response);
            console.log(giphyData);
            return giphyData;
        })
        .then(function(response) {
            document.querySelector("#gif").src = response.Gif;
        })
        .then(function(data) {
            console.log(data);
        });
}

document.querySelector(".city-button").addEventListener("click", function() {
    let location = document.querySelector(".input").value;
    getWeather(location);
});

document.addEventListener("DOMContentLoaded", function() {
    const moreBtn = document.getElementById("more-btn");
    const moreInfo = document.getElementById("more-info");

    moreBtn.addEventListener("click", () => {
        const isHidden = moreInfo.classList.contains("hidden");
        if (isHidden) {
            moreInfo.classList.remove("hidden");
            moreBtn.textContent = "Show Less";
        } 
        else {
            moreInfo.classList.add("hidden");
            moreBtn.textContent = "Show More";
        }
    })
});