# Weather Forecast App

## Overview

This is a simple weather application that provides a 5-day weather forecast for a city. Users can search for a city by entering its name and view the current weather along with daily predictions. The app uses the OpenWeatherMap API to fetch weather data, and it is built with HTML, CSS, and JavaScript.

## Features

- **City Search**: Enter a city name to get the current weather and a 5-day forecast.
- **Current Weather**: Displays temperature, weather condition, and an icon representing the current weather.
- **Daily Forecast**: Shows the minimum and maximum temperatures for the next 5 days.
- **Responsive Design**: The app is designed to be responsive and works on various screen sizes.
  
## Technologies Used

- **HTML5**
- **CSS3**
- **JavaScript (ES6)**
- **jQuery**
- **OpenWeatherMap API**

## Getting Started

### Prerequisites

To run this project locally, you need a basic understanding of HTML, CSS, and JavaScript. Additionally, ensure you have an API key from [OpenWeatherMap](https://openweathermap.org/api).


### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/SokratisChaimanas/WeatherForecastApp.git
    cd WeatherForecastApp
    ```

2. **Configure API Key**:
   - Open the `script.js` file.
   - Replace the `apiKey` variable with your OpenWeatherMap API key.
   - Example:
     ```javascript
     const apiKey = 'your_api_key_here';
     ```

3. **Run the application**:
   - Open the `index.html` file in your web browser.

### Usage

- **Search for a city**: Type the city name into the input field and press "Enter" or click the "Submit" button to view the weather data.
- **View weather details**: The app will display the current temperature, weather condition, and a 5-day forecast for the selected city.

## Project Structure

```bash
simple-weather-app/
│
├── index.html         # The main HTML file
├── style.css          # The CSS file for styling
├── script.js          # The JavaScript file containing the app logic
└── README.md          # Project documentation
