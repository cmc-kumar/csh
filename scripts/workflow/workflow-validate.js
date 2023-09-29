/**
 * CA-11588 - BCI Workflow Answer Validators error messages to present immediately
 * Version 1.0
 * javascript mini website: https://refresh-sf.com/
 **/

var integerRegEX = /^[+\-]?\d+$/;
var answerValidatorMap={};
var last_expression_questionId;
var form_expressions_valid = true;
var specialSymbolPattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]");
var workflow_validate_enabled = true;

function preventValidation() {
  workflow_validate_enabled = false;
  setTimeout(function () {
    workflow_validate_enabled = true;
  }, 600);
}

function validateData(element,val,questionId, ignore_expression_validator) {
  if (!workflow_validate_enabled) {
    return true;
  }

  var info,
      field = $(element),
      message="",
      businessDataType = field.attr('businessDataType'),
      dataType = field.attr('dataType'),
      answerType = field.attr('answerType'),
      isRequiredFld = !!(field.attr('required')),
      answerRequired=field.attr('answerRequired'),
      fldName = field.attr('name'),
      maxLength = field.attr('maxlengthText'),
      minLength = field.attr('minlengthText');

  var validator = answerValidatorMap[questionId];
  var answerValidator = eval("(" + validator + ")");

  // set the global variable value: @last_expression_questionId
  setLastExpressionQuestionId();

  if(answerType === 'checkbox' || answerType === 'radio'){
    var fldValue = $('input[name='+'"'+fldName+'"'+']:checked').val();
    if(answerRequired){
      if(fldValue){
        isRequiredFld=false;
      }else {
        isRequiredFld=true;
      }
    }
  }

  if (isRequiredFld && (!val || (typeof(val) === 'undefined'))) {
    info = answerRequiredText;
  } else {
    if (val && val.trim() !== '' && maxLength && val.length > maxLength) {
      message =answerMaximumText.replace('{0}', maxLength);
    }
    if (val && val.trim() !== '' && minLength && val.length < minLength) {
      message = answerMinimumText.replace('{0}', minLength);
    }
    if (answerType === 'textfield' || answerType === 'textbox' || answerType === 'textarea') {
      if (dataType === 'long' || dataType === 'integer') {
        info = numberFieldValidator(field, val, answerValidator, integerRegEX, businessDataType, ignore_expression_validator);
      } else if (dataType === 'bigdecimal') {
        info = textFieldCurrencyValidator(field, val, answerValidator, businessDataType, ignore_expression_validator);
      } else if (dataType === 'date') {
        if(isNaN(val)&&!isNaN(Date.parse(val))){
          info =validateDataByValidators(field, val, answerValidator, businessDataType, ignore_expression_validator)
        } else if(!isRequiredFld){
          info = true;
        } else {
          info = answerDateText;
        }
      } else {
        info =validateDataByValidators(field, val, answerValidator, businessDataType, ignore_expression_validator)
      }
    } else {
      info = validateDataByValidators(field, val, answerValidator, businessDataType, ignore_expression_validator)
    }
  }
  if(message && message.trim() != ''){
    if(info && info !== true){
      info=message+" "+info
    }else {
      info=message
    }
  }
  let isValid =  appendError(field, (info && info === true), info, answerType);

  // append the error message at the top of the page
  // the CA-11530 requirement
  // for fixed CA-12271
  appendErrorTopOfPage();

  return isValid;
}

function numberFieldValidator(field, value,answerValidators,RegEx,businessDataType, ignore_expression_validator) {
  if (value && value.trim() !== '') {
    if (!RegEx.test(value)) {
      return answerNumberText
    }
  }
  if (answerValidators != null && answerValidators.length > 0) {
    return validateDataByValidators(field, value,answerValidators,businessDataType, ignore_expression_validator);
  }
  return true;
}

