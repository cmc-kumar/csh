$(".tip-link").on("click", function (e) {
    var box = $($("input", $(this).parent().parent()[0]));
    if (!$(box).is(":checked")) {
        $(box).prop("checked", true);
    }
    else {
        $(box).prop("checked", false);
    }
});

function submit() {
    var alertAll = "";
    if ($("#fName")[0].value == "") {
        alertAll += "Please enter your name.\n"
    }
    if ($("#fEmail")[0].value == "") {
        alertAll += "Please enter your email address.\n"
    }
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (reg.test($("#fEmail")[0].value) == false && $("#fEmail")[0].value != "") {
        alertAll += "Please enter a valid email address.\n";
    }
    if ($("#fSchoolcode")[0].value == "") {
        alertAll += "Please enter your school code.\n"
    }
    if (!$("input:checked").length) {
        alertAll += "Please select one or more materials to download."
    }
    if (alertAll != "") {
        alert(alertAll);
    }
    if (alertAll == "") {
        var fName = $("#fName")[0].value;
        var fEmail = $("#fEmail")[0].value;
        var fSchoolcode = $("#fSchoolcode")[0].value;
        var downloadItems = new Array();
        var postData = { "name": fName, "email": fEmail, "schoolCode": fSchoolcode };
        var checkedLength = $("input:checked").length;
        $("#main_content .multicolumn_column.width_100").parent().each(function () {
            this.style.display = "none";
        });
        var columns = $("#main_content .article + .multicolumn_row .multicolumn_column.width_33 .multicolumn_column_container, #main_content .multicolumn_row + .multicolumn_row .multicolumn_column.width_33 .multicolumn_column_container");
        var contents = new Array($("input:checked").length);
        var downloadContent = new Array($("input:checked").length);
        for (i = 0; i < $("input:checked").length; i++) {
            var box = $("input:checked")[i];
            var boxParentParent = $(box).parent().parent()[0];
            var boxParent = $(box).parent()[0];
            var image = $(("img"), boxParentParent)[0];
            image.className = image.className.replace("tip-link", "");
            image.className = image.className.replace("thumb", "");
            var imageDownload = document.createElement("a");
            imageDownload.setAttribute('class', 'center block');
            imageDownload.setAttribute('target', '_blank');
            var downloadLink = document.createElement("a");
            downloadLink.setAttribute("class", "center block");
            downloadLink.setAttribute('target', '_blank');
            downloadLink.innerHTML = "Download";
            if ($(".type_changer", boxParent).length) {
                var documentType = $(".type_changer:eq(" + i + ")").attr("filetype");
                imageDownload.setAttribute('href', image.src.replace(".jpg", "." + documentType).replace("/images/", "/downloads/"));
                downloadLink.setAttribute('href', image.src.replace(".jpg", "." + documentType).replace("/images/", "/downloads/"));
            }
            else {
                imageDownload.setAttribute('href', image.src.replace(".jpg", ".pdf").replace("/images/", "/downloads/"));
                downloadLink.setAttribute('href', image.src.replace(".jpg", ".pdf").replace("/images/", "/downloads/"));
            }
            var imageParent = $(image).parent()[0];
            $(imageDownload).append(image);
            $(imageParent).append(imageDownload);

            $(boxParent).append(downloadLink);
            contents[i] = boxParentParent.innerHTML;
            downloadItems[i] = $(".download_title")[i].innerText || $(".download_title")[i].textContent;
        }
        $(columns).each(function () {
            $(this).html("");
        });
        for (i = 0; i < checkedLength; i++) {
            columns[i].innerHTML = contents[i];
            var itemName = "downloadItem" + i;
            postData[itemName] = downloadItems[i];
        }
        $(".return_links").hide();
        $(".presubmitted").hide();
        $(".submitted").show();
        $("#main input[type=checkbox]").hide();
        $("#main .special_toggle").hide();
        $("#right_rail_container").html("<div class='article article_standard'><p class='h2'>Requestor Information</p><p>Name:<br>" + fName + "</p><p>Email:<br>" + fEmail + "</p><p>Schoolcode:<br>" + fSchoolcode + "</p></div>");
        $('.article + .multicolumn_row .multicolumn_column_container, .multicolumn_row + .multicolumn_row .multicolumn_column_container').filter(function () { return $.trim($(this).text()).length == 0 }).remove();
        $('.article + .multicolumn_row .multicolumn_column, .multicolumn_row + .multicolumn_row .multicolumn_column').filter(function () { return $.trim($(this).text()).length == 0 }).remove();
        $('.article + .multicolumn_row, .multicolumn_row + .multicolumn_row').filter(function () { return $.trim($(this).text()).length == 0 }).remove();
        var target = $("#logo");
        $('html,body').animate({
            scrollTop: target.offset().top - 30
        }, 1000);
        $.ajax({
            url: window.location.href,
            type: 'POST',
            dataType: 'json',
            data: postData,
            success: function (postData) {
                //alert(JSON.stringify(postData));
            }
        });

    }
}