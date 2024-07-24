
$.extend($.fn.validatebox.defaults.rules, {
    CHS: {
        validator: function (value, param) {
            return /^[\u0391-\uFFE5]+$/.test(value);
        },
        message: 'Please enter Chinese characters'
    },
    english: {// Test of English
        validator: function (value) {
            return /^[A-Za-z]+$/i.test(value);
        },
        message: 'Please enter English'
    },
    date: {
        validator: function (value) {
            return /^(0?[1-9]|[12][0-9]|3[01])[\/\-\.](0?[1-9]|1[012])[\/\-\.](\d{4})$/i.test(value);
        }, message: "Ngày không đúng định dạng dd/mm/yyyy"
    },
    dateFormat: {
        validator: function (value) {
            return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/i.test(value);
        }, message: "Ngày không hợp lệ"
    },
    dateTimeFormat: {
        validator: function (value) {
            return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1})$/i.test(value);
        }, message: "Ngày không hợp lệ"
    },
    ip: {// Verify that the IP address
        validator: function (value) {
            return /\d+\.\d+\.\d+\.\d+/.test(value);
        },
        message: 'The IP address is not in the correct format'
    },
    ZIP: {
        validator: function (value, param) {
            return /^[0-9]\d{5}$/.test(value);
        },
        message: 'Postal code does not exist'
    },
    QQ: {
        validator: function (value, param) {
            return /^[1-9]\d{4,10}$/.test(value);
        },
        message: 'The QQ number is not correct'
    },
    mobile: {
        validator: function (value, param) {
            return /^(?:13\d|15\d|18\d)-?\d{5}(\d{3}|\*{3})$/.test(value);
        },
        message: 'Mobile phone number is not correct'
    },
    phone: {
        validator: function (value, param) {
            return /^([\+][0-9]{1,3}[\ \.\-])?([\(]{1}[0-9]{2,6}[\)])?([0-9\ \.\-\/]{3,20})((x|ext|extension)[\ ]?[0-9]{1,4})?$/i.test(value);
        }, message: "Hãy nhập số điện thoại đúng định dạng"
    },
    tel: {
        validator: function (value, param) {
            return /^(\d{3}-|\d{4}-)?(\d{8}|\d{7})?(-\d{1,6})?$/.test(value);
        },
        message: 'Hãy nhập số điện thoại đúng định dạng'
    },
    mobileAndTel: {
        validator: function (value, param) {
            return /(^([0\+]\d{2,3})\d{3,4}\-\d{3,8}$)|(^([0\+]\d{2,3})\d{3,4}\d{3,8}$)|(^([0\+]\d{2,3}){0,1}13\d{9}$)|(^\d{3,4}\d{3,8}$)|(^\d{3,4}\-\d{3,8}$)/.test(value);
        },
        message: 'Please input correct phone number'
    },
    number: {
        validator: function (value, param) {
            return /^[0-9]+?[0-9]*$/.test(value);
        },
        message: 'Please enter a number'
    },
    money: {
        validator: function (value, param) {
            return (/^(([1-9]\d*)|\d)(\.\d{1,2})?$/).test(value);
        },
        message: 'Please enter the correct amount'

    },
    mone: {
        validator: function (value, param) {
            return (/^(([1-9]\d*)|\d)(\.\d{1,2})?$/).test(value);
        },
        message: 'Please enter an integer or decimal'

    },
    integer: {
        validator: function (value, param) {
            return /^[\-\+]?\d+$/i.test(value);
        },
        message: "Số nguyên không hợp lệ"
    },
    integ: {
        validator: function (value, param) {
            return /^[+]?[0-9]\d*$/.test(value);
        },
        message: 'Please enter an integer'
    },
    number: {
        validator: function (value) {
            return /^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/i.test(value);
        }, message: "Số thập phân không hợp lệ"
    },
    range: {
        validator: function (value, param) {
            if (/^[1-9]\d*$/.test(value)) {
                return value >= param[0] && value <= param[1]
            } else {
                return false;
            }
        },
        message: 'The number of input in the {0} to {1}'
    },
    minLength: {
        validator: function (value, param) {
            return value.length >= param[0]
        },
        message: 'Enter at least {0} words'
    },
    maxLength: {
        validator: function (value, param) {
            return value.length <= param[0]
        },
        message: 'Most {0} words'
    },
    onlyNumberSp: {
        validator: function (value) {
            return /^[0-9\ ]+$/i.test(value);
        }, message: "Yêu cầu chỉ nhập số"
    },
    onlyLetterSp: {
        validator: function (value) {
            return /^[a-zA-Z\ \']+$/i.test(value);
        }, message: "Chỉ cho phép nhập chữ"
    },
    onlyLetterSpace: {
        validator: function (value) {
            return /^[a-zA-Z\ ]+$/i.test(value);
        }, message: "Chỉ được nhập chữ và dấu cách"
    },
    onlyLetterNumber: {
        validator: function (value) {
            return /^[0-9a-zA-Z]+$/i.test(value);
        }, message: "Có ký tự đặc biệt không cho phép nhập"
    },
    onlyPassword: {
        validator: function (value) {
            return /^[0-9a-zA-Z\.\@]+$/i.test(value);
        }, message: "Mật khẩu không có ký tự đặc biệt"
    },
    onlyUserName: {
        validator: function (value) {
            return /^[0-9a-zA-Z\.\_]+$/i.test(value);
        }, message: "Từ 6-15 ký tự, không có ký tự đặc biệt"
    },
    //Select is the selection box verification
    selectValid: {
        validator: function (value, param) {
            if (value == param[0]) {
                return false;
            } else {
                return true;
            }
        },
        message: 'Please select'
    },
    idCode: {
        validator: function (value, param) {
            return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
        },
        message: 'Please enter a valid identity card number'
    },
    loginName: {
        validator: function (value, param) {
            return /^[\u0391-\uFFE5\w]+$/.test(value);
        },
        message: 'The logon name only allows Chinese characters, letters, numbers and underscores English. '
    },
    equalTo: {
        validator: function (value, param) {
            return value == $(param[0]).val();
        },
        message: 'Two input character is not one to'
    },
    englishOrNum: {// English and digital input only
        validator: function (value) {
            return /^[a-zA-Z0-9_ ]{1,}$/.test(value);
        },
        message: 'Please enter English, digital, underlined or spaces'
    },
    xiaoshu: {
        validator: function (value) {
            return /^(([1-9]+)|([0-9]+\.[0-9]{1,2}))$/.test(value);
        },
        message: 'Up to two decimal places！'
    },
    ddPrice: {
        validator: function (value, param) {
            if (/^[1-9]\d*$/.test(value)) {
                return value >= param[0] && value <= param[1];
            } else {
                return false;
            }
        },
        message: 'Please enter a positive integer between 1 to 100'
    },
    jretailUpperLimit: {
        validator: function (value, param) {
            if (/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value)) {
                return parseFloat(value) > parseFloat(param[0]) && parseFloat(value) <= parseFloat(param[1]);
            } else {
                return false;
            }
        },
        message: 'Please enter between 0 to 100 up to two decimal digits'
    },
    rateCheck: {
        validator: function (value, param) {
            if (/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value)) {
                return parseFloat(value) > parseFloat(param[0]) && parseFloat(value) <= parseFloat(param[1]);
            } else {
                return false;
            }
        },
        message: 'Please enter between 0 to 1000 up to two decimal digits'
    }
});


