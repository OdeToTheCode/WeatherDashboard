const apiKey = '3ac612bec38b9ebd74ccb9dcb78997e5'
const mainContainer = document.getElementById('page')
let currDTValue = moment().format("YYYY-MM-DD hh:mm:ss");
let newcurrDTValue = currDTValue.split(" ")[0]
const fiveDaysOfWeather = []
const citySearches = []
const savedCitySearches = localStorage.getItem('cityForm') 
let lat
let lon
let cityName = ""
let buttonCount = 0;
let buttonArray = [];

//console.log(citySearches)
//console.log(savedCitySearches)

function userCityRequest(){
  let searchedCityArray = []

  searchedCityArray.push(savedCitySearches)
  $('#cityForm').on('click', "#btnSearch", function (e){
    const savedDataID = $(this).parent().attr('id')
    const savedDataText = $(this).prev().val()
    searchedCityArray.push(JSON.stringify(savedDataText))
    citySearches.push(savedDataText)
    localStorage.setItem(savedDataID, searchedCityArray)
    e.preventDefault()
    //console.log(typeof savedDataID,typeof savedDataText)
    console.log(savedDataText)
    //console.log(typeof citySearches)
    cityLatLon()
  })
}

function cityLatLon(){
  for(i = 0; i<citySearches.length; i++)
  cityName = JSON.stringify(citySearches[i])
  //console.log(typeof cityName)
  console.log(cityName)
  const geoCityCoder = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`
  fetch(geoCityCoder)
    .then(response =>{
      //console.log(response)
      return response.json();
    })
   .then(data =>{
      lat = data[0].lat;
      lon = data[0].lon;
      //console.log(lat, lon)
      weatherDataCollection()
      todaysWeather()
    })
}

function todaysWeather(){
 const weatherToday = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`

 fetch(weatherToday)
  .then (response =>{
    //console.log(response)
    return response.json()
  })
  .then (data => {
    //console.log(data)
    displayToday(data.main)
  })
}

function displayToday(data){
  console.log(data)
  console.log(cityName)
  var city = cityName
  let container = document.getElementById("todayCity");
    while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  let selectedItems = ["temp", "feels_like", "temp_min", "temp_max"];
  
  let cityElement = document.createElement("div");
  cityElement.innerHTML = "City: " + city;
  container.appendChild(cityElement);

  for (let key in data) {
      if (selectedItems.includes(key)) {
          let item = data[key];
          let element = document.createElement("div");
          let titleNode = document.createTextNode(city);
          element.insertBefore(titleNode, element.firstChild);
          element.innerHTML = key+":"+item;
          container.appendChild(element);
      }
  }

  //create new button
  let addBtn = document.createElement("button");
  let addBtnText = document.createTextNode((city));
  addBtn.appendChild(addBtnText);
  document.getElementById("addBtn").appendChild(addBtn);
  addBtn.setAttribute("data-set", JSON.stringify(data));

  //save button data to array
  buttonArray.push(addBtn);
  buttonCount++;

  //remove oldest button if more than 5 buttons exist
  if (buttonCount > 5) {
      let removeBtn = buttonArray.shift();
      removeBtn.remove();
      buttonCount--;
  }
}

function weatherDataCollection(){
  const apiLink = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
  
  fetch(apiLink)
    .then (response =>{
      //console.log(response);
      return response.json();
    })
    .then(data => {
      //console.log(data);
      parseWeatherData(data.list)
    })
}

function parseWeatherData(data){
  //console.log(data)
  data.forEach(obj => {
    const dateObj = moment(obj.dt_txt)
    const currday = dateObj._i; 
    const newCurrDay = currday.split(" ")[0];
    //console.log(dateObj)
    //console.log(currday.split(" "))
    //console.log(currDTValue)
    
    console.log(newCurrDay)
     if( newCurrDay !== newcurrDTValue && fiveDaysOfWeather.length < 5 && !fiveDaysOfWeather.find( day => day.dt_txt.split(" ")[0] === obj.dt_txt.split(" ")[0] ) ){
        currDTValue = newCurrDay
        fiveDaysOfWeather.push(obj)
    }
  })
  console.log(typeof data[0])
  addDataToPage(fiveDaysOfWeather)
}

function addDataToPage(fiveDaysOfWeather, cityName){
  const ul = document.createElement("ul");
  const fiveDayAhead = document.getElementById('fiveDayAhead')
  ul.classList.add("data-list");
  console.log(fiveDaysOfWeather.length)
  console.log(fiveDaysOfWeather)
  for (let i = 0; i < fiveDaysOfWeather.length; i++) {
    const main = fiveDaysOfWeather[i].main;
    const li = document.createElement("li");
    li.classList.add("data-item", "col-2", "row");
    li.innerHTML = `
    <div class="5dayCity">City: ${cityName}</div>
    <div class="temp">temp: ${main.temp}</div>
    <div class="feels-like">feels like: ${main.feels_like}</div>
    <div class="temp-min">temp min: ${main.temp_min}</div>
    <div class="temp-max">temp max: ${main.temp_max}</div>
    `;
  ul.appendChild(li);
}
document.body.appendChild(ul);

}

userCityRequest()

//weatherDataCollection();