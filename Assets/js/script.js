const apiKey = '3ac612bec38b9ebd74ccb9dcb78997e5'
const mainContainer = document.getElementById('page')
let currDTValue = moment().format("YYYY-MM-DD hh:mm:ss");
let newcurrDTValue = currDTValue.split(" ")[0]
const fiveDaysOfWeather = []
const citySearches = []
const savedCitySearches = localStorage.getItem('cityForm') || []
let lat
let lon
let cityName = ""
console.log(citySearches)
console.log(savedCitySearches)

function userCityRequest(){
  let userCitySearch = document.getElementById('citySearch')
  const searchedCityArray = []
  $('#cityForm').on('click', "#btnSearch", function (e){
    const savedDataID = $(this).parent().attr('id')
    const savedDataText = $(this).prev().val()
    // const addToSavedCitySearches = savedCitySearches
    // addToSavedCitySearches.push(citySearches)
    // console.log(addToSavedCitySearches)
    citySearches.push(savedDataText)
    localStorage.setItem(savedDataID, JSON.stringify(citySearches))
    e.preventDefault()
    console.log(typeof savedDataID,typeof savedDataText)
    console.log(savedDataText)
    console.log(typeof citySearches)
    cityLatLon()
  })
}

function cityLatLon(){
  for(i = 0; i<citySearches.length; i++)
  cityName = JSON.stringify(citySearches[i])
  console.log(typeof cityName)
  console.log(cityName)
  const geoCityCoder = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`
  fetch(geoCityCoder)
    .then(response =>{
      console.log(response)
      return response.json();
    })
   .then(data =>{
      lat = data[0].lat;
      lon = data[0].lon;
      console.log(lat, lon)
      weatherDataCollection()
    })
}

function weatherDataCollection(){
  const apiLink = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
  
  fetch(apiLink)
    .then (response =>{
      console.log(response);
      return response.json();
    })
    .then(data => {
      console.log(data);
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
  addDataToPage()
}

function addDataToPage(){
  console.log(fiveDaysOfWeather)
  console.log(savedCitySearches)
  const day1 = document.getElementById('day-1')
  const day2 = document.getElementById('day-2')
  const day3 = document.getElementById('day-3')
  const day4 = document.getElementById('day-4')
  const day5 = document.getElementById('day-5')
  console.log(day1)


  

}
userCityRequest()

//weatherDataCollection();