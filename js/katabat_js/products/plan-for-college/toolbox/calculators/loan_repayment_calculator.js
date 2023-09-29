

// field validations

function validateLoanBalance() {

    var x = document.getElementById("balance");

    if (x.value == null || x.value == "") {
        document.getElementById("balance_border").style.border = '1px solid #ff4949';
        document.getElementById("balance_error").style.display = 'block';
        document.getElementById("balance_error").innerHTML = 'Enter your loan balance.';
        return false;
    } else if (isUSCurrency(x.value) == false) {
    document.getElementById("balance_border").style.border = '1px solid #ff4949';
        document.getElementById("balance_error").style.display = 'block';
        document.getElementById("balance_error").innerHTML = 'Enter your loan balance in numbers.';
        return false;
    } else {
    document.getElementById("balance_border").style.border = '1px solid #dcdcdc';
        document.getElementById("balance_error").style.display = "none";
        x.value = formatUSCurrency(x.value);
        return true;
    }
}

function validateInterestRate() {

    var x = document.getElementById("rate");

    if (x.value == null || x.value == "") {
        document.getElementById("rate_border").style.border = '1px solid #ff4949';
        document.getElementById("rate_error").style.display = 'block';
        document.getElementById("rate_error").innerHTML = 'Enter your interest rate.';
        return false;
    } else if (isPercentage(x.value) == false) {
    document.getElementById("rate_border").style.border = '1px solid #ff4949';
        document.getElementById("rate_error").style.display = 'block';
        document.getElementById("rate_error").innerHTML = 'Enter your interest rate in numbers.';
        return false;
    } else if (x.value > 100) {
    document.getElementById("rate_border").style.border = '1px solid #ff4949';
        document.getElementById("rate_error").style.display = 'block';
        document.getElementById("rate_error").innerHTML = 'Interest rate must be less than 100.';
        return false;
    } else {
    document.getElementById("rate_border").style.border = '1px solid #dcdcdc';
        document.getElementById("rate_error").style.display = "none";
        return true;
    }
}

function validateYearsToRepay() {

    var x = document.getElementById("term");

    if (x.value == null || x.value == "") {
        document.getElementById("term_border").style.border = '1px solid #ff4949';
        document.getElementById("term_error").style.display = 'block';
        document.getElementById("term_error").innerHTML = 'Enter years to repay.';
        return false;
    } else if (isWholeNumber(x.value) == false) {
    document.getElementById("term_border").style.border = '1px solid #ff4949';
        document.getElementById("term_error").style.display = 'block';
        document.getElementById("term_error").innerHTML = 'Enter years to repay in numbers.';
        return false;
    } else {
    document.getElementById("term_border").style.border = '1px solid #dcdcdc';
        document.getElementById("term_error").style.display = "none";
        return true;
    }
}




// form validation 

function validateForm() {

    // tool tracking
    trackTool('SM:CA:Loan Repayment Calculator');

    // Set monthly payment amount
    var monthlyPayment = 0;    
    
    // Set error catcher
    var error = 0;
    // Check Loan Balance
    if (!validateLoanBalance('balance')) {
        error++;
    }
    // Validate Interest Rate
    if (!validateInterestRate('rate')) {
        error++;
    }
    // Validate Months of no payments
    if (!validateYearsToRepay('term')) {
        error++;
    }
    
    // Don't submit form if there are errors
    if (error > 0) {
        document.getElementById("CAerror").style.display = "block";
        return false;
    }

    suppressOmnitureRefresh();  
    return true;
}

