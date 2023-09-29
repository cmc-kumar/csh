var _a = new Object();
_a.getEvent = function (a) {
    return a || window.event
};
_a.getTarget = function (a) {
    return a.target || a.srcElement
};
_a.nodeById = function (a) {
    return document.getElementById(a)
};
_a.setStyle = function (b, a) {
    this.nodeById(b).style.display = a
};
_a.getAjaxObject = function () {
    var a;
    if (window.XMLHttpRequest) {
        a = new XMLHttpRequest()
    } else {
        a = new ActiveXObject("Microsoft.XMLHTTP")
    }
    return a
};
_a.windowOnLoad = function (a) {
    if (window.attachEvent) {
        window.attachEvent("onload", a)
    } else {
        if (window.addEventListener) {
            window.addEventListener("load", a, false)
        }
    }
};

function trim(b, a) {
    return ltrim(rtrim(b, a), a)
}

function ltrim(b, a) {
    a = a || "\\s";
    return b.replace(new RegExp("^[" + a + "]+", "g"), "")
}

function rtrim(b, a) {
    a = a || "\\s";
    return b.replace(new RegExp("[" + a + "]+$", "g"), "")
}

function disableEnterKey(c) {
    var b;
    if (window.event) {
        b = window.event.keyCode
    } else {
        b = c.which
    }
    if (b == 13) {
        if (startList == 0) {
            return true
        } else {
            var a = document.getElementById("autosuggest_value_" + startList).innerHTML;
            document.getElementById("atg_store_searchInput").value = a;
            return true
        }
    } else {
        return true
    }
}

function disableMiniEnterKey(c) {
    var b;
    if (window.event) {
        b = window.event.keyCode
    } else {
        b = c.which
    }
    if (b == 13) {
        if (startList == 0) {
            return true
        } else {
            var a = document.getElementById("autosuggest_value_" + startList).innerHTML;
            document.getElementById("atg_store_miniSearchInput").value = a;
            return true
        }
    } else {
        return true
    }
}

function autoSuggest() {
    document.getElementById("atg_store_searchInput").onkeypress = disableEnterKey;
    document.getElementById("atg_store_searchInput").onkeyup = autoSuggester
}
var timer = null;
var timer1 = null;

function autoSuggester(a) {
    document.getElementById("atg_store_searchSubmit").disabled = false;
    var b;
    if (window.event) {
        b = window.event.keyCode
    } else {
        b = a.which
    }
    if (b == 40) {
        arrowDown()
    } else {
        if (b == 38) {
            arrowUp()
        } else {
            if (timer != null) {
                clearTimeout(timer)
            }
            timer = setTimeout(reqAutoSuggester, 100)
        }
    }
}

function miniAutoSuggester(a) {
    document.getElementById("atg_store_miniSearchInput").disabled = false;
    var b;
    if (window.event) {
        b = window.event.keyCode
    } else {
        b = a.which
    }
    if (b == 40) {
        arrowDown()
    } else {
        if (b == 38) {
            arrowUp()
        } else {
            if (timer != null) {
                clearTimeout(timer)
            }
            timer1 = setTimeout(reqMiniAutoSuggester, 100)
        }
    }
}

function hideAutoSuggester() {
    document.getElementById("autocomplete_choices").className = "autocomplete"
}

function selectSearchValue(a) {
    document.getElementById("atg_store_searchInput").value = a;
    document.getElementById("autocomplete_choices").className = "autocomplete";
    document.getElementById("atg_store_searchSubmit").click()
}
var childrenNodesLength;
var startList = 0;
var mouseoverItem = 0;

function reqAutoSuggester() {
    var f = parseInt(document.getElementById("minAutoSuggestInputLength").value);
    var c = document.getElementById("atg_store_searchInput").value.length;
    if (c >= f) {
        var d = _a.getAjaxObject();
        d.onreadystatechange = function () {
            if (d.readyState == 4 && d.status == 200) {
                if (document.getElementById("autocomplete_choices")) {
                    document.getElementById("autocomplete_choices").innerHTML = d.responseText;
                    document.getElementById("autocomplete_choices").className = "autocomplete show_autocomplete"
                }
                if (document.getElementById("autocomplete_choices_list")) {
                    childrenNodesLength = document.getElementById("autocomplete_choices_list").getElementsByTagName("li").length
                }
            }
        };
        var b = document.getElementById("atg_store_searchInput").value;
        if (b && b.search("%") != -1) {
            document.getElementById("atg_store_searchInput").value = b.replace("%", "");
            b = b.replace("%", "")
        }
        var e = document.getElementById("autoSuggestServiceUrl").value;
        var e = document.getElementById("autoSuggestServiceUrl").value;
        var a = e + "&Ntt=" + b + "*";
        d.open("GET", a, true);
        d.send()
    }
}

function reqMiniAutoSuggester() {
    var f = parseInt(document.getElementById("minAutoSuggestInputLength").value);
    var c = document.getElementById("atg_store_miniSearchInput").value.length;
    if (c >= f) {
        var d = _a.getAjaxObject();
        d.onreadystatechange = function () {
            if (d.readyState == 4 && d.status == 200) {
                if (document.getElementById("miniAutocomplete_choices")) {
                    document.getElementById("miniAutocomplete_choices").innerHTML = d.responseText;
                    document.getElementById("miniAutocomplete_choices").className = "autocomplete show_autocomplete"
                }
                if (document.getElementById("autocomplete_choices_list")) {
                    childrenNodesLength = document.getElementById("autocomplete_choices_list").getElementsByTagName("li").length
                }
            }
        };
        var b = document.getElementById("atg_store_miniSearchInput").value;
        if (b && b.search("%") != -1) {
            document.getElementById("atg_store_miniSearchInput").value = b.replace("%", "");
            b = b.replace("%", "")
        }
        var e = document.getElementById("autoSuggestServiceUrl").value;
        var e = document.getElementById("autoSuggestServiceUrl").value;
        var a = e + "&Ntt=" + b + "*";
        d.open("GET", a, true);
        d.send()
    }
}

function mouseOverItem(b, a) {
    mouseoverItem = a;
    if (startList >= 1) {
        document.getElementById("autocomplete_choices_" + startList).className = "";
        startList = 0
    }
    b.className = "selected"
}

function mouseOutItem(a) {
    a.className = ""
}

function arrowDown() {
    if (mouseoverItem > 0) {
        document.getElementById("autocomplete_choices_" + mouseoverItem).className = "";
        mouseoverItem = 0
    }
    if (startList < childrenNodesLength) {
        currSelected = startList;
        startList = startList + 1;
        if (currSelected > 0) {
            document.getElementById("autocomplete_choices_" + currSelected).className = ""
        }
        document.getElementById("autocomplete_choices_" + startList).className = "selected"
    }
}

function arrowUp() {
    if (mouseoverItem > 0) {
        document.getElementById("autocomplete_choices_" + mouseoverItem).className = "";
        mouseoverItem = 0
    }
    if (startList >= 1) {
        currSelected = startList;
        startList = startList - 1;
        document.getElementById("autocomplete_choices_" + currSelected).className = "";
        if (startList >= 1) {
            document.getElementById("autocomplete_choices_" + startList).className = "selected"
        }
    }
}

function openPopup(a) {
    var b = window.open(a, "", "height=500,width=485,scrollbars=yes");
    if (window.focus) {
        b.focus()
    }
}