function booleanFiledValidator(value,answerValidators,businessDataType, ignore_expression_validator) {
  var booleanValue;
  if (value && value.trim() !== '') {
    booleanValue = value.trim().toLowerCase();
    if (!(booleanValue === 'yes' || booleanValue === 'no')) {
      return answerBooleanText
    }
  }
  if (answerValidators != null && answerValidators.length > 0) {
    return validateDataByValidators(value, answerValidators, businessDataType, ignore_expression_validator)
  }
  return true;
}


function textFieldCurrencyValidator (field, value,answerValidators,businessDataType, ignore_expression_validator) {
  var currencyRegEx = /^[+\-]?\d+(.\d{1,})?$/;
  if (value && value.trim() != '') {
    if (value.split(',').length > 1) {
      return answerDecimalText
    }
    if (value.match(currencyRegEx)) {
      if (value.length > 30) {
        return answerDecimalText
      }
    }else {
      return answerDecimalText
    }
  }
  if (answerValidators != null && answerValidators.length > 0) {
    return validateDataByValidators(field, value,answerValidators,businessDataType, ignore_expression_validator)
  }
  return true;
}


function validateDataByValidators(field, value,answerValidators,businessDataType, ignore_expression_validator){
  if(answerValidators != null && answerValidators.length > 0){
    for(var i = 0,len=answerValidators.length;i<len;i++){
      var answerValidator = answerValidators[i],
          isPass = true;

      // regular expression
      if(value && (answerValidator.regularExp && answerValidator.regularExp !== 'null' && answerValidator.regularExp !== '')){
        isPass = validateRegularExpression(answerValidator, value);
      } else if(answerValidator.expression && answerValidator.expression != 'null' && answerValidator.expression !== ''){
        if(ignore_expression_validator){
            // ignore the expression validator
          continue;
        } else {
          isPass = validateExpression(field, answerValidator, value, businessDataType);
        }
      } else {
        // number
        if(value && ((answerValidator.numberValue && answerValidator.numberValue != 'null')
            || (answerValidator.minimumValue && answerValidator.minimumValue != 'null')
            || (answerValidator.maximumValue  && answerValidator.maximumValue  != 'null')
            || (answerValidator.numOfDecimalDigits && answerValidator.numOfDecimalDigits != 'null'))){

          isPass =  validateNumber(answerValidator, value);

        } else if(value && ((answerValidator.textValue && answerValidator.textValue != 'null')
            || (answerValidator.maximumLength && answerValidator.maximumLength != 'null')
            || (answerValidator.minimumLength && answerValidator.minimumLength != 'null'))){
          // text
          isPass =  validateText(answerValidator, value);
        }else if(value && ((answerValidator.dateValue && answerValidator.dateValue != null)
            || (answerValidator.maxDateValue && answerValidator.maxDateValue != 'null')
            || (answerValidator.miniDateValue && answerValidator.miniDateValue != 'null'))){
          isPass =  validateDate(answerValidator, value);
        }
      }
      if(isPass === true){
        continue;
      } else {
        return isPass;
      }
    } // end for
  } // end if

  return true;
}