$.map(['validatebox', 'textbox', 'passwordbox', 'filebox', 'searchbox',
    'combo', 'combobox', 'combogrid', 'combotree',
    'datebox', 'datetimebox', 'numberbox',
    'spinner', 'numberspinner', 'timespinner', 'datetimespinner'], function (plugin) {
        if ($.fn[plugin]) {
            $.fn[plugin].defaults.missingMessage = 'Thông tin bắt buộc.';
        }
    });
if ($.fn.validatebox) {
    $.fn.validatebox.defaults.rules.email.message = 'Hãy nhập email đúng định dạng.';
    $.fn.validatebox.defaults.rules.url.message = 'Hãy nhập URL đúng định dạng.';
    $.fn.validatebox.defaults.rules.length.message = 'Hãy nhập giá trị trong khoảng từ {0} đến {1}.';
    $.fn.validatebox.defaults.rules.remote.message = 'Hãy kiểm tra lại trường dữ liệu.';
}
function ContentKM() {
    var height = $(".sale_text").parent().height();
    var width = $(".sale_text").parent().width();
    if (width == 0) width = 250;
    $(".sale_text_content").css("height", "auto");
    $(".sale_text_content").css("width", width + "px");
}
function ShowSearch() {
    $('.header-middle .form-search input').toggle();
};
$(function () {
    ContentKM();
    $("#btnsearch").bind('click', function () {
        var key = $('#txtSearchItem').val();
        var url = '/tim-kiem';
        if (key != '') {
            var regex = /[*|,\\":<>\[\]/{}`'.;()@&$#%!+]/;
            if (regex.test(key)) {
                MessageBoxWarning("Từ khóa có ký tự đặc biệt. Vui lòng nhập lại.");
            }
            else {
                url += '/' + key;
                sessionStorage.setItem("keyword", key);
                window.location = url;
            }
        }
        else {
            MessageBoxWarning("Vui lòng nhập từ khóa để tìm kiếm.");
        }
    });

    $("#txtSearchItem").bind('keypress', function (event) {
        if (event.which == 13) {
            event.preventDefault();
            var key = $(this).val();
            var url = '/tim-kiem';
            if (key != '') {
                var regex = /[*|,\\":<>\[\]/{}`'.;()@&$#%!+]/;
                if (regex.test(key)) {
                    MessageBoxWarning("Từ khóa có ký tự đặc biệt. Vui lòng nhập lại.");
                }
                else {
                    url += '/' + key;
                    sessionStorage.setItem("keyword", key);
                    window.location = url;
                }
            }
        }
    });
});
(function ($) {
    jQuery.fn.putCursorAtEnd = function () {
        return this.each(function () {
            $(this).focus();
            // If this function exists...
            if (this.setSelectionRange) {
                // ... then use it
                // (Doesn't work in IE)

                // Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
                var len = $(this).val().length * 2;
                this.setSelectionRange(len, len);
            }
            else {
                // ... otherwise replace the contents with itself
                // (Doesn't work in Google Chrome)
                $(this).val($(this).val());
            }

            // Scroll to the bottom, in case we're in a tall textarea
            // (Necessary for Firefox and Google Chrome)
            this.scrollTop = 999999;
        });
    };

})(jQuery);
(function ($) {
    $.fn.setCursorToTextEnd = function () {
        $initialVal = this.val();
        this.val('');
        this.val($initialVal);
    };
})(jQuery);
function flyToElement(flyer, flyingTo, callBack /*callback is optional*/) {
    var $func = $(this);

    var divider = 3;

    var flyerClone = $(flyer).clone();
    $(flyerClone).css({
        position: 'absolute',
        top: $(flyer).offset().top + "px",
        left: $(flyer).offset().left + "px",
        opacity: 1,
        'z-index': 1000
    });
    $('body').append($(flyerClone));

    var gotoX = $(flyingTo).offset().left + ($(flyingTo).width() / 2) - ($(flyer).width() / divider) / 2;
    var gotoY = $(flyingTo).offset().top + ($(flyingTo).height() / 2) - ($(flyer).height() / divider) / 2;

    $(flyerClone).animate({
        opacity: 0.4,
        left: gotoX,
        top: gotoY,
        width: $(flyer).width() / divider,
        height: $(flyer).height() / divider
    }, 700,
        function () {
            $(flyingTo).fadeOut('fast', function () {
                $(flyingTo).fadeIn('fast', function () {
                    $(flyerClone).fadeOut('fast', function () {
                        $(flyerClone).remove();
                        if (callBack != null) {
                            callBack.apply($func);
                        }
                    });
                });
            });
        });
}

function flyFromElement(flyer, flyingTo, callBack /*callback is optional*/) {
    var $func = $(this);

    var divider = 3;

    var beginAtX = $(flyingTo).offset().left + ($(flyingTo).width() / 2) - ($(flyer).width() / divider) / 2;
    var beginAtY = $(flyingTo).offset().top + ($(flyingTo).width() / 2) - ($(flyer).height() / divider) / 2;

    var gotoX = $(flyer).offset().left;
    var gotoY = $(flyer).offset().top;

    var flyerClone = $(flyer).clone();

    $(flyerClone).css({
        position: 'absolute',
        top: beginAtY + "px",
        left: beginAtX + "px",
        opacity: 0.4,
        'z-index': 1000,
        width: $(flyer).width() / divider,
        height: $(flyer).height() / divider
    });
    $('body').append($(flyerClone));

    $(flyerClone).animate({
        opacity: 1,
        left: gotoX,
        top: gotoY,
        width: $(flyer).width(),
        height: $(flyer).height()
    }, 700,
        function () {
            $(flyerClone).remove();
            $(flyer).fadeOut('fast', function () {
                $(flyer).fadeIn('fast', function () {
                    if (callBack != null) {
                        callBack.apply($func);
                    }
                });
            });
        });
}

