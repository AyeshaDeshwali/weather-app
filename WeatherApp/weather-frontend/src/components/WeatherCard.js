import React, { useState, useEffect } from "react";
import "../styles/WeatherCard.css"; // ✅ CSS Import

const WeatherCard = ({ weather }) => {
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [weatherClass, setWeatherClass] = useState("default-bg");
  const [currentTime, setCurrentTime] = useState("");

  if (!weather || !weather.main || !weather.weather) return null;

  // ✅ Temperature Conversion Function
  const convertTemp = (tempC) => (isFahrenheit ? (tempC * 9) / 5 + 32 : tempC);

  useEffect(() => {
    if (!weather.weather || weather.weather.length === 0) return;

    const mainWeather = weather.weather[0].main;
    const hours = new Date().getHours();
    const isDay = hours >= 6 && hours < 18;

    let baseClass = "default-bg";

    if (mainWeather.includes("Clear")) baseClass = "clear";
    else if (mainWeather.includes("Clouds")) baseClass = "cloudy";
    else if (mainWeather.includes("Rain")) baseClass = "rain";
    else if (mainWeather.includes("Snow")) baseClass = "snow";
    else if (mainWeather.includes("Thunderstorm")) baseClass = "thunderstorm";
    else if (["Mist", "Haze", "Fog"].includes(mainWeather)) baseClass = "haze";
    else baseClass = "default-bg";

    const finalClass = `${isDay ? "day" : "night"}-${baseClass}`;

    setWeatherClass(finalClass);
  }, [weather]);

  // 🕒 Time Update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;

      setCurrentTime(`${formattedHours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  // 📅 Date Formatter
  const formatDate = () => {
    const now = new Date();
    const options = { month: "short", day: "numeric" };
    const formattedDate = now.toLocaleDateString("en-US", options);
    const weekday = now.toLocaleDateString("en-US", { weekday: "short" });

    return `${formattedDate} ${weekday}`;
  };

  // 🌅 Day/Night Background
  const getTimeBasedClass = () => {
    const hours = new Date().getHours();
    return hours >= 6 && hours < 18 ? "day-bg" : "night-bg";
  };

  return (
    <div className={`weather-card ${getTimeBasedClass()} ${weatherClass}`}>
      <div className="weather-header">
        <p>Current Weather | {currentTime}</p>

        <div className="toggle" onClick={() => setIsFahrenheit(!isFahrenheit)}>
          <span className={isFahrenheit ? "active" : ""}>°F</span>
          <div className={`toggle-btn ${isFahrenheit ? "toggled" : ""}`}></div>
        </div>
      </div>

      <div className="weather-content">
        <div className="weather-left">
          <h2 className="location">{weather.name}</h2>

          <div className="temp-icon">
            {weather.weather[0].icon && (
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="weather-icon"
              />
            )}
            <p className="temp">
              {Math.round(convertTemp(weather.main.temp))}°
              {isFahrenheit ? "F" : "C"}
            </p>
          </div>

          <div className="date">
            <p>
              {formatDate()} | {Math.round(convertTemp(weather.main.temp_max))}°
              /{Math.round(convertTemp(weather.main.temp_min))}°
            </p>
          </div>

          <p className="description">{weather.weather[0].description}</p>
        </div>

        <div className="weather-right">
          <p className="feels-like">
            Feels like {Math.round(convertTemp(weather.main.feels_like))}°
          </p>
          <div className="temp-range">
            <span>🔺 {Math.round(convertTemp(weather.main.temp_max))}°</span>
            <span>🔻 {Math.round(convertTemp(weather.main.temp_min))}°</span>
          </div>
          <div className="extra-details">
            <p>
              💧 Humidity <span>{weather.main.humidity}%</span>
            </p>
            <p>
              💨 Wind <span>{weather.wind.speed} kph</span>
            </p>
            <p>
              🌡️ Pressure <span>{weather.main.pressure} hPa</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
