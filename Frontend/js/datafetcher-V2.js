// Create API request
const zeroPad = (num, places) => String(num).padStart(places, '0');
Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

let windowWidth = $(window).width();

let mobileView = false;

if ($(window).width() < 950) {
    mobileView = true;
}

$(window).resize(function () {
    // Reload page when switching between desktop and mobile size
    if (($(window).width() < 950 && !mobileView) || ($(window).width() >= 950 && mobileView)) {
        window.location.href = window.location.href;
    }
});

var day = new Date();
day.setHours(0, 0, 0, 0);
var weekStart = new Date(day);
var weekEnd = new Date(day);


$(document).ready(function () {
    // Calculate weekStart and weekEnd
    if(day.getDay() == 0){
        weekStart = day.addDays(-6);
    } else {
        weekStart = (day.addDays(-(day.getDay() - 1)));
    }
    weekEnd = weekStart.addDays(6);

    // call setupCalender only on desktop because on mobile divs get deleted
    if(!mobileView){
        setupCalender();
    }
    if (getCookie("cookieBanner") == "true" && (getCookie("timezone") != null && getCookie("timezone") != "")) {
        getData(getCookie("timezone"));
        // set timeselector to cookie time
        $('#timeselector').val(getCookie("timezone"));
    } else {
        getData($('#timeselector')[0].value);
    }
});

// Gets data from api and fill calender
function getData(selectedTime) {
    fetch('https://holocal.tv/api/streams.php?week=this&timezone=' + selectedTime)
    .then(function(response){
        if(!response.ok){
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(function(data){
        if(!mobileView){
            fillCalender(data);
        } else {
            fillMobileCalender(data);
        }
        document.getElementById('loadedData').style.display = 'flex';
    }).catch(function(error){
        document.getElementById('failedData').style.display = 'flex';
        console.error('Error: ' + error);
    }).then(function(){
        document.getElementById('loadingMessage').style.display= 'none';
    });
}

// fill calender with day-name and date
function setupCalender() {
    let counter = 0;
    let weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (let date = weekStart; date <= weekEnd; date = date.addDays(1)) {
        if (date.getDay() == day.getDay()) {
            document.getElementById(weekdays[counter]).innerHTML = weekdays[counter] + ' ' + zeroPad(date.getMonth() + 1, 2) + '.' + zeroPad(date.getDate(), 2);
            document.getElementById(weekdays[counter]).className += " currDay";
        } else {
            document.getElementById(weekdays[counter]).innerHTML = weekdays[counter] + ' ' + zeroPad(date.getMonth() + 1, 2) + '.' + zeroPad(date.getDate(), 2);
        }
        counter++;
    }
}

// create desktop calender
function fillCalender(data) {
    var currentDay = new Date();

    // Delete table content -> only headers remain
    $(".table .content").remove();

    for (let time = 0; time < 24; time++) {
        let currTime = new Date();

        let timeEntry = document.createElement('div');
        timeEntry.className = "content time " + zeroPad(time, 2);
        timeEntry.innerHTML = zeroPad(time, 2) + ":00";
        if (time % 2 == 1) {
            timeEntry.className += " nthRow";
        }

        if (time == currTime.getHours()) {
            timeEntry.className += " currHour";
        }
        $("#table").append(timeEntry);
        for (let day = weekStart; day <= weekEnd; day = day.addDays(1)) {
            let newEntry = document.createElement('div');
            newEntry.className = "content ";
            if (day.getDay() == currentDay.getDay()) {
                newEntry.className += " currDay";
            }
            if (time % 2 == 1) {
                newEntry.className += " nthRow";
            }
            $("#table").append(newEntry);
            if (time == currTime.getHours()) {
                newEntry.className += " currHour";
            }
            data.forEach(element => {
                let streamDate = new Date(element['streamDate']);
                let hourComp = new Date(day.getDate());
                hourComp.setHours(time);
                if (streamDate.getHours() == hourComp.getHours()) {
                    day.setHours(0, 0, 0, 0);
                    streamDate.setHours(0, 0, 0, 0);
                    if (streamDate.getTime() == day.getTime()) {
                        newEntry.innerHTML += '<a href="' + element['streamURL'] + '" target="_blank">' + element['member'] + '</a><br>' + element['streamName'] + '<br>';
                    }
                }
            });
        }
    }
}

// create mobile calender
function fillMobileCalender(data) {
    let currDay = new Date();
    let weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // also remove headers, not only content
    $(".table .header").remove();
    
    for (let day = weekStart; day <= weekEnd; day = day.addDays(1)) {
        let header = document.createElement('div');
        header.className = "header";
        header.innerHTML = weekdays[day.getDay()];
        
        // scroll to current day?
        if (day.getDay() == currDay.getDay()) {
            header.id = "currDay";
        }

        let hourComp = new Date(day.getDate());

        $("#table").append(header);
        for (let time = 0; time < 24; time++) {
            // time
            let timeEntry = document.createElement('div');
            timeEntry.className = "content time";
            timeEntry.innerHTML = zeroPad(time, 2) + ":00";
            let newEntry = document.createElement('div');
            newEntry.className = "content";
            // stream
            hourComp.setHours(time);
            day.setHours(0, 0, 0, 0);
            data.forEach(element => {
                let streamDate = new Date(element['streamDate']);
                if (streamDate.getHours() == hourComp.getHours()) {
                    streamDate.setHours(0, 0, 0, 0);
                    if (streamDate.getTime() == day.getTime()) {
                        newEntry.innerHTML += '<a href="' + element['streamURL'] + '" target="_blank">' + element['member'] + '</a><br>' + element['streamName'] + '<br>';
                    }
                }
            });
            // only append new streams if there is a new stream
            if (newEntry.innerHTML != "") {
                $("#table").append(timeEntry);
                $("#table").append(newEntry);
            }
        }
    }
}

function newDefaultTimezone(timezone) {
    if (getCookie("cookieBanner") == "true") {
        setCookie("timezone", timezone, 31);
    }
}