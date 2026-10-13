import React, { useState, useEffect } from 'react';
import { Sun, CloudRain, Wind, Thermometer, MapPin, Compass, Navigation, RefreshCw } from 'lucide-react';

export default function WeatherWidget({ district }) {
  const [weather, setWeather] = useState({
    temp: '--',
    humidity: '--',
    wind: '--',
    condition: 'Detecting location...',
    locationLabel: district || 'Your Area',
    isGps: false,
    loading: true
  });

  useEffect(() => {
    detectLocationAndFetchWeather();
  }, [district]);

  // Primary function: Try HTML5 GPS Geolocation first
  const detectLocationAndFetchWeather = () => {
    setWeather((prev) => ({ ...prev, loading: true }));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success: Farmer allowed GPS access
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchWeatherByCoords(lat, lon, 'Live GPS Position', true);
        },
        (error) => {
          // Fallback: Permission denied or unavailable -> Use District Name
          console.warn('GPS access denied or unavailable, using district fallback:', error.message);
          fetchWeatherByDistrict(district || 'Basti');
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      // Browser doesn't support Geolocation -> Use District
      fetchWeatherByDistrict(district || 'Basti');
    }
  };

  // Fetch weather using exact latitude and longitude
  const fetchWeatherByCoords = async (lat, lon, labelName, isGps = false) => {
    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
      );
      const weatherData = await weatherRes.json();

      if (weatherData.current) {
        const code = weatherData.current.weather_code;
        let conditionText = 'Clear Sky';
        if (code > 0 && code < 4) conditionText = 'Partly Cloudy';
        if (code >= 50 && code <= 67) conditionText = 'Rain Showers';
        if (code >= 95) conditionText = 'Thunderstorm';

        setWeather({
          temp: Math.round(weatherData.current.temperature_2m),
          humidity: weatherData.current.relative_humidity_2m,
          wind: Math.round(weatherData.current.wind_speed_10m),
          condition: conditionText,
          locationLabel: labelName,
          isGps,
          loading: false
        });
      }
    } catch (err) {
      console.error('Weather error:', err);
      setWeather({ temp: '--', humidity: '--', wind: '--', condition: 'Offline Mode', locationLabel: district || 'Area', isGps: false, loading: false });
    }
  };

  // Fallback: Convert District Name to Coordinates via Geocoding
  const fetchWeatherByDistrict = async (locationName) => {
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationName)}&count=1`
      );
      const geoData = await geoRes.json();

      let lat = 26.7922; // Default fallback (Basti, UP)
      let lon = 82.7454;

      if (geoData.results && geoData.results.length > 0) {
        lat = geoData.results[0].latitude;
        lon = geoData.results[0].longitude;
      }

      await fetchWeatherByCoords(lat, lon, `${locationName} (District)`, false);
    } catch (err) {
      console.error('Geocoding error:', err);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 border border-emerald-500/20 p-6 rounded-3xl shadow-xl text-white">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
              weather.isGps 
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300' 
                : 'bg-amber-500/20 border-amber-400/40 text-amber-300'
            }`}>
              {weather.isGps ? <Navigation className="w-3.5 h-3.5 animate-pulse text-emerald-400" /> : <MapPin className="w-3.5 h-3.5" />}
              {weather.locationLabel}
            </span>

            <button
              onClick={detectLocationAndFetchWeather}
              title="Refresh Location Weather"
              className="p-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-full text-slate-300 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${weather.loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight">{weather.condition}</h2>
          <p className="text-emerald-200/70 text-xs mt-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" /> Real-time localized agricultural advisory
          </p>
        </div>

        {/* Metric Pills */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          <div className="bg-slate-900/60 border border-white/10 backdrop-blur-md px-4 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[90px]">
            <Thermometer className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-xl font-black">{weather.temp}°C</span>
            <span className="text-[10px] text-slate-400 font-medium uppercase">Temp</span>
          </div>

          <div className="bg-slate-900/60 border border-white/10 backdrop-blur-md px-4 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[90px]">
            <CloudRain className="w-5 h-5 text-sky-400 mb-1" />
            <span className="text-xl font-black">{weather.humidity}%</span>
            <span className="text-[10px] text-slate-400 font-medium uppercase">Humidity</span>
          </div>

          <div className="bg-slate-900/60 border border-white/10 backdrop-blur-md px-4 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[90px]">
            <Wind className="w-5 h-5 text-teal-300 mb-1" />
            <span className="text-xl font-black">{weather.wind} <span className="text-xs font-normal">km/h</span></span>
            <span className="text-[10px] text-slate-400 font-medium uppercase">Wind</span>
          </div>
        </div>
      </div>
    </div>
  );
}