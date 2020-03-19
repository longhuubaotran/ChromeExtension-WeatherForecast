const place = document.querySelector('.place');
const tempView = document.querySelector('.temp');
const feelLikeView = document.querySelector('.feel-like');
const tempRangeView = document.querySelector('.temp-range');
const windy = document.querySelector('.windy');
const rain = document.querySelector('.rain');
const snowflakes = document.querySelector('.snowflakes');
let temp;
let feelLike;
let temprange;
let city;
let condition;

displayDate();
setInterval(() => {
  displayTime();
}, 1000);

// get location
(function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handleLocation);
  } else {
    console.log('Geolocation is not supported by this browser.');
  }
})();

// call back  to handle location
function handleLocation(position) {
  getLocationFromGeocode(position);
}

// convert geocode to specific location
async function getLocationFromGeocode(position) {
  const url = `https://us1.locationiq.com/v1/reverse.php?`;
  try {
    if (localStorage.getItem('location') === null) {
      const res = await axios.get(url, {
        params: {
          key: 'f57f7ac479f124',
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          format: 'json'
        }
      });
      city = res.data.address.city;
      localStorage.setItem('location', city);
      console.log(city);
    } else {
      console.log('location exits');
      city = localStorage.getItem('location');
    }
    getWeather(city);
  } catch (error) {
    console.error(error);
  }
}

// get weather
async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?`;
  try {
    const res = await axios.get(url, {
      params: {
        q: city,
        units: 'metric',
        appid: '5de17d4369ad14cabcd7416857322ab6'
      }
    });

    // assign data from API
    temp = Math.round(res.data.main.temp);
    feelLike = Math.round(res.data.main.feels_like);
    temprange = `${Math.round(res.data.main.temp_min)}°C - ${Math.round(
      res.data.main.temp_max
    )}°C`;
    condition = res.data.weather.id;

    // show data
    displayData(city, temp, feelLike, temprange, condition);
  } catch (error) {
    console.error(error);
  }
}

function displayData(city, temp, feelLike, temprange, condition) {
  //display weather
  place.innerHTML = city;
  tempView.innerHTML = `${temp}°C`;
  feelLikeView.innerHTML = `Feel like: ${feelLike}°C`;
  tempRangeView.innerHTML = `Temp range: ${temprange}`;
  if (condition >= 200 && condition <= 233) {
    windy.style.display = 'block';
  } else if (condition >= 300 && condition <= 532) {
    windy.style.display = 'none';
    rain.style.display = 'block';
  } else if (condition >= 600 && condition <= 622) {
    windy.style.display = 'none';
    rain.style.display = 'none';
    snowflakes.style.display = 'block';
  } else {
    windy.style.display = 'none';
    rain.style.display = 'none';
    snowflakes.style.display = 'none';
  }
}

function displayDate() {
  //display date
  let d = new Date();
  let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Satur'];
  let months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  document.querySelector('.current-date').innerHTML = `${days[d.getDay()]}   ${
    months[d.getMonth()]
  }-${d.getDate()}-${d.getFullYear()}`;
}

function displayTime() {
  let d = new Date();
  document.querySelector(
    '.current-time'
  ).innerHTML = `${d.getHours()}:${d.getMinutes(0)}:${d.getSeconds()}`;
}
