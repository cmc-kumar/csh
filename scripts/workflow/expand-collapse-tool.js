/**
 * CA-11591 - Workflow Application -show/ hide dependent groups and sections in Customer portal to expand as needed
 * Version 1.0
 * javascript mini website: https://refresh-sf.com/
 **/


var countMap = {};
var ignore_class = 'ignore';

var EXPAND_COLLAPSE_UTILS = {

    section_class_prefix: 'workflow_group_',

    expand_collapse_tool_hidden_field_class: 'expand-collapse-tool-field',

    sectionMap: {},

    REMOVE_ALL: 'ALL',
    displayRowIndexMap: {},
    deletedRowIndexMap: {},

    $_isValid_field_type: function(type) {
        let _type = type.toLowerCase();
        return (_type != 'submit' && _type != 'cancel' && _type != 'image'
            && _type != 'hidden' && _type != 'readonly');
    },

    $_get_field_id: function(_field){
        let fldName = _field.attr('name');
        let questionId = !fldName ? null : fldName.substring(fldName.indexOf("[")+1, fldName.indexOf("]"));
        return !questionId ? null : 'answer_'+questionId;
    },

    /**
     * Clear the fields values
     * During deleted the row(s), the linked input/textarea/select will clear the value whatever
     * the value is entered or pre-populated
     * @param fields
     */
    $_clear_values: function (fields) {
        let validate_error_className = 'validate-failed';
        let validate_error_id = '{0}_error';
        let me = this;
        if (fields && fields.length > 0) {
            fields.each(function () {
                let $_field = $(this);
                let _type = this.type.toLowerCase();

                if (me.$_isValid_field_type(_type)) {
                    if (_type === 'checkbox' || _type === 'radio') {
                        $_field.prop("checked", false);
                    } else if (_type === 'select-one' || _type === 'select-multiple') {
                        $_field.prop('selectedIndex', null);
                    } else {
                        $_field.val('');
                    }
                    $_field.trigger("change");

                    // add 'ignore' class
                    // to prevent the front-end & back-end validation
                    // after clicked the 'add more'/ 'restore'
                    // will remove the 'ignore' class
                    $_field.addClass(ignore_class);

                    let $_field_id = me.$_get_field_id($_field);
                    if ($_field_id) {
                        let validate_error_label = $('#' + validate_error_id.replace('{0}', $_field_id));
                        $_field.removeClass(validate_error_className);
                        if (validate_error_label) {
                            validate_error_label.empty();
                        }
                    }
                }
            });
        }

        // restore the values
        EXPAND_COLLAPSE_UTILS.$_restore_pre_value(fields);
    },

    /**
     * Restore the pre-population values
     * if the field has pre-value
     * if the element configured pre-population
     * then after expand/show this group
     * the associated elements should set/selected the pre-v attribute value
     * @param fields
     */
    $_restore_pre_value: function (fields) {
        let me = this;
        if (fields && fields.length > 0) {
            fields.each(function () {
                let $_field = $(this);
                // clear the value after display, I think this is not needed
                let _type = this.type.toLowerCase();
                if (me.$_isValid_field_type(_type)) {
                    let pre_value = $_field.attr('pre-v');
                    if (pre_value && pre_value != undefined && pre_value != '') {
                        $_field.val(pre_value);
                        $_field.trigger("change");
                    }
                }
            });
        }
    },

    /**
     * Add 'ignore' class for all input/select/area fields
     * This prevent these fields to validation on both front-end and back-end.
     * During the group(all fields) displayed, then the 'ignore' class will removed
     * That means these displayed fields need to validation.
     */
    $_ignore_all_fields_for_all_sections: function(){
        let me =this;
        for(let key in this.sectionMap){
            let item = this.sectionMap[key],
                _secName = item['sectionName'],
                _groupClassName = this.section_class_prefix+_secName;

            let _fields = $('.'+_groupClassName + ' :input');
            _fields.each(function(){
                let _type = this.type.toLowerCase();
                let $_field = $(this);
                if(me.$_isValid_field_type(_type)){
                    $_field.addClass(ignore_class);
                }
            });
        }
    },

    $_get_questionId: function(groupClassName){
        let showMoreToggle = $('#'+groupClassName+'_show_more_toggle');
        if(showMoreToggle){
            return showMoreToggle.attr('data-q-id');
        }
        return null;
    },

    $_append_display_index_field: function(groupClassName){
        var me = this,
            field_id_suffix = groupClassName+'_display_rows',
            display_values =  me.displayRowIndexMap[groupClassName] || [];

        let $_field = $('#answer_'+field_id_suffix);
        if ($_field[0]) {
            $_field.val(display_values);
        } else {
            $($('form')[0]).append("<input type='hidden' id='answer_"+field_id_suffix+"'" +
                                    " name='answers["+field_id_suffix+"]'" +
                                    " class='"+me.expand_collapse_tool_hidden_field_class+"'" +
                                    " data-group='"+groupClassName+"'" +
                                    " data-type='display-rows'"+
                                    " value='" + display_values + "'>");
        }
    },

    $_append_deleted_index_field: function(groupClassName){
        var me = this,
            field_id_suffix = groupClassName+'_deleted_rows',
            deleted_values =  me.deletedRowIndexMap[groupClassName] || [];

        let $_field = $('#answer_'+field_id_suffix);
        if ($_field[0]) {
            $_field.val(deleted_values);
        } else {
            $($('form')[0]).append("<input type='hidden' id='answer_"+field_id_suffix+"'" +
                " name='answers["+field_id_suffix+"]'" +
                " class='"+me.expand_collapse_tool_hidden_field_class+"'" +
                " data-group='"+groupClassName+"'" +
                " data-type='deleted-rows'"+
                " value='" + deleted_values + "'>");
        }
    },

    $_get_display_field_values: function(groupClassName){
        let me = this,
            field_id_suffix = groupClassName+'_display_rows';

        let $_field = $('#answer_'+field_id_suffix);
        let _value = $_field.val();
        let values =  $_field[0] && _value && _value !='' ? _value.split(',') : null;
        if(values && values.length > 0){
            return values.map(function(v){
                return parseInt(v);
            })
        }
        return [];
    },

    $_get_deleted_field_values: function(groupClassName){
        let me = this,
            field_id_suffix = groupClassName+'_deleted_rows';

        let $_field = $('#answer_'+field_id_suffix);
        let _value = $_field.val();
        let values =  $_field[0] && _value && _value!='' ? _value.split(',') : null;
        if(values && values.length > 0){
            return values.map(function(v){
                return parseInt(v);
            })
        }
        return [];
    },

    $_add_row_index: function(groupClassName, row_index){
        let me = this;

        if(groupClassName && row_index){
            if(!me.displayRowIndexMap[groupClassName]){
                me.displayRowIndexMap[groupClassName] = [row_index];
            } else {
                if(me.displayRowIndexMap[groupClassName].indexOf(row_index) <= -1){
                    me.displayRowIndexMap[groupClassName].push(row_index);
                }
            }

            me.$_append_display_index_field(groupClassName);
        }
    },

    $_remove_row_index: function(groupClassName, row_index){
        let me = this;

        if(groupClassName && row_index){
            if(typeof(row_index)=='string' && row_index.toLowerCase() == 'all'){
                if(me.displayRowIndexMap[groupClassName]){
                    me.displayRowIndexMap[groupClassName] = undefined;
                }
                if(me.deletedRowIndexMap[groupClassName]){
                    me.deletedRowIndexMap[groupClassName] = undefined;
                }

            } else if(typeof(row_index) == 'number'){
                if(!me.displayRowIndexMap[groupClassName]){
                    me.displayRowIndexMap[groupClassName] = me.$_get_display_field_values(groupClassName);
                }
                if(me.displayRowIndexMap[groupClassName]) {
                    me.displayRowIndexMap[groupClassName] = $.grep(me.displayRowIndexMap[groupClassName], function(v){
                        return v != row_index;
                    });
                }

                if(!me.deletedRowIndexMap[groupClassName]){
                    me.deletedRowIndexMap[groupClassName] = me.$_get_deleted_field_values(groupClassName);
                }

                if(me.deletedRowIndexMap[groupClassName]) {
                    if(me.deletedRowIndexMap[groupClassName].indexOf(row_index) <= -1){
                        me.deletedRowIndexMap[groupClassName].push(row_index);
                    }
                }
            }

            me.$_append_display_index_field(groupClassName);
            me.$_append_deleted_index_field(groupClassName);
        }
    },

    $_restore_all_deleted_rows: function(groupClassName){
        if(this.deletedRowIndexMap[groupClassName]){
            this.deletedRowIndexMap[groupClassName] = undefined;
        }
        this.$_append_deleted_index_field(groupClassName);
    },

    $_init_collapse_expand_during_loading: function(){
        let me = this;
        me.displayRowIndexMap = {};
        me.deletedRowIndexMap = {};
        let $_fields = $('input[type=hidden].'+me.expand_collapse_tool_hidden_field_class);
        $_fields.each(function () {
            let $_field = $(this),
                groupClass = $_field.attr('data-group'),
                dataType = $_field.attr('data-type'),
                dataValue = $_field.val();

            if (dataType == 'display-rows' && dataValue) {
                me.displayRowIndexMap[groupClass] = dataValue.split(',').map(function(v){
                    return parseInt(v);
                });

            } else if(dataType == 'deleted-rows' && dataValue){
                me.deletedRowIndexMap[groupClass] = dataValue.split(',').map(function(v){
                    return parseInt(v);
                });
            }
        });


        for(let groupClass in me.displayRowIndexMap){
            let items = me.displayRowIndexMap[groupClass];
            if(groupClass && items){
                addMoreBtnHandler(groupClass, items, []);
            }
        }

        for(let groupClass in me.deletedRowIndexMap){
            let items = me.deletedRowIndexMap[groupClass];
            deleteGroup(groupClass, null, items);
            addMoreBtnHandler(groupClass, [], items);
        }

    }
};

