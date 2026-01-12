const form = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const weatherResult = document.getElementById('weather-result');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    
    if (!city) return;
    
    await fetchWeather(city);
});

async function fetchWeather(city) {
    weatherResult.innerHTML = '<p class="loading">Buscando dados...</p>';
    errorMessage.hidden = true;

    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            showError('Cidade não encontrada. Tente novamente.');
            return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        displayWeather(name, country, weatherData.current);

    } catch (error) {
        showError('Erro ao buscar dados. Verifique sua conexão.');
    }
}

function displayWeather(city, country, current) {
    const description = getWeatherDescription(current.weather_code);
    
    weatherResult.innerHTML = `
        <div class="weather-card">
            <p class="city-name">${city}</p>
            <p class="country">${country}</p>
            <p class="temperature">${Math.round(current.temperature_2m)}°C</p>
            <p class="description">${description}</p>
            <div class="weather-details">
                <div class="detail-item">
                    <p class="label">Umidade</p>
                    <p class="value">${current.relative_humidity_2m}%</p>
                </div>
                <div class="detail-item">
                    <p class="label">Vento</p>
                    <p class="value">${current.wind_speed_10m} km/h</p>
                </div>
            </div>
        </div>
    `;
}

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

function showError(message) {
    weatherResult.innerHTML = '';
    errorMessage.innerHTML = `<p>${message}</p>`;
    errorMessage.hidden = false;
}
