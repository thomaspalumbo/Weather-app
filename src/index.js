const cityNotFound = document.querySelector('.error');
const cities = document.querySelector('.card-weather__city');
const icons = document.querySelector('.card-weather__icon');
const descriptions = document.querySelector('.card-weather__description');
const temperature =  document.querySelector('.card-weather__temp');
const humidityLevel = document.querySelector('.card-weather__humidity');
const windSpeed = document.querySelector('.card-weather__wind');
const searchBar = document.querySelector('.card-search__bar');
const searchButton = document.querySelector('.card-search__button');


const getData = async(city) => {
    const apiKey = "5406cf76d0a2836eef01dad426a9b0f1";

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=en&appid=${apiKey}`);
        if(response.status === 200) {
            const data = await response.json();
            displayWeather(data);
        }
        else if(response.status === 404) {
            cities.innerText = ``;
            icons.src =  ``;
            descriptions.innerText = ``;
            temperature.innerText = ``;
            humidityLevel.innerText = ``;
            windSpeed.innerText = ``;
            document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?404error')`
            cityNotFound.innerText = 'City not found';
        }
        
    }
    catch(err) {
        console.error(err);
    }
}
const reverseGeocode = async (latitude, longitude) => {
        const api_key = '96b7af5fa85a46b9b78a6750393c620b';
        const api_url = 'https://api.opencagedata.com/geocode/v1/json'
      
        const request_url = `${api_url}?key=${api_key}&q=${(encodeURIComponent(latitude + ',' + longitude))}&pretty=1&no_annotations=1`;
        const response = await fetch(request_url);

        if(response.status === 200) {
            const data = await response.json();
            getData(data.results[0].components.city);
        }
        else {
            console.error('Error')
        }
}

const getLocation = () => {

    const success = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        reverseGeocode(latitude, longitude);
    }

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, console.error);
    }
    else {
        getData('London')
    }
}


function displayWeather(data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    cities.innerText = name;
    icons.src =  `http://openweathermap.org/img/wn/${icon}.png`;
    descriptions.innerText = `${description}`;
    temperature.innerText = `${temp.toFixed(0)}°C`;
    humidityLevel.innerText = `Humidity: ${humidity}%`;
    windSpeed.innerText = `Wind speed: ${speed} km/h`;
    document.querySelector('.card-weather').classList.remove('loading');


    if(window.screen.width > 1000) {
        document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${name}')`;
    }
    else{
        document.body.style.backgroundImage = `url('https://source.unsplash.com/800x900/?${name}')`;
    }
}

function searchBtn() {
    getData(searchBar.value);
}

searchButton.addEventListener('click', searchBtn);

searchBar.addEventListener('keyup', e => {
    if(e.key == 'Enter') {
        searchBtn()
    } 
})


getLocation();

