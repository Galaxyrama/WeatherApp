import { useEffect, useState } from "react";
import {
  fetchCurrentWeatherOfCity,
  fetchCurrentWeatherOfUser,
  fetchWeatherForecast,
} from "./services/weatherAPIService";

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [searchCity, setSearchCity] = useState();
  const [weatherIcon, setWeatherIcon] = useState("Default.png");
  const [weatherUnit, setWeatherUnit] = useState("metric");

  const [locationLat, setLocationLat] = useState(0);
  const [locationLon, setLocationLon] = useState(0);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocationLat(position.coords.latitude);
        setLocationLon(position.coords.longitude);
      });
    }
  }, []);

  useEffect(
    () => {
      const getWeatherData = async () => {
        try {
          const postData = await fetchCurrentWeatherOfUser(
            locationLat,
            locationLon,
            weatherUnit
          );

          setWeatherData(postData);
          setWeatherIcon(`${postData?.weather[0]?.main} - Black.png`);
        } catch (error) {
          console.log(error);
        }
      };

      const getForecastData = async () => {
        try {
          const postData = await fetchWeatherForecast(
            locationLat,
            locationLon,
            weatherUnit
          );
          setWeatherForecast(postData);
        } catch (error) {
          console.log(error);
        }
      };

      getWeatherData();
      getForecastData();
    },
    [locationLat, locationLon, weatherUnit]
  );

  useEffect(() => {
    const getCityCoords = async () => {
      try {
        const postData = await fetchCurrentWeatherOfCity(
          searchCity,
          weatherUnit
        );

        if (postData) {
          setLocationLat(postData.coord?.lat);
          setLocationLon(postData.coord?.lon);
          return;
        }

        alert("City not found!");
      } catch (error) {
        console.log(error);
      }
    };

    getCityCoords();
  }, [searchCity]);

  const handleSearchCity = (event) => {
    setSearchCity(event.target.value);
  };

  const getDayFromTimeStamp = (dt, timezoneOffset) =>
    new Date((dt + timezoneOffset) * 1000).toLocaleDateString("en-us", {
      weekday: "long",
      timeZone: "UTC",
    });

  const handleUpperCaseLetters = (word) =>
    word
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const handleUnitChange = (unit) => {
    setWeatherUnit(unit);
  };

  return (
    <>
      <div className="sm:mx-10">
        <div className="flex justify-between my-5 mx-2">
          <div className="flex border border-gray-300 rounded-full overflow-hidden">
            <button
              className={`px-4 py-2 font-semibold cursor-pointer ${
                weatherUnit === "metric"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500 hover:bg-gray-100"
              }`}
              onClick={() => handleUnitChange("metric")}
            >
              °C
            </button>
            <button
              className={`px-4 py-2 font-semibold cursor-pointer ${
                weatherUnit === "imperial"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500 hover:bg-gray-100"
              }`}
              onClick={() => handleUnitChange("imperial")}
            >
              °F
            </button>
          </div>
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search Location..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchCity(e);
              }
            }}
            className="bg-transparent text-black border-black 
                      border rounded-3xl pl-5 pr-5 w-60 md:w-80 justify-end
                      focus:outline-solid focus:outline-blue-500 focus:border-blue-500"
            pattern="[A-z]"
          />
        </div>

        <div className="block md:flex justify-evenly my-5">
          <div className="flex flex-col items-center md:items-start flex-1 text-center md:text-left px-4">
            <div className="block w-full">
              {weatherData && weatherForecast && (
                <h1 className="mb-8 text-center md:text-left">
                  {weatherData.name} -{" "}
                  {getDayFromTimeStamp(weatherData?.dt, weatherData?.timezone)}
                </h1>
              )}
              <div className="flex text-center my-10 sm:mr-10 sm:text-center sm:flex justify-evenly items-center">
                <img src={weatherIcon} className="mb-8 mr-15 xl:mr-50 w-30" />
                <h1>{weatherData?.main?.temp}°</h1>
              </div>
              {weatherData && weatherData.weather && (
                <p className="text-3xl text-center md:text-left mb-10 md:mb-0">
                  {handleUpperCaseLetters(weatherData.weather[0].description)}
                </p>
              )}
            </div>
          </div>

          <div className="border-solid border-black border-t-1 md:border-1 md:h-90" />

          <div className="flex justify-center flex-1">
            <div className="grid grid-cols-2 grid-rows-2 gap-10 sm:p-0 content-center">
              {weatherData &&
                weatherData.main &&
                [
                  {
                    label: "Feels Like",
                    value: `${weatherData.main.feels_like}°`,
                  },
                  { label: "Humidity", value: `${weatherData.main.humidity}%` },
                  {
                    label: "Air Pressure",
                    value: `${weatherData.main.pressure}`,
                  },
                  {
                    label: "Wind Speed",
                    value: `${weatherData.wind.speed}°`,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="text-xl my-5 lg:text-2xl xl:text-3xl text-center"
                  >
                    <p className="mb-4">{item.label}</p>
                    <p>{item.value}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center 2xl:flex-row sm:justify-evenly">
          {weatherForecast.list &&
            weatherData &&
            [7, 15, 23, 31, 39].map((item, index) => {
              const data = weatherForecast.list[item];
              if (!data?.weather) return null;

              return (
                <div
                  className="p-8 m-4 text-2xl text-center rounded-md
                             md:w-[30%] xl:w-[18%] 
                             min-h-[350px] max-h-[400px]
                             min-w-[300px] max-w-[300px] w-full sm:w-auto
                             odd:bg-blue-500 even:bg-blue-100 odd:text-white 
                             even:text-black"
                  key={index}
                >
                  <img
                    src={`${data.weather[0].main} - ${
                      index % 2 === 0 ? "White" : "Black"
                    }.png`}
                    className="m-auto mb-10 w-[100px]"
                  />
                  <p className="mb-5">
                    {getDayFromTimeStamp(data.dt, weatherData.timezone)}
                  </p>
                  <p className="mb-5">{data.main.temp}°</p>
                  <p className="">
                    {handleUpperCaseLetters(data.weather[0].description)}
                  </p>
                </div>
              );
            })}
        </div>
      </div>

      <div className="mt-5">
        {weatherForecast.list?.slice(0, 7).map((item, index) => (
          <div
            key={index}
            className={`flex p-6 justify-between sm:pl-10 sm:pr-20 text-black lg:text-xl
                     even:text-white even:bg-blue-500 odd:bg-blue-100 items-center`}
          >
            <div className="block text-center mr-5">
              <p className="mb-5 sm:mr-0">
                Today - {item.dt_txt.slice(-8, -3)}
              </p>
              <p>{item.main.temp}°</p>
            </div>

            <div className="flex flex-col items-center max-w-[50px] text-center">
              <img
                src={`${item.weather[0].main} - ${
                  index % 2 === 0 ? "Black" : "White"
                }.png`}
                className="w-[50px]"
              />
              <p className="mt-4">
                {handleUpperCaseLetters(item.weather[0].description)}
              </p>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 sm:flex sm:justify-between items-center">
              {[
                { label: "Feels Like", value: `${item.main.feels_like}°` },
                { label: "Humidity", value: `${item.main.humidity}%` },
                { label: "Air Pressure", value: item.main.pressure },
                { label: "Wind Speed", value: `${item.wind.speed}°` },
              ].map((data, i) => (
                <div key={i} className="block ml-10 text-center">
                  <p className="mb-2">{data.label}</p>
                  <p>{data.value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