function emailSignup(a, e) {
    var c = true;
    var d = e.atg_store_signUpInput.value;
    if (trim(d) === "") {
        c = false;
        document.getElementById("joinAListHeader").style.display = "none";
        document.getElementById("joinAListText").style.display = "none";
        document.getElementById("joinAListResult").style.height = "52px";
        document.getElementById("joinAListResult").style.paddingTop = "20px";
        document.getElementById("joinAListResult").innerHTML = "Please Enter an valid Email Address "
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(d))) {
        c = false
    }
    if (c) {
        var b = _a.getAjaxObject();
        b.onreadystatechange = function () {
            if (b.readyState == 4 && b.status == 200) {
                document.getElementById("joinAListHeader").style.display = "none";
                document.getElementById("joinAListText").style.display = "none";
                document.getElementById("joinAListResult").style.height = "52px";
                document.getElementById("joinAListResult").style.paddingTop = "20px";
                document.getElementById("joinAListResult").innerHTML = "您已订阅成功！ "
            }
        };
        b.open("GET", a, true);
        b.send()
    }
}

function submitEmailAFormhandler(d) {
    var e = d.form;
    var c = "";
    var b = e.atg_store_signUpInput.value;
    var a = c + "/navigation/signUpPopup.jsp?signupEmail=" + b;
    emailSignup(a, e)
}
var selectedBrandInitial = "";

function loadAlphabets() {
    var a = document.getElementById("top-navigation");
    var b = a.getElementsByTagName("span");
    var c = document.getElementById("alphabetLinks");
    for (k = 0; k < b.length; k++) {
        if (b[k].className == "alp") {
            var d = document.createElement("a");
            var e = document.createElement("span");
            d.setAttribute("href", "#");
            d.setAttribute("onclick", 'selectBrand("' + b[k].innerHTML + '");return false;');
            d.setAttribute("class", "unselected");
            d.setAttribute("id", b[k].innerHTML);
            d.innerHTML = b[k].innerHTML;
            e.innerHTML = "&#46;";
            c.appendChild(d);
            c.appendChild(e)
        }
    }
}

function hideEmptyBrandColumns() {
    var c = document.getElementById("brandsData");
    if (c) {
        var a = c.getElementsByTagName("ul");
        for (var b = 0; b < a.length; b++) {
            if (a[b].getElementsByTagName("li").length >= 1) {
                a[b].style.display = "block"
            } else {
                a[b].style.display = "none"
            }
        }
    }
}

function selectBrand(d) {
    if (document.getElementById(d).className == "unselected") {
        if (selectedBrandInitial != "") {
            document.getElementById(selectedBrandInitial).className = "unselected"
        }
        selectedBrandInitial = d;
        document.getElementById(d).className = "selected";
        document.getElementById("selectedBrands").innerHTML = "";
        document.getElementById("selectedBrands").style.display = "block";
        document.getElementById("brandsData").style.display = "none";
        var c = document.getElementById("brandsData");
        var a = c.getElementsByTagName("li");
        for (i = 0; i < a.length; i++) {
            if (a[i].className == "odd " + d) {
                var b = document.createElement("li");
                b.innerHTML = a[i].innerHTML;
                document.getElementById("selectedBrands").appendChild(b)
            }
        }
    } else {
        if (selectedBrandInitial != "") {
            document.getElementById(selectedBrandInitial).className = "unselected"
        }
        document.getElementById(d).className = "unselected";
        document.getElementById("selectedBrands").style.display = "none";
        document.getElementById("brandsData").style.display = "block"
    }
}

function changeToPasswordType(c, b) {
    var a = document.getElementById(b);
    a.style.disabled = false;
    a.style.display = "";
    c.style.display = "none";
    c.style.disabled = true;
    a.focus()
}

function changeToTextTypeIfEmpty(a, d, b) {
    if (a.value != "") {
        return
    }
    var c = document.getElementById(d);
    c.value = b;
    c.style.disabled = false;
    c.style.display = "";
    a.style.display = "none";
    a.style.disabled = true
}

function autoDefaultCountry() {
    if (document.getElementById("atg_store_registerCountry").value == "") {
        document.getElementById("atg_store_registerCountry").value = "US";
        populateState(document.getElementById("atg_store_registerCountry"))
    }
}

function topMenuItem(b) {
    if (document.getElementById(b) != "") {
        var a = "topCat_" + b;
        if (document.getElementById(a)) {
            document.getElementById(a).style.color = "red"
        }
    }
}

function enableButton(c, a, b) {
    if (c.value != a && c.value != "") {
        document.getElementById("atg_store_searchSubmit").disabled = false
    } else {
        document.getElementById("atg_store_searchSubmit").disabled = true
    }
    if (c.value == "" && b == "blur") {
        c.value = a
    }
    if (c.value == a && b == "focus") {
        c.value = ""
    }
    if (b == "blur") {
        if (c.value != "" && c.value != a) {
            if (b != "blur") {
                document.getElementById("atg_store_search").removeAttribute("class")
            }
        } else {
            document.getElementById("atg_store_search").removeAttribute("class")
        }
    }
    if (b == "focus") {
        document.getElementById("atg_store_search").className = "active"
    }
}

function checkForPromoCode() {
    var b = document.getElementById("atg_store_promotionCodeInput");
    if (b.value == "ENTER CODE") {
        b.value = ""
    }
    var a = document.getElementsByTagName("textarea");
    for (m = 0; m < a.length; m++) {
        if (a[m].className == "textArea") {
            if (a[m].value == "Your gift message") {
                a[m].value = ""
            }
        }
    }
}

function clickPage() {
    if (document.getElementById("countryDrpDwn").className == "off active") {
        document.getElementById("countryDrpDwn").className = "off";
        document.getElementById("shipLangCurrDropDown").style.display = "none"
    }
}

function showMenu(b, a) {
    if (document.getElementById("countryDrpDwn").className == "off active") {
        document.getElementById("countryDrpDwn").className = "off";
        document.getElementById("shipLangCurrDropDown").style.display = "none"
    } else {
        if (document.getElementById("countryDrpDwn").className == "off") {
            $("#cart").removeClass("active");
            $(this).css("background-position", "-9px -30px");
            $("#cart .cart.dropdown").hide();
            document.getElementById("countryDrpDwn").className = "off active";
            document.getElementById("shipLangCurrDropDown").style.display = "block"
        }
    }
    if (b.stopPropagation) {
        b.stopPropagation()
    } else {
        b.cancelBubble = true
    }
}

function keepDisplayingMenu(b, a) {
    if (b.stopPropagation) {
        b.stopPropagation()
    } else {
        b.cancelBubble = true
    }
}

function showDiv() {
    if (document.getElementById("creditCardAddressAdd").style.display == "none") {
        jQuery("#creditCardAddressAdd").slideDown("slow");
        var b = document.getElementsByName("address");
        var a = b.length;
        for (var c = 0; c < a; c++) {
            b[c].disabled = true;
            b[c].checked = false
        }
    }
    return false
}

function scrollWindow() {
    var a = document.getElementById("formData").offsetTop + 120;
    var b = "slow";
    jQuery("html:not(:animated),body:not(:animated)").animate({
        scrollTop: a
    }, b);
    return false
}

function removeClicked(a) {
    if (document.getElementById("giftId_" + a)) {
        var b = document.getElementById("giftId_" + a);
        document.getElementById("removeId_" + b.value).click()
    }
}

function updateMonths(a, b) {
    var f = a;
    var e = document.getElementById(b);
    for (var d, c = 1; d = e.options[c]; c++) {
        if (d.value == f) {
            e.selectedIndex = c;
            break
        }
    }
}

function updateYears(a, b) {
    var f = a;
    var e = document.getElementById(b);
    for (var d, c = 1; d = e.options[c]; c++) {
        if (d.value == f) {
            e.selectedIndex = c;
            break
        }
    }
}

function updateDay(a, b) {
    var f = a;
    var e = document.getElementById(b);
    for (var d, c = 1; d = e.options[c]; c++) {
        if (d.value == f) {
            e.selectedIndex = c;
            break
        }
    }
}

