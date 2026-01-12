function getWeatherDescription(code) {
    const descriptions = {
        0: 'Céu limpo ☀️',
        1: 'Parcialmente limpo 🌤️',
        2: 'Parcialmente nublado ⛅',
        3: 'Nublado ☁️',
        45: 'Neblina 🌫️',
        48: 'Neblina com geada 🌫️',
        51: 'Garoa leve 🌧️',
        53: 'Garoa moderada 🌧️',
        55: 'Garoa intensa 🌧️',
        61: 'Chuva leve 🌧️',
        63: 'Chuva moderada 🌧️',
        65: 'Chuva forte 🌧️',
        71: 'Neve leve ❄️',
        73: 'Neve moderada ❄️',
        75: 'Neve forte ❄️',
        95: 'Tempestade ⛈️'
    };
    return descriptions[code] || 'Condição desconhecida';
}

function buildGeoUrl(city) {
    return `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt`;
}

function buildWeatherUrl(latitude, longitude) {
    return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;
}

function formatTemperature(temp) {
    return Math.round(temp);
}

function validateCity(city) {
    if (!city || typeof city !== 'string') return false;
    return city.trim().length > 0;
}

function parseGeoResponse(geoData) {
    if (!geoData.results || geoData.results.length === 0) {
        return null;
    }
    const { latitude, longitude, name, country } = geoData.results[0];
    return { latitude, longitude, name, country };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getWeatherDescription,
        buildGeoUrl,
        buildWeatherUrl,
        formatTemperature,
        validateCity,
        parseGeoResponse
    };
}