/**
 * The 'Add More' button handler
 * Show next group with same section name
 * @param {string} className
 * @param {number[]} [autoDisplayRows]
 * @param {number[]} [autoDeletedRows]
 */
function addMoreBtnHandler(className, autoDisplayRows, autoDeletedRows) {
    let maxDelIndex = null;
    let _startIndex = 1;
    let _index = countMap[className] || _startIndex;
    let groups = document.getElementsByClassName(className);
    let me = document.getElementById(className + "_add_more_btn");

    for (var i = _index; i < groups.length; i++) {
        var group = groups[i];

        if(autoDisplayRows && autoDisplayRows.length >= 0){
            // pre-display rows
            // if the workflow has confirm page
            // in confirm page clicked the 'Edit' button
            // return to workflow edit page, this case need pre-auto display
            // previous which clicked the 'submit' button displayed rows.
            if(autoDisplayRows.indexOf(i) > -1){
                $(group).removeClass('workflow_group_hide');
                _index = i;

                let fields = $(group).find(':input');
                fields.map(function(){
                    let _field = $(this),
                        _type = _field[0].type.toLowerCase();

                    if(EXPAND_COLLAPSE_UTILS.$_isValid_field_type(_type)){
                        _field.removeClass(ignore_class);
                    }
                });
            }
        } else if (group) {
            let fields = $(group).find(':input');
            let flag = false;
            let first_que_idx = -1;
            for (let j = 0; j < fields.length; j++) {
                let _type = fields[j].type.toLowerCase();

                if(EXPAND_COLLAPSE_UTILS.$_isValid_field_type(_type)){
                    if (first_que_idx <= -1) {
                        first_que_idx = j;
                    }
                    // focus the per field
                    // setTimeout(function(){
                    //     fields[j].focus();
                    // }, 10);

                    // during display the field
                    // remove the input/select/textarea
                    // class 'ignore'
                    let $_field = $(fields[j]);
                    $_field.removeClass(ignore_class);

                    flag = true;
                }

                // if (_type != 'hidden' && _type != 'readonly') {
                //     flag = true;
                //     break;
                // }
            }

            // re-focus on the first element with one group.
            if(first_que_idx > -1){
                setTimeout(function(){
                    fields[first_que_idx].focus();
                }, 10);
            }

            // element.classList.remove('workflow_group_hide');
            $(group).removeClass('workflow_group_hide');
            _index = i;
            EXPAND_COLLAPSE_UTILS.$_add_row_index(className, _index);
            if (flag) {
                break;
            }
        }
    }

    // max index of deleted rows
    if (autoDeletedRows && autoDeletedRows.length > 0) {
        maxDelIndex = autoDeletedRows[0];
        for (var k = 1; k < autoDeletedRows.length; k++) {
            if (maxDelIndex < autoDeletedRows[k]) {
                maxDelIndex = autoDeletedRows[k];
            }
        }
    }

    if (!maxDelIndex) {
        _index++;
        countMap[className] = _index;
    } else if (maxDelIndex >= _index) {
        _index = maxDelIndex;
        _index++;
        countMap[className] = _index;
    }

    if(autoDisplayRows){
        let _auto_total = autoDisplayRows.length + (EXPAND_COLLAPSE_UTILS.deletedRowIndexMap[className]? EXPAND_COLLAPSE_UTILS.deletedRowIndexMap[className].length:0);
        if(!me && _index < groups.length && _auto_total < groups.length-1){
            // if not append the show more button
            // append it
            let key = className.replace('workflow_group_', '');
            let showMoreBtnText = EXPAND_COLLAPSE_UTILS.sectionMap[key]['showMoreBtnText'];
            appendShowMoreButton(className, showMoreBtnText);
            me = document.getElementById(className + "_add_more_btn");
        }
    }

    if (_index >= groups.length && me && me.className.indexOf('btn_hide') <= -1) {
        // hide add more btn
        $(me).addClass('btn_hide')
    } else if (_index < groups.length && me && me.className.indexOf('btn_hide') > -1) {
        // show add more btn
        $(me).removeClass('btn_hide');
    }

    if(me){
        // un focus the 'add more' button.
        me.blur();
    }
}

