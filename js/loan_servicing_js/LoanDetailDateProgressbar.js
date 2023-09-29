$(document).ready(function () {

    $("#progressbar").hide();
    updateProgress()



});



function updateProgress() {
    var startDate = '06/09/2014';// jQuery("#startDate").val();
    var endDate = '02/05/ 2016'; //jQuery("#endDate").val();

    if (startDate != "" && endDate != "") {
        var minDate = new Date(convertStringToDate(startDate));
        var today = new Date();
        var maxDate = new Date(convertStringToDate(endDate));

        var nbTotalDays = Math.floor((maxDate.getTime() - minDate.getTime()) / 86400000);
        var nbPastDays = Math.floor((today.getTime() - minDate.getTime()) / 86400000);

        var percent = nbPastDays / nbTotalDays * 100;

        // Extreme cases
        if (percent < 0) {
            percent = 0;
        } else if (percent > 100) {
            percent = 100;
        }

        $("#progressbar").reportprogress(percent);
    }
}



function convertStringToDate(stringdate) {
    // Internet Explorer does not like dashes in dates when converting, 
    // so lets use a regular expression to get the year, month, and day 
    var DateRegex = /([^-]*)\/([^-]*)\/([^-]*)/;
    var DateRegexResult = stringdate.match(DateRegex);
    var DateResult;
    var StringDateResult = "";

    // try creating a new date in a format that both Firefox and Internet Explorer understand
    try {
        DateResult = new Date(DateRegexResult[1] + "/" + DateRegexResult[2] + "/" + DateRegexResult[3]);
    }
    // if there is an error, catch it and try to set the date result using a simple conversion
    catch (err) {
        DateResult = new Date(stringdate);
    }

    // Date formating
    StringDateResult = (DateResult.getMonth() + 1) + "/" + (DateResult.getDate()) + "/" + (DateResult.getFullYear());

    return StringDateResult;
}

/*
 * Convert a date into a string.
 */
function convertDateToString(date) {
    // Add "0" ahead the month & day if needed
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    // Date formating
    StringDateResult = month + "/" + day + "/" + (date.getFullYear());

    return StringDateResult;
}




//Main Method
(function ($) {
    //Main Method
    $.fn.reportprogress = function (val, maxVal) {
        var max = 100;
        if (maxVal)
            max = maxVal;
        return this.each(
			function () {
			    var div = $(this);
			    var innerdiv = div.find(".progress");
			    $('.progress').hide();
			    if (innerdiv.length != 1) {
			        innerdiv = $("<div class='progress'></div>");
			        div.append("<div class='text'>&nbsp;</div>");
			        $("<span class='text'>&nbsp;</span>").css("width", div.width()).css("height", div.height()).appendTo(innerdiv);
			        div.append(innerdiv);
			    }
			    var width = Math.round(val / max * 100);

			    innerdiv.css("width", width + "%");
			    // div.find(".text").html(width + " %");

			    if (width > 25) {

			        $("#progressbar").show();

			    }

			}
		);
    };
})(jQuery);