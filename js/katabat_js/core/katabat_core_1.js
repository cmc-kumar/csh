/* DOCUMENT READY FUNCTIONS */

$(document).ready(function () {
    if (window.location.hostname.indexOf("loanservicing") == -1) {
        //tokens();
    }
    footnotes();
    if (document.getElementById("top_nav") != null) {
        snapOn("top_nav_menu_");
    }
    if (document.getElementById("right_nav") != null) {
        list_nav("right_nav");
    }
    if (document.getElementById("right_nav_mobile") != null) {
        list_nav("right_nav_mobile");
    }
    if (document.getElementById("search") != null) {
        defaultvalue();
    }
    if ($(".top_nav_width") != null) {
        $(".top_nav_width").addClass("ready");
    }
}
);
/* End DOCUMENT READY FUNCTIONS */

/* LEGACY COMPATIBILITY */

if (navigator.userAgent.match(/MSIE 9/)) {
    $("#footer img").attr("src", "../../images/global/logos/sallie_mae_logos/slm_logo_footer.png");
}

/* End LEGACY COMPATIBILITY */

/* SEARCH */
var arrPageURL = document.URL.split('/');
var searchURL = searchURL = arrPageURL[0] + '//' + arrPageURL[2] + '/search/?Ntt=';

function defaultvalue() {
    $('div#search_input #find').val("Find...");
}

function defaultvalueclear() {
    var defaultIdentifier = $('div#search_input #find');
    if (defaultIdentifier.val() == "Find...") {
        defaultIdentifier.val('');
    }
}

function submit_search() {
    if ($('div#search_input #find').val() != "Find..." && $('div#search_input #find').val() != "") {
        window.location = searchURL + $('div#search_input #find').val() + "&Ntk=all_fields&N=0";
    }
}

function submit_search_keyboard(e) {
    if ($('div#search_input #find').val() != "Find..." && $('div#search_input #find').val() != "") {
        if (e.which || e.keyCode) {
            if ((e.which == 13) || (e.keyCode == 13)) {
                window.location = searchURL + $('div#search_input #find').val() + "&Ntk=all_fields&N=0";
            }
        }
    }
}
/* End SEARCH */

/* Begin Mega Dropdown */

    top_nav_menu_ = new Array();
    top_nav_menu_[0] = "top_nav_menu_0";
    top_nav_menu_[1] = "top_nav_menu_1";
    top_nav_menu_[2] = "top_nav_menu_2";
    top_nav_menu_[3] = "top_nav_menu_3";
    top_nav_menu_[4] = "top_nav_menu_4";
    top_nav_menu_[5] = "top_nav_menu_5";

    snapOnSection = new Array();
    snapOnSection[0] = "/student-loans/";
    snapOnSection[1] = "/banking/";
    snapOnSection[2] = "/credit-cards/";
    snapOnSection[3] = "/insurance/";
    snapOnSection[4] = "/upromise-rewards/";
    snapOnSection[5] = "/plan-for-college/";

if (document.location.pathname.indexOf("/about/") != -1) {
    snapOnSection.splice(5, 1);

    snapOnSection[0] = "/about/";
    snapOnSection[1] = "/about/who-we-are/";
    snapOnSection[2] = "/about/newsroom/";
    snapOnSection[3] = "/about/customers/";
    snapOnSection[4] = "/about/investors/";
    snapOnSection[5] = "/about/careers/";
}



/* End Mega Dropdown */

/* Special Title for Contact Us*/
function specialTitle(x, y) {
    var selectMenu = document.getElementById(y)
    document.getElementById(x).innerHTML = selectMenu.options[selectMenu.selectedIndex].text.replace("*", "");
}
/* End Special Title for Contact Us*/

if (navigator.userAgent.match(/MSIE 10|MSIE 9|MSIE 8/)) {
    gifVsvg = "gif";
}
else {
    gifVsvg = "svg";
}

/* LOGIN LINKS */
function loginLinks() {
    if (document.location.href.indexOf("webtest") != -1) {
        window.location = "https://calmsmoke.salliemae.com/CALM/calm.do?sourceAppName=MYLSP";
}
else {
        window.location = "https://login.salliemae.com/CALM/calm.do?sourceAppName=MYLSP";
}
}

/* End LOGIN LINKS */

/* CROSS SELL */
/*
This method is used to call the ESSO application to update the user response & redirect to dest url if the url is not null
if lightbox is true - it will invoke the lightboxclose() method, this method implementation will be written in CWA application
Sample essoAdURL=https://enterpriseAdSSO.salliemae.com/EnterpriseAdSSO/crossSell.do?action=updateAdResponse
Update this url based on the env
Default height =980 width=800
*/

function processCrossSellResponse(destinationurl, isLightBox, action, isNewWindow, height,
width, locationcode, personId, subproductCode, creationID,
sourceId, pitchPresentedID) {

    var essoAdURL = 'https://enterpriseAdSSO.salliemae.com/EnterpriseAdSSO/crossSell.do?action=updateAdResponse';


    if (destinationurl != '') {
        var updateRedirectURL = essoAdURL + '&pid=' + personId + '&pitchpresentID=' + pitchPresentedID + '&subproductCode=' + subproductCode + '&userResponse=' + action + '&creationID=' + creationID + '&sourceId=' + sourceId + '&locationcode=' + locationcode + '&destURL=' + escape(destinationurl);
        if (height == '') {
            height = 980;
        }
        if (width == '') {
            width = 800;
        }
        if (isNewWindow == 'false') {
            window.location.href = updateRedirectURL;
        } else {
            var destWindow = window.open(updateRedirectURL, '_blank', 'menubar=yes,location=yes,scrollbars=yes,status=yes,toolbar=yes,resizable=yes,height=' + height + ',width=' + width);
            destWindow.focus();
        }

    }
    else {
        var updateURL = essoAdURL + '&pid=' + personId + '&pitchpresentID=' + pitchPresentedID + '&subproductCode=' + subproductCode + '&userResponse=' + action + '&creationID=' + creationID + '&sourceId=' + sourceId + '&locationcode=' + locationcode;
        postImage = new Image();
        postImage.src = updateURL;
    }

    if (isLightBox == 'Y') {
        lightboxClose();
    }

}
/* End CROSS SELL */