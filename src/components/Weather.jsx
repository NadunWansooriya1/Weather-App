import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import uv_icon from '../assets/uv.png';

const Weather = () => {
    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    };

    const fetchSuggestions = async (query) => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }
        try {
            const url = `https://api.weatherapi.com/geo/1.0/direct?q=${query}&limit=5&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();
            setSuggestions(data.map(city => `${city.name}`));
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        fetchSuggestions(value);
    };

    const handleSuggestionClick = (suggestion) => {
        const city = suggestion.split(',')[0].trim();
        setInputValue(suggestion);
        setSuggestions([]);
        search(city);
    };

    const search = async (city) => {
        if (city === "") {
            alert("Enter City Name");
            return;
        }
        try {
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_APP_ID}`;
            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();
            if (weatherData.cod === "404") {
                alert("City not found");
                return;
            }

            const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${import.meta.env.VITE_APP_ID}`;
            const uvResponse = await fetch(uvUrl);
            const uvData = await uvResponse.json();

            const icon = allIcons[weatherData.weather[0].icon] || clear_icon;
            setWeatherData({
                humidity: weatherData.main.humidity,
                windSpeed: weatherData.wind.speed,
                temperature: Math.floor(weatherData.main.temp - 273.15),
                location: weatherData.name,
                icon: icon,
                uvIndex: uvData.value || 'N/A',
            });
        } catch (error) {
            console.error("Error fetching weather data:", error);
            alert("Error fetching weather or UV data");
        }
    };

    useEffect(() => {
        search("Colombo");
    }, []);

    if (!weatherData) {
        return <div>Loading...</div>;
    }

    return (
        <div className='weather'>
            <div className='weather-card'>
                <div className='search-bar'>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder='search'
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <img src={search_icon} alt="search" onClick={() => search(inputValue.split(',')[0].trim())} />
                    {suggestions.length > 0 && (
                        <ul className='suggestions'>
                            {suggestions.map((suggestion, index) => (
                                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <img src={weatherData.icon} alt="weather icon" className='weather-icon' />
                <p className='temperature'>{weatherData.temperature}°C</p>
                <p className='location'>{weatherData.location}</p>
                <div className='weather-data'>
                    <div className="col">
                        <img src={humidity_icon} alt="humidity" />
                        <div>
                            <p>{weatherData.humidity}%</p>
                            <span>Humidity</span>
                        </div>
                    </div>
                    <div className="col">
                        <img src={wind_icon} alt="wind" />
                        <div>
                            <p>{weatherData.windSpeed} km/h</p>
                            <span>Wind Speed</span>
                        </div>
                    </div>
                    <div className="col">
                        <img src={uv_icon} alt="uv index" />
                        <div>
                            <p>{weatherData.uvIndex}</p>
                            <span>UV Index</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Weather;