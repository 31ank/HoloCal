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

$(document).ready(function () {
    setupCalender();
    getData($('#timeselector')[0].value);
});

// Gets data from api
function getData(selectedTime) {
    $.getJSON('https://holocal.tv/alpha/api/api.php?entries=curweek&timezone=' + selectedTime)
        .done(function (data) {
            if($(window).width() > 1200){
                fillCalender(data);
                $('#loadedData').show();
            } else {
                $('#failedData').show();
            }
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
        document.getElementById(weekdays[counter]).innerHTML = weekdays[counter] + ' ' + zeroPad(date.getMonth() + 1, 2) + '.' + zeroPad(date.getDate(), 2);
        counter++;
    }
}

function fillCalender(data) {
    var day = new Date();
    day.setHours(0, 0, 0, 0);
    let weekStart = (day.addDays(-(day.getDay() - 1)));
    let weekEnd = weekStart.addDays(6);

    let weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let counter = 0;

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
            newEntry.className = "content " + weekdays[counter];
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
            counter++;
        }
        counter = 0;
    }
}

function debug() {
    $('#failedData').show();
    $('#loadedData').show();
    $('#loadingMessage').show();
}