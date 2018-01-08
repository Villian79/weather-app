/*global $*/
/*global navigator*/

$( document ).ready(() => {
//Obtaining User's current geolocation using HTML5 Geolocation API, link to resource: https://www.w3schools.com/html/html5_geolocation.asp
    let options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };
    
    let success = (pos) => {
        console.log(pos);
        let latitude=pos.coords.latitude;
        let longitude=pos.coords.longitude;
        //Obtaining location's name and weather conditions sending AJAX request to FCC Weather API, endpoint: https://fcc-weather-api.glitch.me/
        //Setting up necessary data and functions
        let requestHeaders = {
                  method: "GET",
                  url: `https://fcc-weather-api.glitch.me/api/current?lat=${latitude}&lon=${longitude}`,
                  dataType: "json"
                };
                
        let responseHandler = (data) => {
            console.log(data);
            let tempVal = data.main.temp;
            $("#location").text(`${data.name}, ${data.sys.country}`);
            $("#weather").text(`${data.weather[0].main} (${data.weather[0].description})`);
            $("img").attr("src", data.weather[0].icon);
            $("#temperature").html(`Current Temperature: <span class="temperatureValue">${tempVal}</span><span class="currentState"> °C</span>`);
            
            //Obtain images from unsplash API
            let unsplash_id = "279f227c58b4278d7d7724b8e681048bf7a6d4b07f8553d43409f6d1bc594ec4";
            let requestHeaders_unsplash = {
                method: "GET",
                url: `https://api.unsplash.com/photos/random?client_id=${unsplash_id}&query=${data.weather[0].main}&orientation=landscape`,
                dataType: "json"
            };
            
            let responseHandler_unsplash = (data) => {
                console.log(data);
                $("main").css({"background-image": `url(${data.urls.regular})`});
                //$("img").attr("src", data.urls.small);
            };
            
            let errorHandler_unsplash = (err) => alert(`There was ERROR handling your request: ${err}`);
            
            $.ajax(requestHeaders_unsplash).done(responseHandler_unsplash).fail(errorHandler_unsplash);
        };
        
        let errorHandler = (err) => alert(`There was ERROR handling your request: ${err}`);
        //Making jQuery ajax request
        $.ajax(requestHeaders).done(responseHandler).fail(errorHandler);
        
    };
    
    let error = (err) => alert(`ERROR(${err.code}): ${err.message}`);
    
    navigator.geolocation.getCurrentPosition(success, error, options);

//Handling toggle events on buttons

$(".buttons").click(() => {
            let temp = Number($(".temperatureValue").text());
        let currentState = $(".currentState").text();
    $("button").toggle(() => {
        if(currentState === " °C"){
            let tempF = (temp * 1.8 + 32).toFixed();
            $(".temperatureValue").text(tempF);
            $(".currentState").text(" °F");
            
        }
        else{
            let tempC = ((temp - 32) / 1.8).toFixed();
            $(".temperatureValue").text(tempC);
            $(".currentState").text(" °C");
        }
    });
});

});