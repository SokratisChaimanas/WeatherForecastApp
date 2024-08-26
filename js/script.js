$(function() {
    // Event listener for pressing "Enter" on the input field to fetch coordinates
    $('#cityInput').on('keypress', function(event) {
        if (event.key === 'Enter') {
            fetchCoordinates($(this).val().trim())
        }
    })

    // Event listener for clicking the submit button to fetch coordinates
    $('#sumbitBtn').on('click', function() {
        fetchCoordinates($('#cityInput').val().trim())
    })
})

const apiKey = '0d6559f2788e278b23fd01af785000b2'
/**
 * Fetches coordinates for the given city and initiates forecast retrieval.
 * @param {string} city - Name of the city.
 */
async function fetchCoordinates(city) {
    clearExistingData()

    if (!city) {
        return;
    }
    
    showElementByClassName('waiting-gif')

    city = encodeURIComponent(city.replace(/\s+/g, '+')) // Replace spaces with '+' for URL compatibility

    try {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
        
        if (!response.ok) {
            throw new Error('Error in fetching city data, response code: ' + response.statusText) 
        }

        const data = await response.json()

        if (data.length === 0) {
            throw new Error('City not found. Please try again.')
        }

        await fetchForecast(data)
    
    } catch (error) {
        handleStatusCodeError(error)
    }
}

/**
 * Fetches the weather forecast for the given city information.
 * @param {Object} cityInfo - The city information including latitude and longitude.
 */
async function fetchForecast(cityInfo) {
    const { lat, lon, name: cityName } = cityInfo[0];

    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)

        if (!response.ok) {
            throw new Error('Error in fetching forecast data, response code:' + response.statusText)
        }

        const data = await response.json()

        handleForecastResponse(data.list, cityName)

    } catch (error) {
        handleStatusCodeError(error)
    }
}

/**
 * Processes and displays the weather forecast data.
 * @param {Array} forecastList - List of forecast data objects.
 * @param {string} cityName - Name of the city.
 */
function handleForecastResponse(forecastList, cityName) {
    const dailyPredictions = getForecastPredictions(forecastList)   

    showCurrentForecast(dailyPredictions[0], cityName)
    showDailyPredictions(dailyPredictions)
}

/**
 * Extracts and organizes daily weather predictions from the forecast list.
 * @param {Array} forecastList - List of forecast data objects.
 * @returns {Array} - List of daily forecast objects.
 */
function getForecastPredictions(forecastList) {
    const dailyForecast = {}
    const dailyForecastList = []

    forecastList.forEach(forecast => {
        const day = getDayName(forecast.dt)

        if (!dailyForecast[day]) {
            dailyForecast[day] = populateDay(forecast)
            dailyForecastList.push(dailyForecast[day])
        } else {
            dailyForecast[day].minTemp = Math.round(Math.min(dailyForecast[day].minTemp, forecast.main.temp_min));
            dailyForecast[day].maxTemp = Math.round(Math.max(dailyForecast[day].maxTemp, forecast.main.temp_max));
        }

    })

    return dailyForecastList
}

/**
 * Populates a daily forecast object with relevant data.
 * @param {Object} forecastData - The forecast data for a specific time.
 * @returns {Object} - The daily forecast object.
 */
function populateDay(forecastData) {
    return {
        weather: forecastData.weather[0].main,
        icon: getIconImage(forecastData.weather[0].icon),
        minTemp: Math.round(forecastData.main.temp_min),
        maxTemp: Math.round(forecastData.main.temp_max),
        date: getDateString(forecastData.dt),
        day: getDayName(forecastData.dt),
        time: getTimeString(forecastData.dt),
        temp: Math.round(forecastData.main.temp),    
    }
}

/**
 * Displays the current weather forecast.
 * @param {Object} forecast - The forecast object for the current day.
 * @param {string} cityName - Name of the city.
 */
function showCurrentForecast(forecast, cityName) {
    const htmlToReturn = `
        <div class="location">     
            <h1 id="cityName">${cityName}</h1>      
            <p id="date">${forecast.date} <br>
                <span id="time">${forecast.time}</span> 
            </p>
        </div>
        <div class="current-weather">       
            <h2 id="temperature">${forecast.temp}°C</h2>
            <img src="${forecast.icon}" alt="weather icon" class="weather-icon">
            <p id="weatherDescription">${forecast.weather}</p>
        </div>`

    $('#weatherInfo').html(htmlToReturn)
    showElementByClassName('weather-info')
    hideElementByClassName('waiting-gif')
}

/**
 * Displays daily weather predictions.
 * @param {Array} dailyPredictions - List of daily forecast objects.
 */
function showDailyPredictions(dailyPredictions) {
    let htmlToReturn = ``
    dailyPredictions.forEach(forecast => {
        htmlToReturn += `
            <div class="forecast-item">
            <p class="day">${forecast.day}</p>
            <img src="${forecast.icon}" alt="weather icon" class="weather-icon">
            <p class="temp"><span id="tempMin">${forecast.minTemp}</span>-<span></span><span id="tempMax">${forecast.maxTemp}</span></p>
            </div>`
    })

    $('#dailyPredictions').html(htmlToReturn)
    showElementByClassName('daily-predictions')
    hideElementByClassName('waiting-gif')
}

/**
 * Converts the weather icon code into a full image URL.
 * @param {string} icon - The weather icon code.
 * @returns {string} - The full URL to the weather icon image.
 */
function getIconImage(icon) {
    icon = icon.replace(/n/g, 'd')
    return `https://openweathermap.org/img/wn/${icon}.png`;
}

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Converts a Unix timestamp into a day name.
 * @param {number} unixTimestamp - The Unix timestamp.
 * @returns {string} - The day name (e.g., "Monday").
 */
function getDayName(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000)
    const day = weekDays[date.getDay()]

    return day
}

/**
 * Converts a Unix timestamp into a formatted date string.
 * @param {number} unixTimestamp - The Unix timestamp.
 * @returns {string} - The formatted date string (e.g., "Monday 01/01/24").
 */
function getDateString(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000)

    const day = weekDays[date.getDay()]

    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const dayOfMonth = date.getDate().toString().padStart(2, '0');

    return `${day} ${dayOfMonth}/${month}/${year}`
}

/**
 * Converts a Unix timestamp into a formatted time string.
 * @param {number} unixTimestamp - The Unix timestamp.
 * @returns {string} - The formatted time string (e.g., "14:30").
 */
function getTimeString(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
}

/**
 * Hides any previously displayed data or messages.
 */
function clearExistingData() {
    hideElementByClassName('error-message')
    hideElementByClassName('weather-info')
    hideElementByClassName('daily-predictions')
}

/**
 * Shows an HTML element by removing the 'hidden' class.
 * @param {string} className - The class name of the element to show.
 */
function showElementByClassName(className) {
    $('.' + className).removeClass('hidden')
}

/**
 * Hides an HTML element by adding the 'hidden' class.
 * @param {string} className - The class name of the element to hide.
 */
function hideElementByClassName(className) {
    $('.' + className).addClass('hidden')
}

/**
 * Handles and displays errors that occur during data fetching.
 * @param {Error} error - The error object containing the message.
 */
function handleStatusCodeError(error) {
    showErrorById('statusCodeError')
    $('#statusCodeError').html(error.message)
}

/**
 * Displays an error message by ID and hides the loading GIF.
 * @param {string} errorId - The ID of the error message element.
 */
function showErrorById(errorId) {
    hideElementByClassName('waiting-gif')
    $('#' + errorId).removeClass('hidden')
}
