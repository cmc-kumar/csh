/**
 * For Screen Reader
 * CA-11244, CA-11449
 *
 * JS mini: https://refresh-sf.com/
 * Jquery Date picker Accessibility refer: https://www.webaxe.org/accessible-date-pickers/
 */

var ScreenReader = {

    invalidFieldFocusable: 'invalid-field-focusable',
    invalidErrorInfoFocusable: 'invalid-error-info-focusable',

    labels: {
        enter_label: enter_label || 'Enter',
        enter_as_label: enter_as_label || 'Enter as a',
        enter_as_currency: enter_as_currency || 'Enter in currency format',
        enter_as_text: enter_as_text || 'Enter as Text',
        required_label: required_label || 'required',
        selected_option_label: selected_option_label || 'Selected',
        siteDateFormat_label: date_format_label_prefix + ": " + siteDateFormat_label.replace(/,/gi, '').split(/\s+/).join(', ') || 'Date Format: Month, Day, Year',
        dropdown_list_count_label: dropdown_count_label || 'There are {0} items in the list',
        dropdown_list_end_list_label: dropdown_count_endOfList || 'End of list',
        page_title_screen_reader_suffix: page_title_screen_reader_suffix || ''
    },

    isIE: window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf('Trident/') > -1,
    isWindows: navigator.platform.indexOf("Win") > -1,
    isMobileDevice: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(navigator.userAgent),

    append_lang_for_html: function () {
        // append the html lang
        // <html lang="en"> or <html lang="fr">
        var _lang_field = $('#mobLanguagePreference')[0] || $('#languagePreference')[0];
        var _lang = 'en';
        if (_lang_field) {
            _lang = $(_lang_field).val().split("_")[0];
        }

        $('html').attr('lang', _lang);
    },

    init_navigation_menu: function () {
        // If click the menu_button_a link
        // If the menu has already pop-up
        // then after clicked, collapse the menu
        // if the menu not pop-up
        // then expand the menu.
        $('.menu_button_a').bind('click touchstart', function () {
            var _field = $(this);
            setTimeout(function () {
                var menu_content = _field.next('div'),
                    height = menu_content.height();

                if (!height || height <= 0) {
                    height = menu_content.find('a').length * 48;
                    $('.hotspot_menu li.active').removeClass('active')
                        .find('div.top_nav_target')
                        .removeClass('active').height(0);
                    _field.parent().addClass('active');
                    _field.next('div').addClass('active');
                } else {
                    height = 0;
                    _field.parent().removeClass('active');
                }

                menu_content.css('height', height);
                menu_content.trigger($.Event('heightchange'));
            }, 10);

        });

        // Listener menu height change
        $('.menu_button_a').next('div').bind('heightchange', function () {
            var _field = $(this);

            setTimeout(function () {
                var _height = _field.height();
                $('.hotspot_menu li:not(active)>a.menu_button_a').attr('aria-expanded', false).removeAttr('aria-activedescendant')
                    .next('div').attr('aria-hidden', true)
                    .find('div').attr('aria-hidden', true);

                if (_height > 0) {
                    var menu_option_field = _field.find('div'),
                        menu_option_field_id = menu_option_field.attr('id');

                    if(!menu_option_field_id){
                        menu_option_field_id = _field.attr('id') +'_menu_options';
                        menu_option_field.attr('id', menu_option_field_id);
                    }

                    _field.prev('a').attr('aria-expanded', 'true')
                        .attr('aria-activedescendant', menu_option_field_id);
                    _field.removeAttr('aria-hidden');
                    menu_option_field.removeAttr('aria-hidden').removeAttr('style');
                    _field.parent().attr('expanded', 'true');
                    _field.find('a').attr('tabindex', 0);
                } else {
                    _field.prev('a').attr('aria-expanded', 'false')
                        .removeAttr('aria-activedescendant');
                    _field.attr('aria-hidden', 'true');
                    _field.find('div').attr('aria-hidden', 'true');
                    _field.parent().attr('expanded', 'false');
                    _field.find('a').attr('tabindex', -1);
                }
            }, 15);

        });
    },

    init_fields_accessibility: function(){
        // init the input, radio, checkbox, text area accessibility
        var me = this;
        $('input').map(function(){
            var _field = $(this),
                _val = _field.val(),
                _type = this.type.toLowerCase();

            if(_type !== 'hidden' && _type !== 'image' && _type !== 'img'){

                if( _type === 'submit' || _type === 'cancel' || _type === 'button'){
                    var _button_text = _field.val();
                    _field.attr('role', 'button');
                    if(!_field.attr('aria-label') && _button_text) {
                        _field.attr('aria-label', _button_text);
                    }
                    if(_field.attr('disabled')){
                        _field.attr('aria-disabled', 'true');
                    }
                } else {
                    if(_field.attr('required')){
                        _field.attr('aria-required', "true");
                    }
                    if(_field.attr('readonly')){
                        _field.attr('aria-readonly', "true");
                    }
                    if(_field.attr('autocomplete')){
                        _field.attr('aria-autocomplete', "none");
                    }
                    if(_field.attr('dateFormat')){
                        _field.attr('title', me.labels.siteDateFormat_label);
                    }
                }
            }
        });
    },

    init_radio_edit_field: function(){
        // If the radio item has edit field
        // init the edit field accessibility
        // such as "Make Payment" page, Other payment
        var me = this;
        $('.radio-edit-field').map(function(){
            var _field = $(this);
            var _edit_field_id = _field.attr('item-id'),
                _edit_field_meta = _field.attr('item-meta');

            var _edit_field = $('#'+_edit_field_id);
            if(_edit_field){
                var _edit_field_type = _edit_field.attr('fieldtype').toLowerCase();
                try{
                    var metadata = JSON.parse(_edit_field_meta);
                    for(var key in metadata){
                        _edit_field.attr('aria-' + key, metadata[key]);
                        if(key === 'describedby'){
                            var describedby = $('#'+metadata[key]);
                            var isInvalid = describedby.text().trim().length > 0;
                            _edit_field.attr('aria-invalid', isInvalid);
                            if(isInvalid){
                                _edit_field.addClass(me.invalidFieldFocusable);
                            } else {
                                _edit_field.removeClass(me.invalidFieldFocusable);
                            }
                        }
                    }

                    if(_edit_field_type === 'date'){
                        _edit_field.attr('placeholder', me.labels.siteDateFormat_label);
                        _edit_field.attr('title', me.labels.siteDateFormat_label);
                    }

                }catch (e) {
                    console.error(e);
                }
            }
        });
    },


    init_field_by_label: function(){
        // sometimes the page form field written in xml
        // in ftl page, we only see the label and the field id (from label for="")


        var me = this;
        $('.accessibility-input-by-label').map(function(){
            var _label = $(this),
                _tart_id = _label.attr('for').replace(/\./g, '\\.'),
                _meta = _label.attr('item-meta'),
                _label_text = _label.text().replace(me.labels.required_label, '').replace(':', ''),
                _input_field = $('#'+_tart_id);

            if(_input_field.length > 0){
                try{
                    _input_field.attr('placeholder', me.labels.enter_label + " " + _label_text);
                    if(_input_field.attr('type') && _input_field.attr('type') == 'text'){
                        _input_field.attr('autocomplete', "off");
                        _input_field.attr('aria-autocomplete', "none");
                    }

                    if(_meta){
                        var metadata = JSON.parse(_meta);
                        for(var key in metadata){
                            _input_field.attr('aria-' + key, metadata[key]);
                            if(key === 'describedby'){
                                var describedby = $('#'+metadata[key]);
                                var isInvalid = describedby.text().trim().length > 0;
                                _input_field.attr('aria-invalid', isInvalid);
                                if(isInvalid){
                                    _input_field.addClass(me.invalidFieldFocusable);
                                } else {
                                    _input_field.removeClass(me.invalidFieldFocusable);
                                }
                            } else if(key === 'placeholder'){
                                _input_field.attr('placeholder', metadata[key]);
                            }
                        }
                    }

                }catch (e) {
                    console.error(e);
                }
            }
        });
    },

    append_attribute_for_container: function () {
        $('.fa-asterisk').attr('aria-label', this.labels.required_label);
        $('.bg_success').attr('role', 'alert');
        $('.bg_failure').attr('role', 'alert');
        $('#header').attr('role', 'banner');
    },

    auto_skip_read: function () {
        $('div.column_fill').attr('aria-hidden', 'true');
        $('div.clear').attr('aria-hidden', 'true');
        $('select.countries').attr('aria-hidden', 'true');
        $('.wf-check-group-spliter').attr('aria-hidden', 'true');
        $('span.ddTitleText img').attr('aria-hidden', 'true');
        $('.bg_success span.fa-action-icon').attr('aria-hidden', 'true');
        $('.bg_failure span.fa-action-icon').attr('aria-hidden', 'true');
    },

    auto_focus_to_error_field_or_info: function(){
        // to check if the page exists error
        var error_field = $($('.'+this.invalidFieldFocusable)[0]);
        var error_info = $($('.'+this.invalidErrorInfoFocusable)[0]);
        var timeout_duration = this.isMobileDevice? 19500: 100;

        $('.bg_failure').parent().attr('aria-live',"polite");

        if(error_field.length > 0){
            var _tagName = error_field.prop('tagName').toLowerCase();
            // if(_tagName === 'div' || _tagName !== 'span') {
            if(_tagName === 'div') {
                error_field.attr('tabindex', -1);
            } else {
                error_field.attr('tabindex', 0);
            }
            setTimeout(function(){
                error_field.focus();
                if(_tagName === 'div' || _tagName !== 'span') {
                    $('html, body').animate({
                        scrollTop: error_field.offset().top
                    }, timeout_duration*2);
                }

            }, timeout_duration);

        } else if(error_info.length > 0 && error_info.text()){
            error_info.attr('tabindex', -1);
            setTimeout(function(){
                error_info.focus();
                $('html, body').animate({
                    scrollTop: error_info.offset().top
                }, timeout_duration*2);

            }, timeout_duration);

            setTimeout(function(){
                error_info.blur();
            }, timeout_duration*2.5);
        }
    },

    init_workflow_form: function(){
        var me = this;
        $('#surveyAndTreatmentForm :input').map(function(){
            var _field = $(this),
                _error_field_id = _field.attr('id')+'_error',
                _type = this.type.toLowerCase(),
                _invalid_className = me.invalidFieldFocusable;

            if (_type === 'radio' || _type === 'checkbox') {
                var _owner_id = _field.attr('data-own');
                _field = $('#' + _owner_id);
                _error_field_id = _owner_id + '_error';
            }

            if(_type !== 'hidden' && _type !== "image" && _type !== 'img'
                && !(_type === 'submit' || _type === 'cancel' || _type === 'button')){
                var _field_layout = _field.attr('aria-layout'),
                    _labelledby = _field_layout == 'AQ'? _field.attr('aria-describedby'): _field.attr('aria-labelledby'),
                    // _describedby = _field.attr('aria-describedby'),
                    // _label_field = _labelledby? $('#'+_labelledby + " span.fa-asterisk") : null,
                    _label_field = _field_layout && _field_layout == 'QAQ' ? $('#'+_labelledby +'_after span.fa-asterisk'): $('#'+_labelledby + " span.fa-asterisk"),
                    _error_field = $('#'+_error_field_id),
                    _is_required_field = _label_field && _label_field.length > 0,
                    _is_invalid = _error_field && _error_field.length > 0 && _error_field.text() !== '',
                    _dataType = _field.attr('data-type')|| null;

                // append aria-required
                if(_is_required_field){
                    _field.attr('aria-required', _is_required_field);
                }

                // fixed the readonly field pressed "enter" keyboard
                // reload the page.
                if(_field.attr('readonly')){
                    _field.bind('keydown', function(e){
                        if((e.keyCode || e.which) == 13){
                            e.preventDefault();
                            return false;
                        }
                    });
                }

                // append aria-invalid
                _field.attr('aria-invalid', _is_invalid);
                if(_is_invalid){
                    _field.attr('aria-describedby', _error_field_id);
                    _field.addClass(_invalid_className);
                } else {
                    _field.removeClass(_invalid_className);
                }

                if(_dataType){
                    var _place_holder = me.labels.enter_as_label + " " + _dataType;
                    if(_dataType.toLowerCase() === 'currency'){
                        _place_holder = me.labels.enter_as_currency;
                    } else if(_dataType.toLowerCase() === 'string'){
                        _place_holder = me.labels.enter_as_text;
                    }

                    var _layout = _field.attr('aria-layout');
                    if(me.isWindows && !_is_invalid){
                        if('QAQ' == _layout){
                            var _desc_field = $('#'+_field.attr('aria-describedby'));
                            var _desc_field_org_html = _desc_field.html();
                            _desc_field.html('<abbr class="screen-reader-text">'+_place_holder+', </abbr>' + _desc_field_org_html);

                            _field.bind('focus', function(){
                                _field.removeAttr('placeholder');
                            });
                            _field.bind('blur', function(){
                                _field.attr('placeholder', _place_holder);
                            });
                        } else if('QA' == _layout){
                            _field.attr('aria-placeholder', _place_holder);
                        }
                    }

                    _field.attr('placeholder', _place_holder);

                }
            }
        });

        if($('#surveyAndTreatmentForm').length > 0){
            // remove the role="alert" for 'bg_failure' class span
            $('.bg_failure').removeAttr('role');
        }
    },

    init_select2_label: function(){
        var me = this;

        var update_select_for_accessibility = function(select2_label_field, origin_select){
            var _select2_label_field = select2_label_field,
                _select2_present_text = _select2_label_field.text(),
                _select2_present_title = _select2_label_field.attr('title'),
                _org_select = origin_select? origin_select : $(_select2_label_field.closest(".select2-container").prev('select')[0]),
                _select_id = _org_select.attr('id') ? _org_select.attr('id').replace(/\./g, '\\.') : _org_select.attr('id'),
                _select_label = _org_select.attr('aria-label'),
                _select_labelled_by = _org_select.attr('aria-labelledby'),
                _select_desc_by = _org_select.attr('aria-describedby'),
                _select_label_for = _select_id ? $('label[for=' + _select_id + ']') : null,
                _select_required =_org_select.attr('aria-required'),
                _select_invalid =_org_select.attr('aria-invalid'),
                _update_label = _select_label;

            if (_select_labelled_by) {
                var _select_labelled_by_field = $('#' + _select_labelled_by);
                _update_label = _select_labelled_by_field.text().trim();
                if(_select_labelled_by_field.html().indexOf('aria-label="required"') > -1){
                    _update_label += ', ' + me.labels.required_label;
                }
            } else if(!_select_label && _select_label_for && _select_label_for.length > 0){
                _update_label = _select_label_for.text();
            }

            if (_update_label) {
                var _new_title = _select2_present_title + ', ' + _update_label;
                if(_select2_present_title === _select2_present_text){
                    _new_title = _update_label;
                }
                // _select2_label_field.attr('title', _new_title);
                _select2_label_field.removeAttr('title');
                _select2_label_field.html('<abbr class="screen-reader-text">' + _update_label + ', </abbr>' + _select2_present_text)
            }

            if (_select_desc_by || _select_required || _select_invalid) {
                var select2_combobox=_select2_label_field.parent();
                if(_select_desc_by){
                    select2_combobox.attr('aria-describedby', _select_desc_by);
                }
                if(_select_required){
                    select2_combobox.attr('aria-required', _select_required);
                }
                if(_select_invalid){
                    select2_combobox.attr('aria-invalid', _select_invalid);
                }
            }
        };

        // select event
        $('select').on("select2:select", function(e) {
            var _select = $(this),
                _select2_label = $(_select.next('.select2').find('.select2-selection__rendered')[0]);

            update_select_for_accessibility(_select2_label, _select);
        });

        // open option event
        $('select').on("select2:open", function(e) {
            var _select = $(this),
                _select2 = $(_select.next('.select2').find('.select2-selection')[0]),
                _aria_owns = _select2.attr('aria-owns'),
                _select2_option = _aria_owns? $('#'+_aria_owns) : null;

            if(_select2_option && _select2_option.length > 0){
                // _select2_option.attr('role', 'application').removeAttr('aria-expanded').attr('aria-live', 'assertive');
                _select2.removeAttr('aria-owns');
                setTimeout(function(){
                    var _li = _select2_option.find('li.select2-results__option[aria-selected=true]'),
                        _text = _li.text();
                    _li.html(_text + '<abbr class="screen-reader-text">, '+me.labels.selected_option_label+'</abbr>');

                    var _lis = _select2_option.find('li'),
                        _first_li = $(_lis.get(0)),
                        _last_li  = $(_lis.get(_lis.length -1));

                    if(_first_li && _first_li.length > 0){
                        var _text = _first_li.html();
                        var _count_message = me.labels.dropdown_list_count_label.replace("{0}", _lis.length);
                        _first_li.html(_text + '<abbr class="screen-reader-text">, '+_count_message+'</abbr>');
                    }
                    if(_last_li && _last_li.length > 0){
                        var _text = _last_li.html();
                        var _end_list_message = me.labels.dropdown_list_end_list_label;
                        _last_li.html(_text + '<abbr class="screen-reader-text">, '+_end_list_message+'</abbr>');
                    }
                }, 10);
            }
        });
        setTimeout(function(){
            $('.select2-selection__rendered').map(function () {
                var _select2_label_field = $(this),
                    _org_select = $(_select2_label_field.closest(".select2-container").prev('select')[0]);

                update_select_for_accessibility(_select2_label_field, _org_select);
            });
        }, 20);

    },

    init_tables: function(){
        // If mobile device
        // aria-hidden the table thread
        // for fixed: CA-12827
        var me = this;
        if(me.isMobileDevice){
            $('.no_more_tables thead tr').map(function(){
                $(this).attr('aria-hidden', true);
            })
        }
    },

    init_page_title: function(){
        // Init the page title text screen reader text, for fixed the ticket: TD-2606,
        // that for NVDA not read as the text: "Account Summary, last 4 digital account number, 2468"
        // I.E: accountSummary page
        //      Account Summary xxxx2468
        //  Expected read: "Account Summary, last 4 digital account number, 2468"
        //  Actual read: "Account Summary"

        var me = this;
        // wrap the span
        if($('.page_title h1').contents().length > 0){
            var page_title_text = $($('.page_title h1').contents()[0]).text();
            $($('.page_title h1').contents()[0]).wrap('<span aria-hidden="true"></span>').end();
            if($('#page_title_screen_reader').length == 0){
                var page_title_screen_reader = '<span class="screen-reader-text" role="text" id="page_title_screen_reader">'+
                    page_title_text + ', ' +  me.labels.page_title_screen_reader_suffix +
                    '</span>';

                $('.page_title h1').prepend(page_title_screen_reader);
            }
        }
    },

    init_reader: function () {
        this.append_lang_for_html();
        this.init_navigation_menu();
        this.auto_skip_read();
        this.append_attribute_for_container();
        this.init_radio_edit_field();
        this.init_fields_accessibility();
        this.init_field_by_label();
        this.init_workflow_form();
        this.init_tables();
        this.init_select2_label();
        this.init_page_title();

        this.auto_focus_to_error_field_or_info();
    }
};


$(document).ready(function () {
    ScreenReader.init_reader();
});