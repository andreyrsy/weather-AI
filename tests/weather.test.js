const {
    getWeatherDescription,
    buildGeoUrl,
    buildWeatherUrl,
    formatTemperature,
    validateCity,
    parseGeoResponse
} = require('../assets/js/weather.js');

describe('getWeatherDescription', () => {
    test('deve retornar "Céu limpo ☀️" para código 0', () => {
        expect(getWeatherDescription(0)).toBe('Céu limpo ☀️');
    });

    test('deve retornar "Nublado ☁️" para código 3', () => {
        expect(getWeatherDescription(3)).toBe('Nublado ☁️');
    });

    test('deve retornar "Chuva forte 🌧️" para código 65', () => {
        expect(getWeatherDescription(65)).toBe('Chuva forte 🌧️');
    });

    test('deve retornar "Tempestade ⛈️" para código 95', () => {
        expect(getWeatherDescription(95)).toBe('Tempestade ⛈️');
    });

    test('deve retornar "Condição desconhecida" para código inválido', () => {
        expect(getWeatherDescription(999)).toBe('Condição desconhecida');
    });

    test('deve retornar "Condição desconhecida" para undefined', () => {
        expect(getWeatherDescription(undefined)).toBe('Condição desconhecida');
    });
});

describe('buildGeoUrl', () => {
    test('deve construir URL correta para cidade simples', () => {
        const url = buildGeoUrl('London');
        expect(url).toBe('https://geocoding-api.open-meteo.com/v1/search?name=London&count=1&language=pt');
    });

    test('deve codificar caracteres especiais na cidade', () => {
        const url = buildGeoUrl('São Paulo');
        expect(url).toContain('S%C3%A3o%20Paulo');
    });

    test('deve codificar espaços corretamente', () => {
        const url = buildGeoUrl('New York');
        expect(url).toContain('New%20York');
    });
});

describe('buildWeatherUrl', () => {
    test('deve construir URL com latitude e longitude corretas', () => {
        const url = buildWeatherUrl(-23.5505, -46.6333);
        expect(url).toContain('latitude=-23.5505');
        expect(url).toContain('longitude=-46.6333');
    });

    test('deve incluir parâmetros de clima atuais', () => {
        const url = buildWeatherUrl(0, 0);
        expect(url).toContain('current=temperature_2m');
        expect(url).toContain('relative_humidity_2m');
        expect(url).toContain('wind_speed_10m');
        expect(url).toContain('weather_code');
    });
});

describe('formatTemperature', () => {
    test('deve arredondar temperatura para baixo', () => {
        expect(formatTemperature(25.4)).toBe(25);
    });

    test('deve arredondar temperatura para cima', () => {
        expect(formatTemperature(25.6)).toBe(26);
    });

    test('deve retornar número inteiro sem alteração', () => {
        expect(formatTemperature(20)).toBe(20);
    });

    test('deve lidar com temperaturas negativas', () => {
        expect(formatTemperature(-5.3)).toBe(-5);
    });
});

describe('validateCity', () => {
    test('deve retornar true para cidade válida', () => {
        expect(validateCity('São Paulo')).toBe(true);
    });

    test('deve retornar false para string vazia', () => {
        expect(validateCity('')).toBe(false);
    });

    test('deve retornar false para string com apenas espaços', () => {
        expect(validateCity('   ')).toBe(false);
    });

    test('deve retornar false para null', () => {
        expect(validateCity(null)).toBe(false);
    });

    test('deve retornar false para undefined', () => {
        expect(validateCity(undefined)).toBe(false);
    });

    test('deve retornar false para número', () => {
        expect(validateCity(123)).toBe(false);
    });
});

describe('parseGeoResponse', () => {
    test('deve extrair dados corretos de resposta válida', () => {
        const geoData = {
            results: [{
                latitude: -23.5505,
                longitude: -46.6333,
                name: 'São Paulo',
                country: 'Brasil'
            }]
        };
        const result = parseGeoResponse(geoData);
        expect(result).toEqual({
            latitude: -23.5505,
            longitude: -46.6333,
            name: 'São Paulo',
            country: 'Brasil'
        });
    });

    test('deve retornar null para resposta sem resultados', () => {
        const geoData = { results: [] };
        expect(parseGeoResponse(geoData)).toBeNull();
    });

    test('deve retornar null para resposta sem propriedade results', () => {
        const geoData = {};
        expect(parseGeoResponse(geoData)).toBeNull();
    });

    test('deve retornar null para results undefined', () => {
        const geoData = { results: undefined };
        expect(parseGeoResponse(geoData)).toBeNull();
    });
});
