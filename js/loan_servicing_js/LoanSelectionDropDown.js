$(document).ready(function () {

    $('#ddlLoan').change(onLoanChanged);
});



function onLoanChanged() {
    // $('#ddlLoan')[0].selectedIndex = 0;
    sdId = $('#ddlLoan option:selected').val();

    if (sdId == "1") {
        window.location.href = "https://www.salliemae.com/";
    }
}
