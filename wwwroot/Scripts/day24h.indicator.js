// Manage showing, displaying icon that indicate an ajax
// request is running
// How to use SaveIndicator.indicate($.post(url,function(){}));


var SaveIndicator = (function () {
    var methods = {};
    var request_count = 0;
    var $indicator = $('#save-indicator');

    make_indicator = function () {
        var $obj = $('#save-indicator');
        if ($obj.length == 0) {
            $('body').append('<div id="save-indicator"/>');
            $obj = $('#save-indicator');
        }
        return $obj;
    };

    /**
    * Increase the number of requests by 1
    */
    methods.add_request = function () {
        request_count++;

        if (request_count > 0 && $indicator.is(':visible') === false) {
            if ($indicator.size() === 0)
                $indicator = make_indicator();
            $indicator.fadeIn(100);
        }
        return request_count;
    };

    /**
    * Reduce the number of requests by 1
    */
    methods.reduce_request = function () {
        if (request_count > 0)
            request_count--;

        if (request_count === 0 && $indicator.is(':visible')) {
            if ($indicator.size() === 0)
                $indicator = make_indicator();
            $indicator.fadeOut(100);
        }

        return request_count;
    };

    /**
    * Indicate this request is running visually by setting up
    * some callbacks into it
    * @param   {jqXHR}  request  The jQuery ajax object
    * @return  {jqXHR}  the request object
    */
    methods.indicate = function (request) {
        methods.add_request();

        request.complete(function () {
            SaveIndicator.reduce_request();
        });
        return request;
    };

    return methods;
} (SaveIndicator));