/**
 * Collapse by section class name
 * @param groupClassName
 */
function collapseSections(groupClassName) {
    let _startIndex = 1;
    countMap[groupClassName] = undefined;
    let showMoreBtnID = groupClassName + "_add_more_btn";
    let restore_container = document.getElementById(groupClassName + '_restore');
    let showMoreBtn = document.getElementById(showMoreBtnID);
    let groups = document.getElementsByClassName(groupClassName);
    for (let i = _startIndex; i < groups.length; i++) {
        let group = groups[i];
        if (group && group.className.indexOf('workflow_group_hide') <= -1) {
            // group.className += " workflow_group_hide";
            $(group).addClass('workflow_group_hide');
        }
        if (group && group.className.indexOf('workflow_group_deleted') > -1) {
            // group.classList.remove('workflow_group_deleted');
            $(group).removeClass('workflow_group_deleted');
        }

        // clear the elements values
        let fields = $(group).find(":input");
        EXPAND_COLLAPSE_UTILS.$_clear_values(fields);
    }

    if (showMoreBtn && showMoreBtn.className.indexOf('btn_hide') <= -1) {
        $(showMoreBtn).addClass('btn_hide');
    }
    // hide the restore button
    if (restore_container.className.indexOf('btn_hide') < 0) {
        $(restore_container).addClass('btn_hide');
        let restoreTr = $($(restore_container).closest('tr')[0]);
        restoreTr.addClass('btn_hide');
    }

    EXPAND_COLLAPSE_UTILS.$_remove_row_index(groupClassName, EXPAND_COLLAPSE_UTILS.REMOVE_ALL);
}


