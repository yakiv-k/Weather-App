import { useState, useEffect } from "react";
import axios from "axios";
import "./Weather.scss";

// Date and time variables used to isolate data
const day = new Date();
const currentDate = `${day.getFullYear()}-0${
  day.getMonth() + 1
}-${day.getDate()}`;
const firstDay = `${day.getFullYear()}-0${day.getMonth() + 1}-${
  day.getDate() - 5
}`;
const currentHour = `${day.getHours()}:00`;

// API URL
const weatherAPI = `https://api.open-meteo.com/v1/forecast?latitude=43.70&longitude=-79.54&hourly=temperature_2m&daily=weathercode&current_weather=true&precipitation_unit=inch&start_date=2023-03-08&end_date=${currentDate}&timezone=America%2FNew_York`;

function Weather() {
    const [temp, setTemp] = useState([]);
    const [currentTime, setCurrentTime] = useState([]);
    const [pastDays, setPastDays] = useState([]);
    const [pause, setPause] = useState(false);
    const [final, setFinal] = useState([])
  

  // Function that allows you to suspend the update
  const handlePause = () => {
    setPause(!pause);
  };

  useEffect(() => {
    async function getWeatherData() {
      const data = await axios.get(weatherAPI);
      let tempData = data.data.hourly.temperature_2m;
      let currentTimeData = data.data.hourly.time;
      let daysData = data.data.hourly;
      let refIndex = currentTimeData.indexOf(`${currentDate}T${currentHour}`);

      setTemp(tempData[refIndex]);
      setCurrentTime(currentTimeData[refIndex]);
      setPastDays(daysData);

      // FUNCTION: isolate data for previous five days
      const getFiveDays = (arr) => {
        let indices = [];
        let newArr = [];
        let hoursArr = arr.time;
        let temp;
        console.log(hoursArr);
        for (let i = 0; i < hoursArr.length; i++) {
          if (
            hoursArr[i].includes(firstDay) &&
            hoursArr[i].includes(currentHour)
          ) {
            indices.push(i);
          }
          if (
            hoursArr[i].includes(currentDate) &&
            hoursArr[i].includes(currentHour)
          ) {
            indices.push(i);
          }
        }

        temp = [
          arr.temperature_2m.slice(indices[0], indices[1]),
          hoursArr.slice(indices[0], indices[1]),
        ];
        console.log("test");

        for (let i = 0; i < temp[0].length; i++) {
          newArr.push({
            temperature: temp[0][i],
            timestamp: temp[1][i],
          });
        }
        setFinal(newArr);
        return newArr;
      };
      console.log(getFiveDays(pastDays));

      /////////////////
    }

    getWeatherData();

    const interval = setInterval(() => {
      if (pause === false) {
        getWeatherData();
      }
    }, 50000);

    return () => clearInterval(interval);
  }, [pause]);

  return (
    <section className="weather">
      <div className="weather__display display">
        <h1 className="display__title">Outdoor temperature</h1>
        <div className="display__stat">
          <label className="display__label">Temperature</label>
          <div className="display__data">{temp}</div>
        </div>
        <div className="display__stat">
          <label className="display__label">Last measured at</label>
          <div className="display__data">{currentTime}</div>
        </div>
        <button onClick={handlePause} className="display__button">
          Pause/Resume
        </button>
      </div>
    </section>
  );
}

export default Weather;
