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

if($(window).width() < 950){
    mobileView = true;
}

$(window).resize(function() {
    if(($(window).width() < 950 && !mobileView) || ($(window).width() >= 950 && mobileView)) {
        window.location.href = window.location.href;
    }
});

$(document).ready(function () {
    $.support.cors = true;
    setupCalender();
    if(getCookie("cookieBanner") == "true" && (getCookie("timezone") != null && getCookie("timezone") != "")){
        getData(getCookie("timezone"));
        $('#timeselector').val(getCookie("timezone"));
    } else {
        getData($('#timeselector')[0].value);
    }
});

// Gets data from api
function getData(selectedTime) {
    $.getJSON('https://holocal.tv/api/streams.php?week=this&timezone=' + selectedTime)
        .done(function (data) {
            if(!mobileView){
                fillCalender(data);
            } else {
                fillMobileCalender(data);
            }
                $('#loadedData').show();

        })
        .fail(function (jqxhr, textStatus, error) {
            $('#failedData').show();
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + err);
        })
        .always(function () {
            $('#loadingMessage').hide();
        });
}

function setupCalender() {
    var day = new Date();
    day.setHours(0, 0, 0, 0);
    let weekStart = (day.addDays(-(day.getDay() - 1)));
    let weekEnd = weekStart.addDays(6);
    let counter = 0;
    let weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (let date = weekStart; date <= weekEnd; date = date.addDays(1)) {
        if(date.getDay() == day.getDay()){
            document.getElementById(weekdays[counter]).innerHTML = weekdays[counter] + ' ' + zeroPad(date.getMonth() + 1, 2) + '.' + zeroPad(date.getDate(), 2);
            document.getElementById(weekdays[counter]).className += " currDay";
        } else {
            document.getElementById(weekdays[counter]).innerHTML = weekdays[counter] + ' ' + zeroPad(date.getMonth() + 1, 2) + '.' + zeroPad(date.getDate(), 2);
        }
        counter++;
    }
}

function fillCalender(data) {
    var day = new Date();
    var currentDay = new Date();
    day.setHours(0, 0, 0, 0);
    let weekStart = (day.addDays(-(day.getDay() - 1)));
    let weekEnd = weekStart.addDays(6);

    // Delete table content -> only headers remain
    $(".table .content").remove();

    for (let time = 0; time < 24; time++) {
        let timeEntry = document.createElement('div');
        timeEntry.className = "content time " + zeroPad(time, 2);
        timeEntry.innerHTML = zeroPad(time, 2) + ":00";
        if(time % 2 == 1){
            timeEntry.className += " nthRow";
        }
        $("#table").append(timeEntry);
        for (let day = weekStart; day <= weekEnd; day = day.addDays(1)) {
            let newEntry = document.createElement('div');
            newEntry.className = "content ";
            if(day.getDay() == currentDay.getDay()){
                newEntry.className += " currDay";
            }
            if(time % 2 == 1){
                newEntry.className += " nthRow";
            }
            $("#table").append(newEntry);
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

function fillMobileCalender(data){
    var day = new Date();
    day.setHours(0, 0, 0, 0);
    let weekStart = (day.addDays(-(day.getDay() - 1)));
    let weekEnd = weekStart.addDays(6);
    $(".table .header").remove();
    let weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for(let day = weekStart; day <= weekEnd; day = day.addDays(1)){
        let header = document.createElement('div');
        header.className = "header";
        header.innerHTML = weekdays[day.getDay()];
        let currDay = new Date();
        if(day.getDay() == currDay.getDay()){
            header.id = "currDay";
        }
        $("#table").append(header);
        for (let time = 0; time < 24; time++) {
            
            let timeEntry = document.createElement('div');
            timeEntry.className = "content time";
            let newEntry = document.createElement('div');
            newEntry.className = "content";
            if(time % 2 == 1){
                timeEntry.className += " nthRow";
                newEntry.className += " nthRow";
            }
            timeEntry.innerHTML = zeroPad(time, 2) + ":00";
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
            if(newEntry.innerHTML != ""){
                $("#table").append(timeEntry);
                $("#table").append(newEntry);
            } 

        }
    }
}

function newDefaultTimezone(timezone){
    if(getCookie("cookieBanner") == "true"){
        setCookie("timezone", timezone, 31);
    }
}