function checkForDefaultText() {
    if (document.getElementById("atg_store_otherTelephoneInput")) {
        var f = document.getElementById("atg_store_otherTelephoneInput").value;
        if (f == "Other Phone") {
            document.getElementById("atg_store_otherTelephoneInput").value = ""
        }
    }
    if (document.getElementById("shippingAddrNicknameInput")) {
        var e = document.getElementById("shippingAddrNicknameInput").value;
        if (e == "Address Nickname*") {
            document.getElementById("shippingAddrNicknameInput").value = ""
        }
    }
    if (document.getElementById("atg_store_streetAddressOptionalInput")) {
        var b = document.getElementById("atg_store_streetAddressOptionalInput").value;
        if (b == "Street Address") {
            document.getElementById("atg_store_streetAddressOptionalInput").value = ""
        }
    }
    if (document.getElementById("atg_store_addressAddSaveAddressInput")) {
        if (document.getElementById("atg_store_addressAddSaveAddressInput").checked == false) {
            var c = document.getElementById("getCount");
            var a = document.getElementById("atg_store_nickNameInput");
            a.value = c.value
        }
    }
    if (document.getElementById("shippingAddrNicknameInput")) {
        if (document.getElementById("shippingAddrNicknameInput").value == "Address Nickname*") {
            document.getElementById("shippingAddrNicknameInput").value = ""
        }
    }
    if (document.getElementById("atg_store_citizenshipCodeInput")) {
        var d = document.getElementById("atg_store_citizenshipCodeInput").value;
        if (d == "Citizenship Code*" || d == "Citizenship Code" || d == "ID Number" || d == "ID Number*") {
            document.getElementById("atg_store_citizenshipCodeInput").value = ""
        }
    }
    if (document.getElementById("AddressBookNicknameInput")) {
        if (document.getElementById("AddressBookNicknameInput").value == "Address Nickname*") {
            document.getElementById("AddressBookNicknameInput").value = ""
        }
    }
}

function changeFormActionOnSumbit(l, c, a, g, h) {
    var b = l;
    var o = c;
    var f = a;
    var e = g;
    var d = h;
    var n = document.getElementById("language").selectedIndex;
    var j = document.getElementById("language").options;
    document.languageSelectionForm.action = b;
    if (j[n].value == "Chinese") {
        document.languageSelectionForm.action = o
    } else {
        if (j[n].value == "Korean") {
            document.languageSelectionForm.action = f
        } else {
            if (j[n].value == "Taiwanese") {
                document.languageSelectionForm.action = e
            } else {
                if (j[n].value == "Japanese") {
                    document.languageSelectionForm.action = d
                }
            }
        }
    }
}

function submitCountrySel(d, n, h, j, g) {
    var o = document.getElementById("language").selectedIndex;
    var l = document.getElementById("language").options;
    if (l[o].value == "Chinese") {
        d = n
    } else {
        if (l[o].value == "Korean") {
            d = h
        } else {
            if (l[o].value == "Taiwanese") {
                d = j
            } else {
                if (l[o].value == "Japanese") {
                    d = g
                }
            }
        }
    }
    var e = document.getElementsByClassName("countries");
    var f = e.options[e.selectedIndex].value;
    var c = document.getElementById("language");
    var b = c.options[c.selectedIndex].value;
    var q = document.getElementById("currChange");
    var p = q.options[q.selectedIndex].text;
    var a = document.getElementById("source").value;
    if (d.indexOf("locale") != -1) {
        d = d.substring(0, d.indexOf("locale"))
    }
    if (d.indexOf("countries") != -1) {
        d = d.substring(0, d.indexOf("countries"))
    }
    if (d.indexOf("source") != -1) {
        d = d.substring(0, d.indexOf("&source"))
    }
    if (d.indexOf("?") != -1) {
        document.languageSelectionForm.action = d + "countries=" + f + "&language=" + b + "&currency=" + p + "&source=" + a
    } else {
        document.languageSelectionForm.action = d + "?countries=" + f + "&language=" + b + "&currency=" + p + "&source=" + a
    }
}