/**
 * Show More button handler
 * @param groupClassName
 * @param showMoreBtnText
 * @param checkbox
 */
function showMoreToggleHandler(groupClassName, showMoreBtnText, checkbox) {
    try {
        let showMoreBtnID = groupClassName + "_add_more_btn";
        let showMoreBtn = document.getElementById(showMoreBtnID);
        let allowShowMore = checkbox.checked;

        $(checkbox).parent().attr('aria-checked', allowShowMore);

        if (!showMoreBtn) {
            // append the 'add more button' after the last @groupClassName tr
            appendShowMoreButton(groupClassName, showMoreBtnText);
        }

        if (allowShowMore) {
            addMoreBtnHandler(groupClassName);
        } else {
            collapseSections(groupClassName);
        }
    }catch (e) {
        console.error(e);
    }
}

function appendShowMoreButton(groupClassName, showMoreBtnText){
    let showMoreBtnID = groupClassName + "_add_more_btn";
    let showMoreBtn = document.getElementById(showMoreBtnID);

    if (!showMoreBtn) {
        // append the 'add more button' after the last @groupClassName tr
        let showMoreBtnHtml = '<tr style="border: none"> ' +
            '<td align="left" valign="top"> ' +
            '<div tabindex="0" role="button" aria-label="'+showMoreBtnText+'" class="addMore_Btn btn_hide" ' +
            'id="' + showMoreBtnID + '" ' +
            'onclick="addMoreBtnHandler(\'' + groupClassName + '\')">' + showMoreBtnText +
            '</div>' +
            '</td>' +
            '</tr>';
        let trs = $('.' + groupClassName);
        let lastTr = trs[trs.length - 1];
        $(showMoreBtnHtml).insertAfter(lastTr);

        // bind enter event
        $('#'+showMoreBtnID).bind('keyup',function (e) {
            if((e.keyCode || e.which) == 13){
                addMoreBtnHandler(groupClassName);
            }
        });
    }
}


/**
 * Delete one group
 * Hide this group all elements and marked these fields as 'ignore' class (prevent to validation)
 * @param groupClassName
 * @param delIndex
 * @param autoDeletedRows
 */
