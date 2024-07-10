const weatherform=document.querySelector(".weatherform"); /* returns the first element in the class*/
const cityInput=document.querySelector(".cityInput"); /*setting reference for the above form*/
const card=document.querySelector(".card"); 
const apiKey="e04fb97bd0e84506d778ff5f37282092";
/*what is document selctor and why is it used
It allows developers to select elements based on various criteria such as class name (".className"), ID ("#id"), tag name ("tagname"), 
attribute selectors ("[attribute=value]").It allows JavaScript to access specific elements within an HTML document 
by specifying a CSS selector. This method returns the first element that matches the selector criteria.
SYNTAX- const element = document.querySelector(selector);
WE CAN ALSO USE const element = document.getElementById(id); OR const buttons = document.getElementsByClassName ALTERNATIVELY
Unlike older methods (getElementById, getElementsByClassName), document.querySelector provides more precise and 
concise element selection without requiring loops or additional checks.
*/
weatherform.addEventListener("submit", async event=>{               
    event.preventDefault();  
/*event type is submit when get weather is clicked keeps refreshing by default, to prevent that we use this*/
    const city=cityInput.value;  /*taking the input value from the above query selector and assigning it to a constant city*/
    if(city){  /*if its valid entry there can still be issues with api while fetching so we have to put try and catch*/
        try{
            const weatherData=await getWeatherData(city); 
/*u can use await only under async function we are going to wait for getWeatherData func to return the data*/
            displayWeatherInfo(weatherData);
        }
        catch(error){ 
/*if there is a error while fetching from api lets suppose or an error thats difficult to understand we need to inform
 2 people one the devlopers and the users through console settings in the inspect from the browswer, the developers get to know 
 and thru display msg users gets to know */
            console.error(error);
            displayError(error);
        }
    }
    else{
        displayError("Please enter a valid city"); /*displayError is a function look at it below to check what its does*/
        /*when the input is not valid for example when u put just enter or punctuation amrk or whatever*/
    }
}); 

async function getWeatherData(city){  /*fetching data from url*/
/*ASYNC IS USED BCOZ U HAVE TO USE AWAIT AND U HAVE TO USE THAT BCOZ FECTHING DATA TAKES TIME AND ONLY AFTER FECTH IS COMPLETE 
WE NEED TO DO THE REST*/
const apiUrl=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`; /*make sure to sue backticks*/
/*HERE U ARE CONSTRUCTING AN URL USING API KEY AND CITY bcoz:
every api requires API key for authentication.  API- Application programming interface
The API key (apiKey) uniquely identifies your application or user account and grants access to the API's resources.
Constructing the API URL with the apiKey ensures that every request made to the API includes the necessary credentials for 
authentication and authorization. Easy to customize the request and retrieve specific data. In your case, city is a parameter 
that specifies the location for which weather data is requested.*/
const response= await fetch(apiUrl);  /*Uses fetch() to make an HTTP request to Open WeatherMap API.*/
console.log(response);  /*helps debuggers to debug and ensure its working correctly*/
if (!response.ok){  /*Checks if the response is successful (response.ok). If not, throws an error.*/
    throw new Error("Could not fetch weather data");
}
else
{
    return await response.json(); 
}
/*This line converts the JSON data received from the API into a JavaScript object (data). Once parsed, 
you can access and manipulate the data as needed within your application.

what is json and why is it used?
JSON is a lightweight data interchange format that is easy for humans to read and write, and easy for machines 
to parse and generate. It is often used to transmit data between a server and a web application as text.
It consists of key-value pairs and arrays that are typically nested to represent complex data structures.
*/
}
function displayWeatherInfo(data){   /*data will be json format*/
    const { /* Destructures data object to extract city, temp, humidity, description, and id.*/
        name:city,
        main:{temp,humidity},
        weather: [{description,id}] }=data; 
       
    card.textContent="";  /* it clears out any existing text content that might be inside the card element.*/
    card.style.display="flex"; /*It turns the element into a flex container, enabling flexbox layout for its children.
    Flexbox layout is useful for arranging elements in a flexible and responsive manner within the card container.*/
    
    const cityDisplay=document.createElement("h1");  /*cityDisplay: Creates an <h1> element for displaying the city name.*/
    const tempDisplay=document.createElement("p");
    const humidityDisplay=document.createElement("p");
    const descDisplay=document.createElement("p");
    const weatherEmoji=document.createElement("p");

    cityDisplay.textContent=city;  /*textcontent is like strr="" and we append something in it*/
    tempDisplay.textContent=`${(temp-273.15).toFixed(2)}°C`;
    /* tempDisplay.textContent=${(temp-273.15)* (9/5) +32.toFixed(2)}°F;*/
    humidityDisplay.textContent=`Humidity: ${humidity}%`;  /*LEARN THE SYNTAX*/
    descDisplay.textContent=description;
    weatherEmoji.textContent=getWeatherEmoji(id);

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");
    /*
    These lines add CSS classes to each element using classList.add():
    These classes likely define styles for each type of weather data (cityDisplay, tempDisplay, etc.).
    */
    
    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);
    /*
    These lines append each created element (cityDisplay, tempDisplay, etc.) to the card element:
    This adds all the weather information elements (city, temperature, humidity, etc.) as children of card.
*/
}
function getWeatherEmoji(weatherId){
    switch(true){
        /*does the value of true match with follwoing Cases*/
        case(weatherId>=200 && weatherId< 300):
            return "⛈️";
        case(weatherId>=300 && weatherId< 400):
            return "🌦️";
        case(weatherId>=500 && weatherId<600):
            return "🌧️";
        case(weatherId>=600 && weatherId< 700):
            return "❄️";
        case(weatherId>=700 && weatherId< 800):
            return "🌫️";
        case(weatherId===800): /*here its triple equal*/
            return "☀️";
        case(weatherId>=801 && weatherId< 810):
            return "☁️";
        default:
            return "❓";
    }
}

function displayError(message){
    const errorDisplay=document.createElement("p");
    errorDisplay.textContent=message;
    errorDisplay.classList.add("errorDisplay");
    card.textContent="";  /*reset the string*/
    card.style.display="flex";
    card.appendChild(errorDisplay);
}