function SrchBtnCkd(a) {
    a = a || window.event;
    if (a.stopPropagation) {
        a.stopPropagation()
    } else {
        a.cancelBubble = true
    }
}
$(document).ready(function () {
    var b = $("input, textarea, select").not(":input[type=button], :input[type=submit], :input[type=reset]");
    $(b).each(function () {
        var e = this.value;
        //$(this).focus(function () {
        //    if (this.value == e) {
        //        this.value = ""
        //    }
        //});
        //$(this).blur(function () {
        //    if (this.value == "") {
        //        this.value = e
        //    }
        //})
    });
    $("textarea.clear-message").focus(function () {
        if (this.value === this.defaultValue) {
            this.value = ""
        }
    }).blur(function () {
        if (this.value === "") {
            this.value = this.defaultValue
        }
    });
    $("ul.tabs li").click(function () {
        $("ul.tabs li").removeClass("active");
        $(this).addClass("active");
        var f = ($(this).width()) / 2 + 13;
        var g = $(this).position().left + f;
        $(".active-triangle").css("left", g);
        $(".tab-content").hide();
        var e = $(this).attr("rel");
        $("#" + e).fadeIn()
    });
    var d = $(".tabset .panel"),
        a = $("ul.tabs li a"),
        c;
    d.hide();
    $("ul.tabs li:first a").addClass("selected").show();
    d.first().show();
    a.click(function () {
        var f = $(this);
        a.removeClass("selected");
        $("li.tab").removeClass("active");
        f.addClass("selected");
        f.parent("li.tab").addClass("active");
        d.hide();
        var e = f.attr("href");
        $(e).fadeIn("fast");
        return false
    });
    $("#country-dropdown, #cart .cart.dropdown").click(function (f) {
        f.stopPropagation()
    });
    $("#cart").click(function (f) {
        f.preventDefault();
        $(this).toggleClass("active");
        $("#cartDropDwn .dropdown_container").show();
        $("#cart .cart.dropdown").toggle()
    });
    $(document).click(function (f) {
        if (f.target.id !== "richCartTrigger" && f.target.id !== "search" && f.target.id !== "shop-cart") {
            $("#cart").removeClass("active");
            $(this).css("background-position", "-9px -30px");
            $("#cart .cart.dropdown").hide()
        }
    });
    $(document).on("click", "#onlyTopNav ul li.small-only .dropdown", function (f) {
        f.stopPropagation()
    });
    $(document).on("click", "#search", function (f) {
        f.preventDefault();
        $("#onlyTopNav #shop-cart").removeClass("active");
        $("#shop-cart").next(".dropdown").hide();
        $(this).toggleClass("active");
        $(this).next(".dropdown").css("left", "-441px");
        $(this).next(".dropdown").toggle();
        return false
    });
    $(document).on("click", "#shop-cart", function (f) {
        f.preventDefault();
        $("#onlyTopNav #search").removeClass("active");
        $("#search").next(".dropdown").hide();
        $(this).toggleClass("active");
        $(this).next(".dropdown").toggle();
        $(this).next(".dropdown").css("left", "-263px");
        return false
    });
    $(document).click(function () {
        $("#onlyTopNav ul li a").removeClass("active");
        $("#onlyTopNav ul li.small-only .dropdown").hide()
    });
    $(document).on("mouseenter", "#onlyTopNav .menu-item", function () {
        $("#onlyTopNav ul li.small-only .dropdown").hide();
        $("#onlyTopNav ul li.small-only a").removeClass("active")
    });
    $(document).on("keyup", "#atg_store_miniSearchInput", function (f) {
        miniAutoSuggester(f)
    });
    $(document).on("keypress", "#atg_store_miniSearchInput", function (f) {
        disableMiniEnterKey(f)
    });
    $(".countries").msDropdown({
        rowHeight: 40
    });
    $("#language").msDropdown();
    $("#currChange").msDropdown()
});
/* fancyBox v2.1.4 fancyapps.com | fancyapps.com/fancybox/#license */
(function (c, o, j, a) {
    var d = j(c),
        g = j(o),
        u = j.fancybox = function () {
            u.open.apply(this, arguments)
        },
        A = navigator.userAgent.match(/msie/),
        y = null,
        E = o.createTouch !== a,
        D = function (b) {
            return b && b.hasOwnProperty && b instanceof j
        },
        e = function (b) {
            return b && "string" === j.type(b)
        },
        B = function (b) {
            return e(b) && 0 < b.indexOf("%")
        },
        h = function (b, l) {
            var f = parseInt(b, 10) || 0;
            l && B(b) && (f *= u.getViewport()[l] / 100);
            return Math.ceil(f)
        },
        v = function (l, f) {
            return h(l, f) + "px"
        };
    j.extend(u, {
        version: "2.1.4",
        defaults: {
            padding: 15,
            margin: 20,
            width: 800,
            height: 600,
            minWidth: 100,
            minHeight: 100,
            maxWidth: 9999,
            maxHeight: 9999,
            autoSize: !0,
            autoHeight: !1,
            autoWidth: !1,
            autoResize: !0,
            autoCenter: !E,
            fitToView: !0,
            aspectRatio: !1,
            topRatio: 0.5,
            leftRatio: 0.5,
            scrolling: "auto",
            wrapCSS: "",
            arrows: !0,
            closeBtn: !0,
            closeClick: !1,
            nextClick: !1,
            mouseWheel: !0,
            autoPlay: !1,
            playSpeed: 3000,
            preload: 3,
            modal: !1,
            loop: !0,
            ajax: {
                dataType: "html",
                headers: {
                    "X-fancyBox": !0
                }
            },
            iframe: {
                scrolling: "auto",
                preload: !0
            },
            swf: {
                wmode: "transparent",
                allowfullscreen: "true",
                allowscriptaccess: "always"
            },
            keys: {
                next: {
                    13: "left",
                    34: "up",
                    39: "left",
                    40: "up"
                },
                prev: {
                    8: "right",
                    33: "down",
                    37: "right",
                    38: "down"
                },
                close: [27],
                play: [32],
                toggle: [70]
            },
            direction: {
                next: "left",
                prev: "right"
            },
            scrollOutside: !0,
            index: 0,
            type: null,
            href: null,
            content: null,
            title: null,
            tpl: {
                wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
                image: '<img class="fancybox-image" src="{href}" alt="" />',
                iframe: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + (A ? ' allowtransparency="true"' : "") + "></iframe>",
                error: '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
                closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
                next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
                prev: '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
            },
            openEffect: "fade",
            openSpeed: 250,
            openEasing: "swing",
            openOpacity: !0,
            openMethod: "zoomIn",
            closeEffect: "fade",
            closeSpeed: 250,
            closeEasing: "swing",
            closeOpacity: !0,
            closeMethod: "zoomOut",
            nextEffect: "elastic",
            nextSpeed: 250,
            nextEasing: "swing",
            nextMethod: "changeIn",
            prevEffect: "elastic",
            prevSpeed: 250,
            prevEasing: "swing",
            prevMethod: "changeOut",
            helpers: {
                overlay: !0,
                title: !0
            },
            onCancel: j.noop,
            beforeLoad: j.noop,
            afterLoad: j.noop,
            beforeShow: j.noop,
            afterShow: j.noop,
            beforeChange: j.noop,
            beforeClose: j.noop,
            afterClose: j.noop
        },
        group: {},
        opts: {},
        previous: null,
        coming: null,
        current: null,
        isActive: !1,
        isOpen: !1,
        isOpened: !1,
        wrap: null,
        skin: null,
        outer: null,
        inner: null,
        player: {
            timer: null,
            isActive: !1
        },
        ajaxLoad: null,
        imgPreload: null,
        transitions: {},
        helpers: {},
        open: function (b, f) {
            if (b && (j.isPlainObject(f) || (f = {}), !1 !== u.close(!0))) {
                return j.isArray(b) || (b = D(b) ? j(b).get() : [b]), j.each(b, function (w, x) {
                    var q = {},
                        t, s, r, n, p;
                    "object" === j.type(x) && (x.nodeType && (x = j(x)), D(x) ? (q = {
                        href: x.data("fancybox-href") || x.attr("href"),
                        title: x.data("fancybox-title") || x.attr("title"),
                        isDom: !0,
                        element: x
                    }, j.metadata && j.extend(!0, q, x.metadata())) : q = x);
                    t = f.href || q.href || (e(x) ? x : null);
                    s = f.title !== a ? f.title : q.title || "";
                    n = (r = f.content || q.content) ? "html" : f.type || q.type;
                    !n && q.isDom && (n = x.data("fancybox-type"), n || (n = (n = x.prop("class").match(/fancybox\.(\w+)/)) ? n[1] : null));
                    e(t) && (n || (u.isImage(t) ? n = "image" : u.isSWF(t) ? n = "swf" : "#" === t.charAt(0) ? n = "inline" : e(x) && (n = "html", r = x)), "ajax" === n && (p = t.split(/\s+/, 2), t = p.shift(), p = p.shift()));
                    r || ("inline" === n ? t ? r = j(e(t) ? t.replace(/.*(?=#[^\s]+$)/, "") : t) : q.isDom && (r = x) : "html" === n ? r = t : !n && (!t && q.isDom) && (n = "inline", r = x));
                    j.extend(q, {
                        href: t,
                        type: n,
                        content: r,
                        title: s,
                        selector: p
                    });
                    b[w] = q
                }), u.opts = j.extend(!0, {}, u.defaults, f), f.keys !== a && (u.opts.keys = f.keys ? j.extend({}, u.defaults.keys, f.keys) : !1), u.group = b, u._start(u.opts.index)
            }
        },
        cancel: function () {
            var b = u.coming;
            b && !1 !== u.trigger("onCancel") && (u.hideLoading(), u.ajaxLoad && u.ajaxLoad.abort(), u.ajaxLoad = null, u.imgPreload && (u.imgPreload.onload = u.imgPreload.onerror = null), b.wrap && b.wrap.stop(!0, !0).trigger("onReset").remove(), u.coming = null, u.current || u._afterZoomOut(b))
        },
        close: function (b) {
            u.cancel();
            !1 !== u.trigger("beforeClose") && (u.unbindEvents(), u.isActive && (!u.isOpen || !0 === b ? (j(".fancybox-wrap").stop(!0).trigger("onReset").remove(), u._afterZoomOut()) : (u.isOpen = u.isOpened = !1, u.isClosing = !0, j(".fancybox-item, .fancybox-nav").remove(), u.wrap.stop(!0, !0).removeClass("fancybox-opened"), u.transitions[u.current.closeMethod]())))
        },
        play: function (b) {
            var l = function () {
                    clearTimeout(u.player.timer)
                },
                f = function () {
                    l();
                    u.current && u.player.isActive && (u.player.timer = setTimeout(u.next, u.current.playSpeed))
                },
                n = function () {
                    l();
                    j("body").unbind(".player");
                    u.player.isActive = !1;
                    u.trigger("onPlayEnd")
                };
            if (!0 === b || !u.player.isActive && !1 !== b) {
                if (u.current && (u.current.loop || u.current.index < u.group.length - 1)) {
                    u.player.isActive = !0, j("body").bind({
                        "afterShow.player onUpdate.player": f,
                        "onCancel.player beforeClose.player": n,
                        "beforeLoad.player": l
                    }), f(), u.trigger("onPlayStart")
                }
            } else {
                n()
            }
        },
        next: function (b) {
            var f = u.current;
            f && (e(b) || (b = f.direction.next), u.jumpto(f.index + 1, b, "next"))
        },
        prev: function (b) {
            var f = u.current;
            f && (e(b) || (b = f.direction.prev), u.jumpto(f.index - 1, b, "prev"))
        },
        jumpto: function (b, l, f) {
            var n = u.current;
            n && (b = h(b), u.direction = l || n.direction[b >= n.index ? "next" : "prev"], u.router = f || "jumpto", n.loop && (0 > b && (b = n.group.length + b % n.group.length), b %= n.group.length), n.group[b] !== a && (u.cancel(), u._start(b)))
        },
        reposition: function (b, n) {
            var l = u.current,
                p = l ? l.wrap : null,
                f;
            p && (f = u._getPosition(n), b && "scroll" === b.type ? (delete f.position, p.stop(!0, !0).animate(f, 200)) : (p.css(f), l.pos = j.extend({}, l.dim, f)))
        },
        update: function (b) {
            var l = b && b.type,
                f = !l || "orientationchange" === l;
            f && (clearTimeout(y), y = null);
            u.isOpen && !y && (y = setTimeout(function () {
                var n = u.current;
                n && !u.isClosing && (u.wrap.removeClass("fancybox-tmp"), (f || "load" === l || "resize" === l && n.autoResize) && u._setDimension(), "scroll" === l && n.canShrink || u.reposition(b), u.trigger("onUpdate"), y = null)
            }, f && !E ? 0 : 300))
        },
        toggle: function (b) {
            u.isOpen && (u.current.fitToView = "boolean" === j.type(b) ? b : !u.current.fitToView, E && (u.wrap.removeAttr("style").addClass("fancybox-tmp"), u.trigger("onUpdate")), u.update())
        },
        hideLoading: function () {
            g.unbind(".loading");
            j("#fancybox-loading").remove()
        },
        showLoading: function () {
            var b, f;
            u.hideLoading();
            b = j('<div id="fancybox-loading"><div></div></div>').click(u.cancel).appendTo("body");
            g.bind("keydown.loading", function (l) {
                if (27 === (l.which || l.keyCode)) {
                    l.preventDefault(), u.cancel()
                }
            });
            u.defaults.fixed || (f = u.getViewport(), b.css({
                position: "absolute",
                top: 0.5 * f.h + f.y,
                left: 0.5 * f.w + f.x
            }))
        },
        getViewport: function () {
            var b = u.current && u.current.locked || !1,
                f = {
                    x: d.scrollLeft(),
                    y: d.scrollTop()
                };
            b ? (f.w = b[0].clientWidth, f.h = b[0].clientHeight) : (f.w = E && c.innerWidth ? c.innerWidth : d.width(), f.h = E && c.innerHeight ? c.innerHeight : d.height());
            return f
        },
        unbindEvents: function () {
            u.wrap && D(u.wrap) && u.wrap.unbind(".fb");
            g.unbind(".fb");
            d.unbind(".fb")
        },
        bindEvents: function () {
            var b = u.current,
                f;
            b && (d.bind("orientationchange.fb" + (E ? "" : " resize.fb") + (b.autoCenter && !b.locked ? " scroll.fb" : ""), u.update), (f = b.keys) && g.bind("keydown.fb", function (n) {
                var p = n.which || n.keyCode,
                    l = n.target || n.srcElement;
                if (27 === p && u.coming) {
                    return !1
                }!n.ctrlKey && (!n.altKey && !n.shiftKey && !n.metaKey && (!l || !l.type && !j(l).is("[contenteditable]"))) && j.each(f, function (r, q) {
                    if (1 < b.group.length && q[p] !== a) {
                        return u[r](q[p]), n.preventDefault(), !1
                    }
                    if (-1 < j.inArray(p, q)) {
                        return u[r](), n.preventDefault(), !1
                    }
                })
            }), j.fn.mousewheel && b.mouseWheel && u.wrap.bind("mousewheel.fb", function (r, s, l, q) {
                for (var p = j(r.target || null), n = !1; p.length && !n && !p.is(".fancybox-skin") && !p.is(".fancybox-wrap");) {
                    n = p[0] && !(p[0].style.overflow && "hidden" === p[0].style.overflow) && (p[0].clientWidth && p[0].scrollWidth > p[0].clientWidth || p[0].clientHeight && p[0].scrollHeight > p[0].clientHeight), p = j(p).parent()
                }
                if (0 !== s && !n && 1 < u.group.length && !b.canShrink) {
                    if (0 < q || 0 < l) {
                        u.prev(0 < q ? "down" : "left")
                    } else {
                        if (0 > q || 0 > l) {
                            u.next(0 > q ? "up" : "right")
                        }
                    }
                    r.preventDefault()
                }
            }))
        },
        trigger: function (b, l) {
            var f, n = l || u.coming || u.current;
            if (n) {
                j.isFunction(n[b]) && (f = n[b].apply(n, Array.prototype.slice.call(arguments, 1)));
                if (!1 === f) {
                    return !1
                }
                n.helpers && j.each(n.helpers, function (q, p) {
                    p && (u.helpers[q] && j.isFunction(u.helpers[q][b])) && (p = j.extend(!0, {}, u.helpers[q].defaults, p), u.helpers[q][b](p, n))
                });
                j.event.trigger(b + ".fb")
            }
        },
        isImage: function (b) {
            return e(b) && b.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp)((\?|#).*)?$)/i)
        },
        isSWF: function (b) {
            return e(b) && b.match(/\.(swf)((\?|#).*)?$/i)
        },
        _start: function (b) {
            var l = {},
                f, n;
            b = h(b);
            f = u.group[b] || null;
            if (!f) {
                return !1
            }
            l = j.extend(!0, {}, u.opts, f);
            f = l.margin;
            n = l.padding;
            "number" === j.type(f) && (l.margin = [f, f, f, f]);
            "number" === j.type(n) && (l.padding = [n, n, n, n]);
            l.modal && j.extend(!0, l, {
                closeBtn: !1,
                closeClick: !1,
                nextClick: !1,
                arrows: !1,
                mouseWheel: !1,
                keys: null,
                helpers: {
                    overlay: {
                        closeClick: !1
                    }
                }
            });
            l.autoSize && (l.autoWidth = l.autoHeight = !0);
            "auto" === l.width && (l.autoWidth = !0);
            "auto" === l.height && (l.autoHeight = !0);
            l.group = u.group;
            l.index = b;
            u.coming = l;
            if (!1 === u.trigger("beforeLoad")) {
                u.coming = null
            } else {
                n = l.type;
                f = l.href;
                if (!n) {
                    return u.coming = null, u.current && u.router && "jumpto" !== u.router ? (u.current.index = b, u[u.router](u.direction)) : !1
                }
                u.isActive = !0;
                if ("image" === n || "swf" === n) {
                    l.autoHeight = l.autoWidth = !1, l.scrolling = "visible"
                }
                "image" === n && (l.aspectRatio = !0);
                "iframe" === n && E && (l.scrolling = "scroll");
                l.wrap = j(l.tpl.wrap).addClass("fancybox-" + (E ? "mobile" : "desktop") + " fancybox-type-" + n + " fancybox-tmp " + l.wrapCSS).appendTo(l.parent || "body");
                j.extend(l, {
                    skin: j(".fancybox-skin", l.wrap),
                    outer: j(".fancybox-outer", l.wrap),
                    inner: j(".fancybox-inner", l.wrap)
                });
                j.each(["Top", "Right", "Bottom", "Left"], function (q, p) {
                    l.skin.css("padding" + p, v(l.padding[q]))
                });
                u.trigger("onReady");
                if ("inline" === n || "html" === n) {
                    if (!l.content || !l.content.length) {
                        return u._error("content")
                    }
                } else {
                    if (!f) {
                        return u._error("href")
                    }
                }
                "image" === n ? u._loadImage() : "ajax" === n ? u._loadAjax() : "iframe" === n ? u._loadIframe() : u._afterLoad()
            }
        },
        _error: function (b) {
            j.extend(u.coming, {
                type: "html",
                autoWidth: !0,
                autoHeight: !0,
                minWidth: 0,
                minHeight: 0,
                scrolling: "no",
                hasError: b,
                content: u.coming.tpl.error
            });
            u._afterLoad()
        },
        _loadImage: function () {
            var b = u.imgPreload = new Image;
            b.onload = function () {
                this.onload = this.onerror = null;
                u.coming.width = this.width;
                u.coming.height = this.height;
                u._afterLoad()
            };
            b.onerror = function () {
                this.onload = this.onerror = null;
                u._error("image")
            };
            b.src = u.coming.href;
            !0 !== b.complete && u.showLoading()
        },
        _loadAjax: function () {
            var b = u.coming;
            u.showLoading();
            u.ajaxLoad = j.ajax(j.extend({}, b.ajax, {
                url: b.href,
                error: function (f, l) {
                    u.coming && "abort" !== l ? u._error("ajax", f) : u.hideLoading()
                },
                success: function (l, f) {
                    "success" === f && (b.content = l, u._afterLoad())
                }
            }))
        },
        _loadIframe: function () {
            var b = u.coming,
                f = j(b.tpl.iframe.replace(/\{rnd\}/g, (new Date).getTime())).attr("scrolling", E ? "auto" : b.iframe.scrolling).attr("src", b.href);
            j(b.wrap).bind("onReset", function () {
                try {
                    j(this).find("iframe").hide().attr("src", "//about:blank").end().empty()
                } catch (l) {}
            });
            b.iframe.preload && (u.showLoading(), f.one("load", function () {
                j(this).data("ready", 1);
                E || j(this).bind("load.fb", u.update);
                j(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show();
                u._afterLoad()
            }));
            b.content = f.appendTo(b.inner);
            b.iframe.preload || u._afterLoad()
        },
        _preloadImages: function () {
            var b = u.group,
                q = u.current,
                p = b.length,
                r = q.preload ? Math.min(q.preload, p - 1) : 0,
                n, l;
            for (l = 1; l <= r; l += 1) {
                n = b[(q.index + l) % p], "image" === n.type && n.href && ((new Image).src = n.href)
            }
        },
        _afterLoad: function () {
            var b = u.coming,
                q = u.current,
                p, r, f, n, l;
            u.hideLoading();
            if (b && !1 !== u.isActive) {
                if (!1 === u.trigger("afterLoad", b, q)) {
                    b.wrap.stop(!0).trigger("onReset").remove(), u.coming = null
                } else {
                    q && (u.trigger("beforeChange", q), q.wrap.stop(!0).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove());
                    u.unbindEvents();
                    p = b.content;
                    r = b.type;
                    f = b.scrolling;
                    j.extend(u, {
                        wrap: b.wrap,
                        skin: b.skin,
                        outer: b.outer,
                        inner: b.inner,
                        current: b,
                        previous: q
                    });
                    n = b.href;
                    switch (r) {
                    case "inline":
                    case "ajax":
                    case "html":
                        b.selector ? p = j("<div>").html(p).find(b.selector) : D(p) && (p.data("fancybox-placeholder") || p.data("fancybox-placeholder", j('<div class="fancybox-placeholder"></div>').insertAfter(p).hide()), p = p.show().detach(), b.wrap.bind("onReset", function () {
                            j(this).find(p).length && p.hide().replaceAll(p.data("fancybox-placeholder")).data("fancybox-placeholder", !1)
                        }));
                        break;
                    case "image":
                        p = b.tpl.image.replace("{href}", n);
                        break;
                    case "swf":
                        p = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + n + '"></param>', l = "", j.each(b.swf, function (t, s) {
                            p += '<param name="' + t + '" value="' + s + '"></param>';
                            l += " " + t + '="' + s + '"'
                        }), p += '<embed src="' + n + '" type="application/x-shockwave-flash" width="100%" height="100%"' + l + "></embed></object>"
                    }(!D(p) || !p.parent().is(b.inner)) && b.inner.append(p);
                    u.trigger("beforeShow");
                    b.inner.css("overflow", "yes" === f ? "scroll" : "no" === f ? "hidden" : f);
                    u._setDimension();
                    u.reposition();
                    u.isOpen = !1;
                    u.coming = null;
                    u.bindEvents();
                    if (u.isOpened) {
                        if (q.prevMethod) {
                            u.transitions[q.prevMethod]()
                        }
                    } else {
                        j(".fancybox-wrap").not(b.wrap).stop(!0).trigger("onReset").remove()
                    }
                    u.transitions[u.isOpened ? b.nextMethod : b.openMethod]();
                    u._preloadImages()
                }
            }
        },
        _setDimension: function () {
            var ad = u.getViewport(),
                ab = 0,
                aa = !1,
                ac = !1,
                aa = u.wrap,
                W = u.skin,
                Z = u.inner,
                Y = u.current,
                ac = Y.width,
                X = Y.height,
                V = Y.minWidth,
                J = Y.minHeight,
                U = Y.maxWidth,
                I = Y.maxHeight,
                N = Y.scrolling,
                R = Y.scrollOutside ? Y.scrollbarWidth : 0,
                f = Y.margin,
                T = h(f[1] + f[3]),
                P = h(f[0] + f[2]),
                b, S, L, M, Q, F, O, K, x;
            aa.add(W).add(Z).width("auto").height("auto").removeClass("fancybox-tmp");
            f = h(W.outerWidth(!0) - W.width());
            b = h(W.outerHeight(!0) - W.height());
            S = T + f;
            L = P + b;
            M = B(ac) ? (ad.w - S) * h(ac) / 100 : ac;
            Q = B(X) ? (ad.h - L) * h(X) / 100 : X;
            if ("iframe" === Y.type) {
                if (x = Y.content, Y.autoHeight && 1 === x.data("ready")) {
                    try {
                        x[0].contentWindow.document.location && (Z.width(M).height(9999), F = x.contents().find("body"), R && F.css("overflow-x", "hidden"), Q = F.height())
                    } catch (l) {}
                }
            } else {
                if (Y.autoWidth || Y.autoHeight) {
                    Z.addClass("fancybox-tmp"), Y.autoWidth || Z.width(M), Y.autoHeight || Z.height(Q), Y.autoWidth && (M = Z.width()), Y.autoHeight && (Q = Z.height()), Z.removeClass("fancybox-tmp")
                }
            }
            ac = h(M);
            X = h(Q);
            K = M / Q;
            V = h(B(V) ? h(V, "w") - S : V);
            U = h(B(U) ? h(U, "w") - S : U);
            J = h(B(J) ? h(J, "h") - L : J);
            I = h(B(I) ? h(I, "h") - L : I);
            F = U;
            O = I;
            Y.fitToView && (U = Math.min(ad.w - S, U), I = Math.min(ad.h - L, I));
            S = ad.w - T;
            P = ad.h - P;
            Y.aspectRatio ? (ac > U && (ac = U, X = h(ac / K)), X > I && (X = I, ac = h(X * K)), ac < V && (ac = V, X = h(ac / K)), X < J && (X = J, ac = h(X * K))) : (ac = Math.max(V, Math.min(ac, U)), Y.autoHeight && "iframe" !== Y.type && (Z.width(ac), X = Z.height()), X = Math.max(J, Math.min(X, I)));
            if (Y.fitToView) {
                if (Z.width(ac).height(X), aa.width(ac + f), ad = aa.width(), T = aa.height(), Y.aspectRatio) {
                    for (;
                        (ad > S || T > P) && (ac > V && X > J) && !(19 < ab++);) {
                        X = Math.max(J, Math.min(I, X - 10)), ac = h(X * K), ac < V && (ac = V, X = h(ac / K)), ac > U && (ac = U, X = h(ac / K)), Z.width(ac).height(X), aa.width(ac + f), ad = aa.width(), T = aa.height()
                    }
                } else {
                    ac = Math.max(V, Math.min(ac, ac - (ad - S))), X = Math.max(J, Math.min(X, X - (T - P)))
                }
            }
            R && ("auto" === N && X < Q && ac + f + R < S) && (ac += R);
            Z.width(ac).height(X);
            aa.width(ac + f);
            ad = aa.width();
            T = aa.height();
            aa = (ad > S || T > P) && ac > V && X > J;
            ac = Y.aspectRatio ? ac < F && X < O && ac < M && X < Q : (ac < F || X < O) && (ac < M || X < Q);
            j.extend(Y, {
                dim: {
                    width: v(ad),
                    height: v(T)
                },
                origWidth: M,
                origHeight: Q,
                canShrink: aa,
                canExpand: ac,
                wPadding: f,
                hPadding: b,
                wrapSpace: T - W.outerHeight(!0),
                skinSpace: W.height() - X
            });
            !x && (Y.autoHeight && X > J && X < I && !ac) && Z.height("auto")
        },
        _getPosition: function (b) {
            var q = u.current,
                p = u.getViewport(),
                r = q.margin,
                n = u.wrap.width() + r[1] + r[3],
                l = u.wrap.height() + r[0] + r[2],
                r = {
                    position: "absolute",
                    top: r[0],
                    left: r[3]
                };
            q.autoCenter && q.fixed && !b && l <= p.h && n <= p.w ? r.position = "fixed" : q.locked || (r.top += p.y, r.left += p.x);
            r.top = v(Math.max(r.top, r.top + (p.h - l) * q.topRatio));
            r.left = v(Math.max(r.left, r.left + (p.w - n) * q.leftRatio));
            return r
        },
        _afterZoomIn: function () {
            var b = u.current;
            b && (u.isOpen = u.isOpened = !0, u.wrap.css("overflow", "visible").addClass("fancybox-opened"), u.update(), (b.closeClick || b.nextClick && 1 < u.group.length) && u.inner.css("cursor", "pointer").bind("click.fb", function (f) {
                !j(f.target).is("a") && !j(f.target).parent().is("a") && (f.preventDefault(), u[b.closeClick ? "close" : "next"]())
            }), b.closeBtn && j(b.tpl.closeBtn).appendTo(u.skin).bind("click.fb", function (f) {
                f.preventDefault();
                u.close()
            }), b.arrows && 1 < u.group.length && ((b.loop || 0 < b.index) && j(b.tpl.prev).appendTo(u.outer).bind("click.fb", u.prev), (b.loop || b.index < u.group.length - 1) && j(b.tpl.next).appendTo(u.outer).bind("click.fb", u.next)), u.trigger("afterShow"), !b.loop && b.index === b.group.length - 1 ? u.play(!1) : u.opts.autoPlay && !u.player.isActive && (u.opts.autoPlay = !1, u.play()))
        },
        _afterZoomOut: function (b) {
            b = b || u.current;
            j(".fancybox-wrap").trigger("onReset").remove();
            j.extend(u, {
                group: {},
                opts: {},
                router: !1,
                current: null,
                isActive: !1,
                isOpened: !1,
                isOpen: !1,
                isClosing: !1,
                wrap: null,
                skin: null,
                outer: null,
                inner: null
            });
            u.trigger("afterClose", b)
        }
    });
    u.transitions = {
        getOrigPosition: function () {
            var w = u.current,
                s = w.element,
                r = w.orig,
                t = {},
                q = 50,
                p = 50,
                n = w.hPadding,
                l = w.wPadding,
                b = u.getViewport();
            !r && (w.isDom && s.is(":visible")) && (r = s.find("img:first"), r.length || (r = s));
            D(r) ? (t = r.offset(), r.is("img") && (q = r.outerWidth(), p = r.outerHeight())) : (t.top = b.y + (b.h - p) * w.topRatio, t.left = b.x + (b.w - q) * w.leftRatio);
            if ("fixed" === u.wrap.css("position") || w.locked) {
                t.top -= b.y, t.left -= b.x
            }
            return t = {
                top: v(t.top - n * w.topRatio),
                left: v(t.left - l * w.leftRatio),
                width: v(q + l),
                height: v(p + n)
            }
        },
        step: function (b, r) {
            var q, s, p = r.prop;
            s = u.current;
            var n = s.wrapSpace,
                l = s.skinSpace;
            if ("width" === p || "height" === p) {
                q = r.end === r.start ? 1 : (b - r.start) / (r.end - r.start), u.isClosing && (q = 1 - q), s = "width" === p ? s.wPadding : s.hPadding, s = b - s, u.skin[p](h("width" === p ? s : s - n * q)), u.inner[p](h("width" === p ? s : s - n * q - l * q))
            }
        },
        zoomIn: function () {
            var b = u.current,
                n = b.pos,
                l = b.openEffect,
                p = "elastic" === l,
                f = j.extend({
                    opacity: 1
                }, n);
            delete f.position;
            p ? (n = this.getOrigPosition(), b.openOpacity && (n.opacity = 0.1)) : "fade" === l && (n.opacity = 0.1);
            u.wrap.css(n).animate(f, {
                duration: "none" === l ? 0 : b.openSpeed,
                easing: b.openEasing,
                step: p ? this.step : null,
                complete: u._afterZoomIn
            })
        },
        zoomOut: function () {
            var b = u.current,
                l = b.closeEffect,
                f = "elastic" === l,
                n = {
                    opacity: 0.1
                };
            f && (n = this.getOrigPosition(), b.closeOpacity && (n.opacity = 0.1));
            u.wrap.animate(n, {
                duration: "none" === l ? 0 : b.closeSpeed,
                easing: b.closeEasing,
                step: f ? this.step : null,
                complete: u._afterZoomOut
            })
        },
        changeIn: function () {
            var b = u.current,
                q = b.nextEffect,
                p = b.pos,
                r = {
                    opacity: 1
                },
                n = u.direction,
                l;
            p.opacity = 0.1;
            "elastic" === q && (l = "down" === n || "up" === n ? "top" : "left", "down" === n || "right" === n ? (p[l] = v(h(p[l]) - 200), r[l] = "+=200px") : (p[l] = v(h(p[l]) + 200), r[l] = "-=200px"));
            "none" === q ? u._afterZoomIn() : u.wrap.css(p).animate(r, {
                duration: b.nextSpeed,
                easing: b.nextEasing,
                complete: u._afterZoomIn
            })
        },
        changeOut: function () {
            var b = u.previous,
                l = b.prevEffect,
                f = {
                    opacity: 0.1
                },
                n = u.direction;
            "elastic" === l && (f["down" === n || "up" === n ? "top" : "left"] = ("up" === n || "left" === n ? "-" : "+") + "=200px");
            b.wrap.animate(f, {
                duration: "none" === l ? 0 : b.prevSpeed,
                easing: b.prevEasing,
                complete: function () {
                    j(this).trigger("onReset").remove()
                }
            })
        }
    };
    u.helpers.overlay = {
        defaults: {
            closeClick: !0,
            speedOut: 200,
            showEarly: !0,
            css: {},
            locked: !E,
            fixed: !0
        },
        overlay: null,
        fixed: !1,
        create: function (b) {
            b = j.extend({}, this.defaults, b);
            this.overlay && this.close();
            this.overlay = j('<div class="fancybox-overlay"></div>').appendTo("body");
            this.fixed = !1;
            b.fixed && u.defaults.fixed && (this.overlay.addClass("fancybox-overlay-fixed"), this.fixed = !0)
        },
        open: function (b) {
            var f = this;
            b = j.extend({}, this.defaults, b);
            this.overlay ? this.overlay.unbind(".overlay").width("auto").height("auto") : this.create(b);
            this.fixed || (d.bind("resize.overlay", j.proxy(this.update, this)), this.update());
            b.closeClick && this.overlay.bind("click.overlay", function (l) {
                j(l.target).hasClass("fancybox-overlay") && (u.isActive ? u.close() : f.close())
            });
            this.overlay.css(b.css).show()
        },
        close: function () {
            j(".fancybox-overlay").remove();
            d.unbind("resize.overlay");
            this.overlay = null;
            !1 !== this.margin && (j("body").css("margin-right", this.margin), this.margin = !1);
            this.el && this.el.removeClass("fancybox-lock")
        },
        update: function () {
            var l = "100%",
                f;
            this.overlay.width(l).height("100%");
            A ? (f = Math.max(o.documentElement.offsetWidth, o.body.offsetWidth), g.width() > f && (l = g.width())) : g.width() > d.width() && (l = g.width());
            this.overlay.width(l).height(g.height())
        },
        onReady: function (l, f) {
            j(".fancybox-overlay").stop(!0, !0);
            this.overlay || (this.margin = g.height() > d.height() || "scroll" === j("body").css("overflow-y") ? j("body").css("margin-right") : !1, this.el = o.all && !o.querySelector ? j("html") : j("body"), this.create(l));
            l.locked && this.fixed && (f.locked = this.overlay.append(f.wrap), f.fixed = !1);
            !0 === l.showEarly && this.beforeShow.apply(this, arguments)
        },
        beforeShow: function (l, f) {
            f.locked && (this.el.addClass("fancybox-lock"), !1 !== this.margin && j("body").css("margin-right", h(this.margin) + f.scrollbarWidth));
            this.open(l)
        },
        onUpdate: function () {
            this.fixed || this.update()
        },
        afterClose: function (b) {
            this.overlay && !u.isActive && this.overlay.fadeOut(b.speedOut, j.proxy(this.close, this))
        }
    };
    u.helpers.title = {
        defaults: {
            type: "float",
            position: "bottom"
        },
        beforeShow: function (b) {
            var l = u.current,
                f = l.title,
                n = b.type;
            j.isFunction(f) && (f = f.call(l.element, l));
            if (e(f) && "" !== j.trim(f)) {
                l = j('<div class="fancybox-title fancybox-title-' + n + '-wrap">' + f + "</div>");
                switch (n) {
                case "inside":
                    n = u.skin;
                    break;
                case "outside":
                    n = u.wrap;
                    break;
                case "over":
                    n = u.inner;
                    break;
                default:
                    n = u.skin, l.appendTo("body"), A && l.width(l.width()), l.wrapInner('<span class="child"></span>'), u.current.margin[2] += Math.abs(h(l.css("margin-bottom")))
                }
                l["top" === b.position ? "prependTo" : "appendTo"](n)
            }
        }
    };
    j.fn.fancybox = function (b) {
        var n, l = j(this),
            p = this.selector || "",
            f = function (w) {
                var t = j(this).blur(),
                    s = n,
                    r, q;
                !w.ctrlKey && (!w.altKey && !w.shiftKey && !w.metaKey) && !t.is(".fancybox-wrap") && (r = b.groupAttr || "data-fancybox-group", q = t.attr(r), q || (r = "rel", q = t.get(0)[r]), q && ("" !== q && "nofollow" !== q) && (t = p.length ? j(p) : l, t = t.filter("[" + r + '="' + q + '"]'), s = t.index(this)), b.index = s, !1 !== u.open(t, b) && w.preventDefault())
            };
        b = b || {};
        n = b.index || 0;
        !p || !1 === b.live ? l.unbind("click.fb-start").bind("click.fb-start", f) : g.undelegate(p, "click.fb-start").delegate(p + ":not('.fancybox-item, .fancybox-nav')", "click.fb-start", f);
        this.filter("[data-fancybox-start=1]").trigger("click");
        return this
    };
    g.ready(function () {
        j.scrollbarWidth === a && (j.scrollbarWidth = function () {
            var p = j('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"),
                n = p.children(),
                n = n.innerWidth() - n.height(99).innerWidth();
            p.remove();
            return n
        });
        if (j.support.fixedPosition === a) {
            var b = j.support,
                l = j('<div style="position:fixed;top:20px;"></div>').appendTo("body"),
                f = 20 === l[0].offsetTop || 15 === l[0].offsetTop;
            l.remove();
            b.fixedPosition = f
        }
        j.extend(u.defaults, {
            scrollbarWidth: j.scrollbarWidth(),
            fixed: j.support.fixedPosition,
            parent: j("body")
        })
    })
})(window, document, jQuery);
/* fancyBox v2.1.4 fancyapps.com | fancyapps.com/fancybox/#license */
$(function () {
    $(document).on("click", ".hideQuickView", function () {
        if ($(".quickViewMainContainer").css("display") == "block") {
            $(".quickViewMainContainer").slideUp("fast");
            $(".span_plus").hide();
            $(".prevNextLink").hide()
        }
    });
    $(document).on("click", ".toggle-expand", function () {
        $(this).next(".toggle-content").fadeIn("fast");
        $(this).removeClass("toggle-expand").addClass("toggle-close");
        return false
    });
    $(document).on("click", ".toggle-close", function () {
        $(this).next(".toggle-content").fadeOut("fast");
        $(this).removeClass("toggle-close").addClass("toggle-expand");
        return false
    });
    $(".compare-pop-link").fancybox({
        padding: 0,
        fitToView: false,
        closeClick: false,
        openEffect: "fade",
        closeEffect: "fade",
        closeBtn: false,
        beforeShow: function () {
            $(".fancybox-skin").addClass("compare-pop-skin")
        }
    });
    $(".faq-link").fancybox({
        padding: 0,
        fitToView: true,
        width: 505,
        height: 440,
        autoSize: false,
        closeClick: false,
        openEffect: "fade",
        closeEffect: "fade",
        closeBtn: false,
        scrollOutside: false
    });
    $(".faq-link-sm").fancybox({
        padding: 0,
        fitToView: true,
        width: 505,
        height: 380,
        autoSize: false,
        closeClick: false,
        openEffect: "fade",
        closeEffect: "fade",
        closeBtn: false,
        scrollOutside: false
    });
    $(".faq-link-lg").fancybox({
        padding: 0,
        fitToView: true,
        width: 505,
        autoSize: true,
        closeClick: false,
        openEffect: "fade",
        closeEffect: "fade",
        closeBtn: false,
        scrollOutside: false
    });
    $(".latinCharactersCheck").bind("keyup", function () {
        $(this).val($(this).val().replace(/[^A-Za-z0-9\u00E0\u00E1\u00E2\u00E3\u00E4\u00E5\u00E8\u00E9\u00EA\u00EB\u00EC\u00ED\u00EE\u00EF\u00F0\u00F2\u00F3\u00F4\u00F5\u00F6\u00F9\u00FA\u00FB\u00FC@.,:;!?#|@$-/=+\\_" ]/g, ""))
    });
    $("input[name*='citizenshipCode']").bind("keyup", function () {
        $(this).val($(this).val().replace(/[^a-z0-9 ]/gi, ""))
    })
});

$(document).ready(function(){
    $('.ddcommon').click(function(){
        $(this).children('.text.shadow.borderRadius').show();
        $(this).children('.text.shadow.borderRadius').focus();
    });
});