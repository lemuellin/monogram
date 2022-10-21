import { useState, useEffect } from 'react';

const WeatherWidget = () => {

    const[info, setInfo] = useState({});
    useEffect(()=>{
        getData();
    },[]);

    async function getData(){
        try{
            if (!navigator.geolocation) {
                console.error(`Your browser doesn't support Geolocation`);
            }
            navigator.geolocation.getCurrentPosition(async (position) => {
                const latitude = Math.round(position.coords.latitude * 10000) / 10000;
                const longitude = Math.round(position.coords.longitude * 10000) / 10000;
                const OpenWeatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&APPID=08ebf9b0e8398ffe661ac4bcae054cda";
                const OpenWeatherResponse = await fetch(OpenWeatherURL, {mode: 'cors'});
                const allData = await OpenWeatherResponse.json();
                sortData(allData);
                
            });         
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
        <div className="d-flex align-items-center justify-content-center mt-4 gap-4">
            <div className="d-flex flex-column align-items-center justify-content-center">
                <div id="weatherLocation">{info.location}</div>
                <div className='d-flex align-items-center justify-content-center'>
                    <img src={"https://openweathermap.org/img/wn/" + `${info.icon}` + '@2x.png'} alt="weather condition" id="weatherIcon"/>
                    <div id="weatherTemp">{info.tempF}</div>
                </div>
                
                <div id="weatherDescription">{info.description}</div>
            </div>
            <div>
                <div id="sunrise">Sunrise: {info.sunrise}</div>
                <div id="sunset">Sunset: {info.sunset}</div>
                <div>Catch the Golden Hour!</div>
            </div>
        </div>
    )
}

export default WeatherWidget;