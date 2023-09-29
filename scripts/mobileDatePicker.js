(function ($) {
    $.fn.mobileDatePicker = function (options,Ycallback,Ncallback) {
        //default option
        var that = $(this);
        var docType = $(this).is('input');
        var datetime = false;
        var selectedY = 1;
        var initY = 0;
        var yearScroll = null;
        var days = [];
        $.fn.mobileDatePicker.defaultOptions = {
            availableDays: '',
            theme:"date",
            mode:null,
            _mainDivId:"mainDivId",
            event:"click",
            okText:"Ok",
            topTipText:'Please select a date',
            cancelText:"Cancel",
            show:true
        }
        //override options
        var opts = $.extend( true, {}, $.fn.mobileDatePicker.defaultOptions, options );
        if(opts.theme === "datetime"){datetime = true;}
        if(!opts.show){
            that.unbind('click');
        }
        else{
            that.bind(opts.event,function () {
                createUL();      //create date component
                init_iScroll();   //int iScroll
                extendOptions(); //show component
                that.blur();
                refreshDate();
                bindButton();
            });
        };

        function refreshDate(){
            yearScroll.refresh();
            resetInitDate();
            yearScroll.scrollTo(0, initY*40, 100, true);
        }

        function resetIndex(){
            selectedY = 1;
        }
        function resetInitDate(){
            var currentDate = that.val();
            if(null == currentDate){
                initY = 0; //default select 0
            }else{
                for(var i = 1; i< days.length;i++){
                    if( currentDate === days[i]){
                        initY = i;
                        return false;
                    }
                }
            }

        }
        function bindButton(){
            resetIndex();
            $("#dateconfirm").unbind('click').click(function () {
                var dateStr = $("#yearwrapper ul li:eq("+selectedY+")").html();
                if(undefined === Ycallback){
                    if(docType){
                        that.val(dateStr);
                    }else{
                        that.html(dateStr);
                    }
                }else{
                    Ycallback(dateStr);
                }
                $("#datePage").hide();
                $("#dateshadow").hide();
            });
            $("#datecancle").click(function () {
                $("#datePage").hide();
                $("#dateshadow").hide();
                if(undefined != Ncallback){
                    Ncallback(false);
                }
            });
        }
        function extendOptions(){
            $("#datePage").show();
            $("#dateshadow").show();
        }

        /**
         * date scroll
         */
        function init_iScroll() {
            yearScroll = new iScroll("yearwrapper",{snap:"li",vScrollbar:false,
                onScrollEnd:function () {
                    selectedY = (this.y/40)*(-1) + 1 ;
                }});
        }

        function  createUL(){
            CreateDateUI();
            getDays();
            $("#yearwrapper ul").html(createYEAR_UL());
        }
        function CreateDateUI(){
            var str = ''+
                '<div id="dateshadow"></div>'+
                '<div id="datePage" class="page">'+
                '<section>'+
                '<div id="datetitle"><h1>'+opts.topTipText+'</h1></div>'+
                '<div id="datemark"><a id="markyear"></a><a id="markmonth"></a><a id="markday"></a></div>'+
                '<div id="datescroll">'+
                '<div id="yearwrapper">'+
                '<ul></ul>'+
                '</div>'+
                '</div>'+
                '</section>'+
                '<footer id="dateFooter">'+
                '<div id="setcancle">'+
                '<ul>'+
                '<li id="dateconfirm">'+opts.okText+'</li>'+
                '<li id="datecancle">'+opts.cancelText+'</li>'+
                '</ul>'+
                '</div>'+
                '</footer>'+
                '</div>';

            var $mainDivId = $('#'+opts._mainDivId);
            if(!$mainDivId.length > 0){
                $('body').append('<div id='+opts._mainDivId+'>'+str+'</div>');
            }else{
                $mainDivId.html(str);
            }
        }
        //create date ul
        function createYEAR_UL(){
            var str = "<li>&nbsp;</li>";
            for(var i = 0; i< days.length;i++){
                str+='<li>'+days[i]+'</li>'
            }
            return str+"<li>&nbsp;</li>";
        }

        /**
         * date Days
         * @returns {Array}
         */
        function getDays(){
            if(opts.availableDays) {
                days = opts.availableDays .split(";")
            }
        }
    }
})(jQuery);  
