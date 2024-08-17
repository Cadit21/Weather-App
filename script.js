const apiKey = '1fca1085d139a85b345015455592e895';  // Your API key




// Function to fetch weather data
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
async function fetchWeather2(city) {

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        return result;
        

    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}
fetchWeather2('Delhi');
// Assuming fetchWeather2 is an async function that fetches weather data
async function updatenextdaysWeather(city) {
    // Fetch weather data
    const next = await fetchWeather2(city);

    // Initialize variables
    let currentDay = new Date(next.list[0].dt_txt).getDate();
    let tempSum = 0;
    let count = 0;
    const nextFiveDaysTemps = [];
    const nextFiveDays=[];
    const cond=[];
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Iterate through the weather data
    next.list.forEach(item => {
        const itemDate = new Date(item.dt_txt);
        const itemDay = itemDate.getDate();
        const day= itemDate.getDay();
        const val= item.main.temp;
        const cond2= item.weather[0].main;
        
        

        if (itemDay !== currentDay) {
            // Calculate average temperature for the previous day
            nextFiveDaysTemps.push(val);
            nextFiveDays.push(itemDate.getDay());
            cond.push(cond2)
            currentDay = itemDay;
           
            
           
        }

        
    });

    // Add the last day's average temperature
    

    // Get the first 5 days of temperature
    const result = nextFiveDaysTemps.slice(0, 5);
    const result2= nextFiveDays.slice(0,5);
    const condition= cond.slice(0,5);

    condition.forEach((con,idx)=>{

        let ele = document.querySelector(`.box .img${idx + 1}`);
        console.log(con);
        if (ele) {
            if (con === 'Rain') {
                ele.src = 'rain.png';
            } else if (con === 'Clouds') {
                ele.src = 'cloudy.png';
            } else if (con === 'Partly Cloudy') {
                ele.src = 'partly.png';
            } else {
                ele.src = 'sun.png';
            }
        } else {
            console.error('No weather element found');
        }
        

    });

    result2.forEach((temp, index) => {
        let ele = document.querySelector(`.box .day${index + 1}`);
        if (ele) {
            ele.innerHTML = weekdays[temp];
        }
        });

    // Update the DOM elements with the temperatures
    result.forEach((temp, index) => {
        let ele = document.querySelector(`.box .temp${index + 1}`);
        let img= document.querySelector(`.box .img${index + 1}`);
        
        if (ele) {
            ele.textContent = `${(temp-273).toFixed(2)}°C`;
            
            
        }
    });
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
        let cond = weatherData.weather[0].main;
        let ele = document.querySelector('.condition-img');
        console.log(cond);
        if (ele) {  // Check if the element exists
            if (cond == 'Rain') {
                ele.src = 'rain.png';
            } else if (cond == 'Clouds') {
                ele.src = 'cloudy.png';
            } else if (cond == 'Partly Cloudy') {
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
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${apiKey}`;

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

    // Fetch the weather data and update the DOM
    const weatherData = await fetchWeather(inputType);
    if (weatherData) {
        document.querySelector('.city').innerHTML = inputType;
        updateWeather(weatherData);
        updatenextdaysWeather(inputType);
    } else {
        alert('Place Not Found!');
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

// Ensure fetchWeatherByLocation is called after the DOM is fully loaded
window.onload = () => {
    fetchWeatherByLocation(28.6139, 77.2090);
    updatenextdaysWeather('Delhi') // Example usage with coordinates (New Delhi, India)
};
