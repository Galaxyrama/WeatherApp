import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;

export const fetchCurrentWeatherOfUser = async(latitude, longitude, unit) => {
    const API_URL_CALL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${API_KEY}`;

    try {
        const { data } = await axios.get(API_URL_CALL); 
        return data;
    }
    catch (error) {
        console.log(error);
    }
}

export const fetchWeatherForecast = async(latitude, longitude, unit) => {
    const API_URL_CALL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${API_KEY}`;

    try {
        const { data } = await axios.get(API_URL_CALL);
        return data;
    }
    catch (error) {
        console.log(error);
    }
}

export const fetchCurrentWeatherOfCity = async(city, unit) => {
    if(city.trim().length !== 0){
        const API_URL_CALL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${API_KEY}`;

        try {
            const { data } = await axios.get(API_URL_CALL);
            return data;
        } catch (error) {
            console.log(error);
        }
    }
}

export const fetchWeatherForecastOFCity = async(city, unit) => {
    if(city.trim().length !== 0){
        const API_URL_CALL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${API_KEY}`;

        try {
            const { data } = await axios.get(API_URL_CALL);
            return data;
        }
        catch (error) {
            console.log(error);
        }
    }
}