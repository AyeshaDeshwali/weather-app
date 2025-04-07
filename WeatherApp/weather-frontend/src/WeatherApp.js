import React, { useState, useEffect } from "react";
import "./styles/WeatherApp.css";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import { getWeatherByCoords, getWeatherByCity, getWeeklyForecast } from "./api";

const WeatherApp = ({ onAuthSuccess }) => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(new Date());
    };
    const interval = setInterval(updateClock, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // const getBackgroundClass = () => {
  //   const hours = currentTime.getHours();
  //   if (hours >= 6 && hours < 18) {
  //     return "day-bg"; // Din ka background
  //   } else {
  //     return "night-bg"; // Raat ka background
  //   }
  // };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await getWeatherByCoords(
            position.coords.latitude,
            position.coords.longitude
          );
          setWeather(data);
          const forecastData = await getWeeklyForecast(
            data.coord.lat,
            data.coord.lon
          );
          setForecast(
            forecastData.list.filter((item) => item.dt_txt.includes("12:00:00"))
          );
        } catch (error) {
          setError("Error fetching weather data.");
        } finally {
          setLoading(false);
        }
        console.log(position.coords, "hi");
      },
      () => {
        setError("Please allow location access or enter a city manually.");
        setLoading(false);
      }
    );
  }, []);

  const handleCitySearch = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const data = await getWeatherByCity(city);
      if (data.cod === 200) {
        setWeather(data);
        setCity("");
        setError("");

        const forecastData = await getWeeklyForecast(
          data.coord.lat,
          data.coord.lon
        );
        const filteredForecast = forecastData.list.filter((item) =>
          item.dt_txt.includes("12:00:00")
        );
        setForecast(filteredForecast);
      } else {
        setError("City not found!");
      }
    } catch (error) {
      setError("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      onAuthSuccess(null);
    }
  };

  return (
    <div className="container">
      <h1>🌤 Weather App</h1>

      <div className="input-logout-wrapper">
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button className="get-weather-btn" onClick={handleCitySearch}>
            Get Weather
          </button>
          <button className="search-icon-btn" onClick={handleCitySearch}>
            <i className="fas fa-search"></i>
          </button>
        </div>

        {/* Logout Buttons */}
        <div className="logout-container">
          <button className="logout-btn logout-text-btn" onClick={handleLogout}>
            Logout
          </button>
          <button className="logout-btn logout-icon-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>

      {error && (
        <p
          className={`error ${
            error === "City not found!" ? "error-red" : "error-default"
          }`}
        >
          <i className="fas fa-map-marker-alt"></i> {error}
        </p>
      )}

      {loading ? (
        <span className="loader"></span>
      ) : (
        <div>
          {weather && weather.main && (
            <WeatherCard
              weather={weather}
              currentTime={currentTime.toLocaleTimeString()}
            />
          )}
          {forecast && forecast.length > 0 && (
            <ForecastCard forecast={forecast} />
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
