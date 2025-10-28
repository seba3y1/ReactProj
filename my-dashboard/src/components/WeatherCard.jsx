import { useState } from "react";

const API_KEY = "995a800af14614c4156983397f14ffea";

export default function WeatherCard() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("City not found");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
    <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
       Weather Widget
    </h2>

    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <input
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        placeholder="Enter a city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button
        onClick={fetchWeather}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] shadow-sm"
      >
        Search
      </button>
    </div>

    {loading && (
      <p className="text-sm text-gray-500 animate-pulse">Fetching weather...</p>
    )}
    {error && <p className="text-red-600 text-sm">{error}</p>}

    {data && (
      <div className="mt-4 text-center">
        <p className="text-xl font-bold text-gray-800 mb-1">{data.name}</p>
        <p className="capitalize text-gray-600 mb-2">
          {data.weather[0].description}
        </p>

        <div className="flex justify-center items-center gap-3 mb-2">
          <img
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
            alt="icon"
            className="w-16 h-16 animate-bounce-slow"
          />
          <div className="text-gray-700">
            <p className="text-2xl font-semibold">
               {Math.round(data.main.temp)}°C
            </p>
            <p className="text-sm text-gray-500"> {data.main.humidity}% Humidity</p>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          <p>Wind: {data.wind.speed} m/s</p>
          <p>Feels like: {Math.round(data.main.feels_like)}°C</p>
        </div>
      </div>
    )}
  </div>
);
}
