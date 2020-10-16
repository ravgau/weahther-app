let form = document.querySelector("form.special")
let input = document.querySelector("input");

let loader = document.querySelector(".loader")
let fallback = document.querySelector('.fallback')
 let wrapperTo = document.querySelector(".wrapperTo")
 let temp = document.querySelectorAll("#temp")
 let icon = document.querySelector('div.container img')
 let maxTemp = document.querySelector("span#maxTemp")
 let minTemp = document.querySelector("span#minTemp")
 let pressure = document.querySelector("span#pressure")
 let wind = document.querySelector("span#wind")
 let humidity = document.querySelector("span#humidity")
 let summary = document.querySelector(" div.container div.summary")

let weekView = document.querySelector("section.week-view")

 let icons={
    "clear":"./img/sun.svg",
    "clear-day":"./img/sun.svg",
    "clear-night":"./img/moon.svg",
    "rain":"./img/rain.svg",
    "snow":"./img/Snow.svg",
    "wind":"./img/wind.svg",
    "cloudy":"./img/cloud.svg",
    'partly-cloudy-day' : "./img/cloudy-day.svg",
    'partly-cloudy-night': "./img/cloudy-night.svg",
    'fallback': './img/fallback.png'
}

 function mainView(data){
    console.log(data.forecast);
    
    temp[0].textContent  = data.forecast.currently.temperature;
    temp[1].textContent  = data.forecast.currently.temperature;
    icon.src = icons[data.forecast.currently.icon] ? icons[data.forecast.currently.icon] : icons['fallback']
    maxTemp.textContent = data.forecast.daily.data[0].temperatureHigh;
    minTemp.textContent = data.forecast.daily.data[0].temperatureLow;
    pressure.textContent = data.forecast.daily.data[0].pressure;
    wind.textContent = data.forecast.daily.data[0].windSpeed;
    humidity.textContent = data.forecast.daily.data[0].humidity;
    summary.textContent = data.forecast.daily.data[0].summary;
}

function weeklyView(data){
    let weeks = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    let day = new Date().getDay();
    console.log(day);
    weekView.innerHTML = " "
    console.log(data.data,"hgh")
    weekView.innerHTML = `<h3 calss ="week-summary" > ${data.summary} </h3>`
    let markup = (d)=>{
       console.log(d);
       let icon = icons[d.icon]? icons[d.icon] : icon["fallback"];
       return  `   
        <div class="day">
        <div class = "summary">
            <img src="${icon}" alt="">
            <h2 class="summary">
            ${d.summary}<br>
            <span>${weeks[(day++)%7]}</span>
            </h2>
        </div>
        <div class="data">
            <li><h4>MAX:<span id="maxTemp">${d.temperatureHigh}</span>C</h4></li>
            <li><h4>MIN:<span id="minTemp">${d.temperatureLow}</span>C</h4></li>
        </div>
       </div>

        `
    }
    let html = ''
    data.data.forEach(e=>{
        html += markup(e)
    })
    // console.log(html)
    weekView.innerHTML += html;
}


window.addEventListener('load',()=>{
    
    fallback.display="none";

    navigator.geolocation.getCurrentPosition((pos)=>{
        console.log(pos);
        fetch("/geoweather?lat="+pos.coords.latitude+"&long="+pos.coords.longitude).then((res)=>{
            res.json().then((data)=>{
                console.log(data)
                loader.classList.toggle("hide");/*add hide class to hide the loader*/
                wrapperTo.classList.toggle("hide");/*remove hide class to display data when available*/
                if(data.error){
                    fallback.display="block";
                    fallback.textContent= data.error;
                }
                else
                {
                   mainView(data);
                   console.log(data,"from api")
                   weeklyView(data.forecast.daily)
                }}
                )
            })
        })
})

form.addEventListener("submit",(e)=>{
    e.preventDefault();
    fallback.textContent="";
    loader.classList.toggle('hide');
    wrapperTo.classList.toggle('hide');
    
    let location = input.value;
    if(! location){
        loader[0].classList.toggle("hide");
        fallback.textContent =  "please provide a location to search for..."; 
        return;
    }
    fetch("/weather?q="+location).then((res)=>{
            res.json().then((data)=>{
                loader.classList.toggle("hide");
                
                
                if(data.error){
                    console.log(data.error)
                    fallback.textContent= data.error
                    return 
                }
                console.log(data)
                mainView(data)
                weeklyView(data.forecast.daily)
                wrapperTo.classList.toggle('hide')
            })
        })
})