function validateRegularExpression(validator, value) {
  if (!validator || !validator.regularExp || value == null && value.trim() == '') {
    return true;
  }
  var operator = validator.operator,
      pattern = validator.regularExp,
      errorText = validator.errorText;
  errorText = errorText.replace(/>/g, '\>');
  errorText = errorText.replace(/</g, '\<');

  if(pattern.indexOf('/') == 0){
    pattern = validator.regularExp.replace(/\//, '');
  }
  if(pattern.indexOf('/', pattern.length - 1) !== -1){
    pattern = pattern.substring(0, pattern.length -1);
  }

  if (operator === 'Contains' || operator === 'NotContains') {
    var regular = new RegExp(pattern);
    if(specialSymbolPattern.test(pattern)){
      regular = new RegExp('\\'+pattern);
    }
    var result = value.match(regular);
    if (operator === 'Contains' && (result == null || result.length == 0)) {
      return  errorText;
    } else if (operator === 'NotContains' && (result != null && result.length > 0)) {
      return  errorText;
    }

  } else if (operator === 'StartWith' || operator === 'NotStartWith') {
    var reg = pattern;
    if (pattern.indexOf('^') != 0) {
      reg = '^' + pattern;
    }
    var regular = new RegExp(reg),
        result = regular.test(value);
    if (operator === 'StartWith' && !result) {
      return  errorText;
    } else if (operator === 'NotStartWith' && result) {
      return  errorText;
    }

  } else if (operator === 'EndWith' || operator === 'NotEndWith') {
    var reg = pattern;
    if (pattern.indexOf('$') == -1) {
      reg = pattern + '$';
    }
    var regular = new RegExp(reg),
        result = regular.test(value);

    if (operator === 'EndWith' && !result) {
      return  errorText;
    } else if (operator === 'NotEndWith' && result) {
      return  errorText;
    }

  } else if (operator === 'Matches' || operator === 'NotMatches') {
    var regular = new RegExp(pattern),
        result = regular.test(value);
    if (operator === 'Matches' && !result) {
      return  errorText;

    } else if (operator === 'NotMatches' && result) {
      return  errorText;
    }
  }

  return true;
}

function validateExpressionSubmission(ignoreValidations){
  let servletPathType= servletPath.split("/flow/")[1],
      urlStr=servletPath.split("/"),
      wStepId = $('#wStepId').val(),
      reId=$('#reId').val(),
      url,
      data = getValues() || {},
      result = true;

  if(urlStr.indexOf("nonAuthenticated")!=-1){
    url=pageContextPath+"/nonAuthenticated/expressionValidatorSubmission";
  }else {
    url=pageContextPath+"/expressionValidatorSubmission";
  }
  if(last_expression_questionId){
    data['wStepId'] = wStepId;
    data['reId']=reId;
    data['servletPathType']=servletPathType;
    data['ignore'] = ignoreValidations.join(',');

    $.ajax({
      url: url,
      method: 'POST',
      async: false,
      data: data,
      dataType: 'json',
      success: function(resp){
        result = resp.valid;
        if(!result){
          for(let questionId in resp.data){
            let _field = $('#answer_' +questionId);
            if(_field && !_field.hasClass('validate-failed')){
              appendError(_field, result, resp.data[questionId]);
            }
          }
        }
      }
    });
  }

  return result
}

function validateExpression(field, validator, value, businessDataType){
  var servletPathType= servletPath.split("/flow/")[1];

  if(!validator){
    return true;
  }
  var expression = validator.expression,
      errorText = validator.errorText,
      wStepId = $('#wStepId').val(),
      reId=$('#reId').val(),
      data = getValues() || {},
      ret = true,
      url;

  var urlStr=servletPath.split("/");
  if(urlStr.indexOf("nonAuthenticated")!=-1){
    url=pageContextPath+"/nonAuthenticated/expressionValidator";
  }else {
    url=pageContextPath+"/expressionValidator";
  }
  errorText = errorText.replace(/>/g, '\>');
  errorText = errorText.replace(/</g, '\<');

  if(expression){
    data['expr'] = expression;
    data['answer'] = value;
    data['bdt'] = businessDataType;
    data['wStepId'] = wStepId;
    data['reId']=reId;
    data['servletPathType']=servletPathType;

    let _field_name = field.attr('name');
    let questionId = _field_name.substring(_field_name.indexOf("[")+1, _field_name.indexOf("]"));
    $.ajax({
      url: url,
      method: 'POST',
      // async: questionId!=last_expression_questionId, // only last expression was sync
      async: true,
      data: data,
      success: function(result){
        try{
          var res = eval('(' + result + ')');
          if(res){
            ret = res.data;
          }
        }catch (e) {
          ret = false;
        }

        form_expressions_valid = form_expressions_valid && ret;
        appendError(field, ret, errorText);
      }
    });
  }
  if(!ret){
    return errorText;
  }
  return ret;

}

function validateNumber(validator, data){
  if(!validator || !data){
    return true;
  }
  var me = this,
      value = parseFloat(data),
      operator = validator.operator,
      errorText = validator.errorText;
  errorText = errorText.replace(/>/g, '\>');
  errorText = errorText.replace(/</g, '\<');
  if(operator === 'Between' || operator === 'NotBetween' ){
    var minValue = Math.min(validator.minimumValue, validator.maximumValue),
        maxValue = Math.max(validator.minimumValue, validator.maximumValue);
    if(operator === 'Between' && !(value >=minValue && value<=maxValue)){
      return errorText;
    }else if(operator === 'NotBetween'&&(value >=minValue && value<=maxValue)){
      return errorText;
    }
  } else if(operator === '>' && !(value > validator.numberValue)){
    return errorText;
  } else if(operator === '>=' && !(value >= validator.numberValue)){
    return errorText;
  } else if(operator === '<' && !(value < validator.numberValue)){
    return errorText;
  } else if(operator === '<=' && !(value <= validator.numberValue)){
    return errorText;
  }else if(operator === '=' && (value != validator.numberValue)){
    return errorText;
  }else if((operator === '!=' || operator === '<>') && value == validator.numberValue){
    return errorText;
  }
  return true;
}

function validateText(validator, value){
  if(!validator || !value){
    return true;
  }

  var me = this,
      operator = validator.operator,
      errorText = validator.errorText;
  errorText = errorText.replace(/>/g, '\>');
  errorText = errorText.replace(/</g, '\<');

  if(operator === 'Contains'){
    if(value.indexOf(validator.textValue)<0){
      return errorText;
    }
  } else if(operator === 'NotContains'){
    if(value.indexOf(validator.textValue)>=0){
      return errorText;
    }
  } else if(operator === 'MaxLength' && value.length > validator.maximumLength){
    return errorText;
  } else if(operator === 'MinLength' && value.length < validator.minimumLength){
    return errorText;
  }

  return true;
}


function validateDate(validator, data) {

  if (!validator || !data) {
    return true;
  }
  var value = new Date(data),
      dateValue=new Date(validator.dateValue),
      operator = validator.operator,
      errorText = validator.errorText;
  errorText = errorText.replace(/>/g, '\>');
  errorText = errorText.replace(/</g, '\<');

  if (operator === 'Between' || operator === 'NotBetween') {
    var minValue=new Date(validator.miniDateValue),
        maxValue=new Date(validator.maxDateValue);
    if (maxValue > minValue) {
      minValue = minValue;
      maxValue = maxValue;

    } else {
      minValue = maxValue;
      maxValue = minValue;
    }

    if (operator === 'Between' && !(value >= minValue && value <= maxValue)) {
      return errorText;
    } else if (operator === 'NotBetween' && (value >= minValue && value <= maxValue)) {
      return errorText;
    }
  } else if (operator === '>' && !(value > dateValue)) {
    return errorText;
  } else if (operator === '>=' && !(value >= dateValue)) {
    return errorText;
  } else if (operator === '<' && !(value < dateValue)) {
    return errorText;
  } else if (operator === '<=' && !(value <= dateValue)) {
    return errorText;
  } else if (operator === '=' && (value - dateValue) != 0) {
    return errorText;
  } else if ((operator === '!=' || operator === '<>') && value - dateValue == 0) {
    return errorText;
  }
  return true;
}


function getValues(){
  var inputs = $("#surveyAndTreatmentForm :input");
  var values = {};
  inputs.each(function() {
    let inputType = this.type.toLowerCase();
    if('button' != inputType && inputType != 'submit'
        && inputType != 'cancel' && inputType != 'image'){
      var workflowTaskElementId = $(this).attr('w-id');
      if(workflowTaskElementId){
        values[workflowTaskElementId] = $(this).val();
      }
    }
  });
  return values;
}


function checkUploadFile(fld, questionId, contentType) {
  let field = $(fld);
      // htmlFld = document.getElementById('files_[' + questionId + ']');
  let fileName =field.val();
  let types = contentType ? contentType.split(',') : [],
      rule = '',
      flag = true,
      allowAllType = false,
      isRequiredFld = !!field.attr('required'),
      message;

  if (isRequiredFld && !fileName) {
    message = answerRequiredText;
    flag=false;
  }else {
    if (fileName) {
      for (var i = 0; i < types.length; i++) {
        var type = types[i].toUpperCase().trim();
        switch (type) {
          case 'PDF':
            rule += 'pdf|PDF|';
            break;
          case 'EXCEL':
            rule += 'xls|XLS|xlsx|XLSX|';
            break;

          case 'WORD':
            rule += 'doc|DOC|docx|DOCX|';
            break;
          case 'TXT':
            rule += 'txt|TXT|';
            break;
          case 'JPG':
            rule += 'jpg|JPG|jpeg|JPEG';
            break;
          case 'BMP':
            rule += 'bmp|BMP|';
            break;
          case 'GIF':
            rule += 'gif|GIF|';
            break;
          case 'PNG':
            rule += 'png|PNG|';
            break;
          case 'ZIP':
            rule += 'zip|ZIP|';
            break;
          case 'HTML':
            rule += 'html|HTML|';
            break;
          case 'MSG':
            rule += 'msg|MSG|';
            break;
          case 'ALL' :
            allowAllType = true;
            break;
        }
      }
      if (fileName && rule) {
        flag = allowAllType ? true : hasExtension(fileName, rule.substr(0, rule.length - 1));
      }
      if(!flag){
        message = invalidUploadFile.replace('{0}', contentType);
      }
    }
  }
  appendError(field, flag, message);
  return flag;
}

function appendError(field, isValid, errorMessage, answerType){
  let _field_name = field.attr('name'),
      _field_id = field.attr('id');
  let questionId = _field_name.substring(_field_name.indexOf("[")+1, _field_name.indexOf("]"));
  if (isValid && isValid === true) {
    field.removeClass('validate-failed');
    field.attr('aria-invalid', false);

    var _error_field_id = 'answer_' + questionId + '_error';
    var _aria_describedby_val = field.attr('aria-describedby');
    if(_aria_describedby_val && _aria_describedby_val.indexOf(_error_field_id) > -1){
      if(_aria_describedby_val.split(' ').length > 1){
        field.attr('aria-describedby', (_aria_describedby_val.replace(_error_field_id, '')).trim());
      } else {
        field.removeAttr('aria-describedby');
      }
    }

    let errorFld = $('#'+_error_field_id);
    errorFld.html('');
    errorFld.css('display', 'none');
    return isValid;
  } else {
    field.addClass('validate-failed');
    let error_field_id = 'answer_' + questionId + '_error',
        errorFld = $('#answer_' + questionId + '_error');

    if(!errorFld || errorFld.length == 0){
      let errorInfo = '<label id="'+error_field_id+'" ' +
                      'class="no_top_margin text_red bg_light_blue wfl-validation-error" ' +
                      '>'+errorMessage+'</label>';
      // if (answerType && answerType === 'checkbox') {
      //   $(errorInfo).insertAfter(field.parent());
      // } else
      if (answerType && (answerType === 'radio' || answerType === 'checkbox')) {
        let _parent = field.parent().parent();
        $(errorInfo).insertAfter(_parent);
        _append_screen_reader(answerType, _parent, error_field_id);
      } else if('date' == field.attr('dataType')){
        $(errorInfo).insertAfter(field.closest('span.date-row'));
      } else {
        $(errorInfo).insertAfter(field);
        _append_screen_reader(answerType, field, error_field_id);
      }
    }else {
      errorFld.css('display', 'block');
      errorFld.html(errorMessage);
      if (answerType && (answerType === 'radio' || answerType === 'checkbox')) {
        let _parent = field.parent().parent();
        _append_screen_reader(answerType, _parent, error_field_id);
      } else {
        _append_screen_reader(answerType, field, error_field_id);
      }

    }
    return false;
  }
}

function _append_screen_reader(answerType, field, error_field_id){
  var _aria_describedby_val = field.attr('aria-describedby');
  field.attr('aria-invalid', true);
  if(_aria_describedby_val && _aria_describedby_val.indexOf(error_field_id) < 0){
    field.attr('aria-describedby', _aria_describedby_val + ' ' + error_field_id);
  } else {
    field.attr('aria-describedby', error_field_id);
  }
}

function setLastExpressionQuestionId(){
  if(typeof last_expression_questionId != "undefined" && last_expression_questionId){
    return last_expression_questionId;
  }

  let last_question_ID;
  for(let k in answerValidatorMap){
    if(k && answerValidatorMap[k]){
      let validations = eval("(" + answerValidatorMap[k] + ")");
      for (let i = 0; i < validations.length; i++) {
        const validation = validations[i];
        if(validation && validation.expression && validation.expression!='null' && validation.expression != ''){
          last_question_ID = k;
        }
      }
    }
  }
  last_expression_questionId = last_question_ID;
  return last_question_ID;
}


function hasExtension(value, rule) {
  var strReg = "\.(" + rule + ")$";
  var regExp = new RegExp(strReg);
  return regExp.test(value.toUpperCase());
}

function appendErrorTopOfPage(){
  // append the error message at the top of the page
  // the CA-11530 requirement
  // for fixed CA-12271

  if($('.wfl-validation-error').text().trim().indexOf(answerRequiredText) > -1){
    if($('#error-box').css('display') !== 'block'){
      $('#error-box').css('display', 'block');
      $('#error_text').text(moreErrorsText);
    }
  } else {
    $('#error-box').css('display', 'none');
    $('#error_text').empty();
  }
}

function isValidForm(){
  form_expressions_valid = true;
  var inputs = $("#surveyAndTreatmentForm :input"),
      flag = true,
      validResult=[],
      ignoreValidations=[];

  setLastExpressionQuestionId();

  inputs.each(function() {
    let inputType = this.type.toLowerCase();
    if('button' != inputType && inputType != 'submit'
        && inputType != 'cancel' && inputType != 'image'){
      let documentContentType= $(this).attr('documentContentType'),
          fldValue = $(this).val(),
          fldName = $(this).attr('name'),
          disabled = $(this).attr('disabled'),
          ignore = $(this).hasClass("ignore"),
          ignore_validation = disabled || ignore;

      if(fldName){
        let questionId = fldName.substring(fldName.indexOf("[")+1, fldName.indexOf("]"));

        if(ignore_validation && questionId){
          ignoreValidations.push(questionId);

        } else if(inputType!=='hidden'){
          if('checkbox' == inputType || 'radio' == inputType){
            fldValue = $('input[name='+'"'+fldName+'"'+']:checked').val();
          }
          if(inputType == 'file'){
            flag= checkUploadFile(this,parseInt(questionId),documentContentType)
          } else {
            flag= validateData(this,fldValue, parseInt(questionId), true);
          }
        }
      }
      if (!flag) {
        validResult.push(flag)
      }
    }
  });

  let valid = validResult.length == 0 && form_expressions_valid;
  if(last_expression_questionId){
    let result = validateExpressionSubmission(ignoreValidations);
    valid = valid && result;
  }

  if (ignoreValidations.length != 0) {
    let $_ignore_field = $('#answer_ignore');
    if ($_ignore_field[0]) {
      $_ignore_field.val(ignoreValidations);
    } else {
      $("#surveyAndTreatmentForm").append("<input type='hidden' id='answer_ignore' name='answers[ignore]' value='" + ignoreValidations + "'>")
    }
  }

  // append the error message at the top of the page
  // the CA-11530 requirement
  // for fixed CA-12271
  appendErrorTopOfPage();

  var inValid = $('.validate-failed');
  if (inValid && inValid.length > 0) {
    inValid[0].focus();
  }

  // restore the variable
  form_expressions_valid = true;

  return valid;
}