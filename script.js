const apiKey = '1fca1085d139a85b345015455592e895';  // Your API key

// Function to fetch weather data
async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

// Function to update the DOM with weather data
function updateWeather(weatherData) {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date = new Date();

    // Update day and date
    document.querySelector('.day').innerHTML = weekdays[date.getDay()];
    document.querySelector('.date2').innerHTML = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
        

    // Update temperature and other weather details
    if (weatherData) {
        console.log(weatherData);
        let temperatureCelsius = weatherData.main.temp - 273.15;
        document.querySelector('.temp').innerHTML = `${temperatureCelsius.toFixed(2)}°C`;
        document.querySelector('.degree').innerHTML = `${temperatureCelsius.toFixed(2)}°C`;
        document.querySelector('.condition').innerHTML = weatherData.weather[0].main;
        document.querySelector('.humid').innerHTML = weatherData.main.humidity + '%';
        document.querySelector('.w-speed').innerHTML = `${weatherData.wind.speed} m/s`;
        let cond= weatherData.weather[0].main;
        let ele=document.querySelector('.condition-img');
        console.log(cond);
        if (ele) {  // Check if the element exists
            if (cond == 'Rain') {
                ele.src = 'rain.png';
            } else if (cond == 'Clouds') {
                ele.src = 'cloudy.png';
            } else if (cond == 'Partly Clouds') {
                ele.src = 'partly.png';
            } else {
                ele.src = 'sun.png';
            }
        } else {
            console.error('No weather element found');
        }
        
}
}

// Function to get city name from coordinates using OpenWeatherMap Geocoding API
async function findGeo(lat, lon, limit = 1) {
    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${apiKey}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        return result;

    } catch (error) {
        console.error('Error fetching geolocation data:', error);
        return null;
    }
}

// Function to get the city name from coordinates
async function getCityFromCoordinates(lat, lon) {
    const geoData = await findGeo(lat, lon);

    if (geoData && geoData.length > 0) {
        const city = geoData[0].name;
        console.log('City:', city);
        return city;
    } else {
        console.log('City not found');
        return null;
    }
}

// Event listener for the button click to fetch weather by city name
document.querySelector('button').addEventListener('click', async (evnt) => {
    evnt.preventDefault();

    // Get the input element and retrieve the value
    let inputElement = document.querySelector('input');
    let inputType = inputElement.value;

    // Display the city name
    
    // Fetch the weather data and update the DOM
    const weatherData = await fetchWeather(inputType);
    if(weatherData){
        document.querySelector('.city').innerHTML = inputType;
        updateWeather(weatherData);
    }
    else{
        alert('Place Not Found!')
    }
});

// Example: Get city from coordinates and fetch weather
async function fetchWeatherByLocation(lat, lon) {
    const city = await getCityFromCoordinates(lat, lon);

    if (city) {
        document.querySelector('.city').innerHTML = city;
        const weatherData = await fetchWeather(city);
        updateWeather(weatherData);
    }
}

// Example usage with coordinates (New Delhi, India)
fetchWeatherByLocation(28.6139, 77.2090);