function deleteGroup(groupClassName, delIndex, autoDeletedRows) {
    let groups = document.getElementsByClassName(groupClassName);
    let restore_container = document.getElementById(groupClassName + '_restore');
    let deleted_counter = $('.' + groupClassName + '.workflow_group_deleted').length; // how many rows deleted

    if(autoDeletedRows && autoDeletedRows.length > 0){
        for (let i = 1; i < groups.length; i++) {
            const group = groups[i];
            if(autoDeletedRows.indexOf(i) > -1){
                deleted_counter++;
                $(group).addClass('workflow_group_hide workflow_group_deleted');
                let fields = $(group).find(':input');
                EXPAND_COLLAPSE_UTILS.$_clear_values(fields);
            }
        }
    } else if (delIndex > 0 && delIndex <= groups.length) {
        var delElement = groups[delIndex];
        if (delElement) {
            if (delElement.className.indexOf('workflow_group_hide') <= -1) {
                deleted_counter++;
                $(delElement).addClass('hide-animate');
                // add the display none
                // and remove the hide-animate class
                setTimeout(function () {
                    $(delElement).removeClass('hide-animate');
                    $(delElement).addClass('workflow_group_hide workflow_group_deleted');
                }, 500);
            }

            // clear the elements values
            // var fields = delElement.getElementsByTagName('input');
            let fields = $(delElement).find(':input');
            EXPAND_COLLAPSE_UTILS.$_clear_values(fields);

            EXPAND_COLLAPSE_UTILS.$_remove_row_index(groupClassName, delIndex);
        }
    }

    // if all rows were deleted
    // then make the toggle to 'No'.
    // fixed CA-13521
    if(deleted_counter == groups.length-1){
        let toggle_checkbox_id=groupClassName+'_show_more_toggle';
        $('#'+toggle_checkbox_id).click();
        setTimeout(function () {
            collapseSections(groupClassName);
        }, 510);
    } else {
        // show or hide the restore button
        setTimeout(function () {
            if (deleted_counter > 0) {
                // show the total deleted counter
                restore_container.childNodes[3].innerText = $('.' + groupClassName + '.workflow_group_deleted').length;

                if (restore_container.className.indexOf('btn_hide') > -1) {
                    $(restore_container).removeClass('btn_hide');
                    let restoreTr = $($(restore_container).closest('tr')[0]);
                    restoreTr.removeClass('btn_hide');
                }
            } else {
                if (restore_container.className.indexOf('btn_hide') < 0) {
                    $(restore_container).addClass('btn_hide');
                    let restoreTr = $($(restore_container).closest('tr')[0]);
                    restoreTr.addClass('btn_hide');
                }
            }
        }, 510);
    }
}

/**
 * Restore deleted the rows
 * Show all elements which the deleted rows/groups
 * And remove the all fields (not hidden or readonly type) 'ignore' class.
 * @param groupClassName
 */
function restoreDeletedGroup(groupClassName) {
    let restore_container = document.getElementById(groupClassName + '_restore');
    let groups = document.getElementsByClassName(groupClassName);
    for (let i = 1; i < groups.length; i++) {
        let group = groups[i];
        if (group.className.indexOf('workflow_group_deleted') > -1) {
            $(group).removeClass('workflow_group_deleted workflow_group_hide');

            // after display the fields
            // will remove the 'ignore' class
            let _fields = $(group).find(':input');
            _fields.each(function(){
                let _type = this.type.toLowerCase();
                let $_field = $(this);
                if(EXPAND_COLLAPSE_UTILS.$_isValid_field_type(_type)){
                    $_field.removeClass(ignore_class);
                }
            });

            EXPAND_COLLAPSE_UTILS.$_add_row_index(groupClassName, i);
        }
    }

    EXPAND_COLLAPSE_UTILS.$_restore_all_deleted_rows(groupClassName);

    // hide the restore button
    if (restore_container.className.indexOf('btn_hide') < 0) {
        $(restore_container).addClass('btn_hide');
        let restoreTr = $($(restore_container).closest('tr')[0]);
        restoreTr.addClass('btn_hide');
    }
}


$().ready(function(){
    EXPAND_COLLAPSE_UTILS.$_ignore_all_fields_for_all_sections();
    EXPAND_COLLAPSE_UTILS.$_init_collapse_expand_during_loading();

    // init the show more toggle can select/unselect by keyboard
    $('.show-more-toggle-button').bind('keyup', function(e){
        if((e.keyCode || e.which) === 13){
            let _checkbox = $(this).find('input[type=checkbox]')[0],
                _checked = _checkbox.checked;
            _checkbox.checked = !_checked;
            $(_checkbox).trigger('change');
        }
    });

});