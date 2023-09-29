query = window.location.search;
body = document.getElementsByTagName("body")[0];
androidScaleFix = false;
responsiveSupport = "";
if (navigator.userAgent.match(/MSIE/)) {
    document.getElementsByTagName("body")[0].className = body.className.replace("responsive", "");
    responsiveSupport = "no";
}

if (Object.hasOwnProperty.call(window, "ActiveXObject") && !window.ActiveXObject) {
    document.getElementsByTagName("body")[0].className = body.className.replace("responsive", "");
    responsiveSupport = "no";
}

$(document).ready(function () {

    if (document.cookie.indexOf("view_full_site") != -1 && responsiveSupport != "no") {
        body.className = body.className.replace("responsive", "");
        $(document).scrollTop(0);
    }
});

$.scrollbarWidth = function () {
    var parent, child, width;

    if (width === undefined && responsiveSupport != "no") {
        parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body');
        child = parent.children();
        width = child.innerWidth() - child.height(99).innerWidth();
        parent.remove();
    }

    return width;
};

    window.onorientationchange = function () {
        if (active_menu != "") {
            var active_stored = active_menu;
            active(active_menu);
                var t = setTimeout(function () { active(active_stored) }, 500)
        }
    }

    window.onresize = function () {
            if (document.documentElement.clientWidth + $.scrollbarWidth() > 640 && active_menu != "") {
                active(active_menu);
            }
    }

function viewFull() {
    var now = new Date();
    var time = now.getTime();
    time += 300 * 1000;
    now.setTime(time);
    document.cookie = "view_full_site=yes;" + "expires=" + now.toGMTString() + ";path=/;";
    $(document).scrollTop(0);
    window.location.reload(false);
}

function viewMobile() {
document.cookie = "view_full_site=no; path=/; expires=Sun, 01 Jan 1900 00:00:01 GMT";
}