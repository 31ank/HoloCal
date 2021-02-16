// Create API request
const zeroPad = (num, places) => String(num).padStart(places, '0');
Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
}

$(document).ready(function() {
    refetchData($('#timeselector')[0].value);
});

function refetchData(selectedTime){
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
    $("#timetableBody tr").remove()
    $.getJSON('https://holocal.tv/alpha/api/api.php?entries=curweek&timezone=' + selectedTime, function (data) {
        // loop through all 24 hours
        for (let index = 0; index < 24; index++) {
            // Insert time
            let newLine = '<tr>' + '<td>' + zeroPad(index, 2) + ':00</td>';
            // loop through all days in a week
            for (let date = weekStart; date <= weekEnd; date = date.addDays(1)) {
                newLine += '<td>'
                data.forEach(element => {
                    let streamDate = new Date(element['streamDate']);
                    let hoursCorrect = false;
                    date.setHours(index);
                    if(streamDate.getHours() == date.getHours()){
                        hoursCorrect = true;
                    }

                    let dateDay = date;
                    dateDay.setHours(0, 0, 0, 0);
                    let streamDay = streamDate;
                    streamDay.setHours(0, 0, 0, 0);
                    if (hoursCorrect && streamDay.getTime() == dateDay.getTime()) {
                        // new div element!
                        // if(element['streamName'] == 'ORiends Concert')
                        newLine += '<a href="' + element['streamURL'] + '" target="_blank">' + element['member'] + '</a> ' + element['streamName'] + '<br>';
                    }
                });
                newLine += '</td>'
            }
            $('#timetableBody').append(newLine + '</td></tr>');
        }

    })
    .done(function () {
        $('#loadedData').show();
    })
    .fail(function (jqxhr, textStatus, error) {
        $('#failedData').show();
        var err = textStatus + ", " + error;
        console.log( "Request Failed: " + err );
    })
    .always(function () {
        $('#loadingMessage').hide();
    });
}

function debug() {
    $('#failedData').show();
    $('#loadedData').show();
    $('#loadingMessage').show();
}