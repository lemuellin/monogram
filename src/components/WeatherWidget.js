import { useState, useEffect } from 'react';
import loadingGIF from '../assets/loading.gif';

const WeatherWidget = () => {

    const[info, setInfo] = useState({});
    useEffect(()=>{
        getData();
    },[]);

    const [locationEnabled, setLocationEnabled] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);

    async function getData(){
        setLocationEnabled(true);
        try{
            if (!navigator.geolocation) {
                alert(`Your browser doesn't support Geolocation`);
            }
            const errorCallback = (error) => {
                console.log("no permission");
                setLocationEnabled(false);
            }

            navigator.geolocation.getCurrentPosition(async (position) => {
                console.log("SUC:",navigator.geolocation);
                const latitude = Math.round(position.coords.latitude * 10000) / 10000;
                const longitude = Math.round(position.coords.longitude * 10000) / 10000;
                const OpenWeatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&APPID=08ebf9b0e8398ffe661ac4bcae054cda";
                const OpenWeatherResponse = await fetch(OpenWeatherURL, {mode: 'cors'});
                const allData = await OpenWeatherResponse.json();
                sortData(allData);
                setDataFetched(true);
            }, errorCallback);  
            
        }catch(error){
            console.log(error);
        }
    }

    function sortData(allData){
        let tempF = ((allData.main.temp - 273.15)*9/5+32).toFixed(0) + "°";
        let tempC = (allData.main.temp - 273.15).toFixed(0);
        let location = allData.name;
    
        let description = allData.weather[0].description;
        let icon = allData.weather[0].icon;

        let sunriseDate = new Date((allData.sys.sunrise)*1000);
        let sunrise = "0" + sunriseDate.getHours() + ":" + ("0" + sunriseDate.getMinutes()).slice(-2) + "AM";
        let sunsetDate = new Date((allData.sys.sunset)*1000);
        let sunset = "0" + (sunsetDate.getHours() - 12) + ":" + ("0" + sunsetDate.getMinutes()).slice(-2) + "PM";
    
        setInfo({
            location: location, 
            tempF: tempF,
            tempC: tempC,
            description: description,
            icon: icon,
            sunrise: sunrise,
            sunset: sunset
        });
    }

    return(
        <div>
            { locationEnabled ? 
                <div className='d-flex flex-column justify-content-center align-items-center'>
                    { dataFetched ?
                        <div className=" d-flex align-items-center justify-content-center mt-4 gap-4"  id="weatherWidget">
                            <div className="d-flex flex-column align-items-center justify-content-center">
                                <div id="weatherLocation">{info.location}</div>
                                <div className='d-flex align-items-center justify-content-center'>
                                    <img src={"https://openweathermap.org/img/wn/" + `${info.icon}` + '@2x.png'} alt="weather condition"/>
                                    <div id="weatherTemp">{info.tempF}</div>
                                </div>
                                
                                <div id="weatherDescription">{info.description}</div>
                            </div>
                            <div>
                                <div id="sunrise">Sunrise: {info.sunrise}</div>
                                <div id="sunset">Sunset: {info.sunset}</div>
                                <div>Catch the Golden Hour!</div>
                            </div>
                        </div> :
                        <img className="mt-4" src={loadingGIF} alt="loading" id="loadingGIF"/>
                    }
                </div> :
                <div className='text-center mt-4'>Enable Location Service for Weather Widget!</div>
            }
        </div>
    )
}

export default WeatherWidget;