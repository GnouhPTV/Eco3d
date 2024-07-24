function ClearCache() {
    $.ajax({
        type: "POST",
        url: "/ManageCart/ClearCache",
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (response) {
            var value = response.d;
            console.log("Đã xóa cache");
        }
    });
        //axios.post('/ManageCart/ClearCache', {})
    //    .then(function (response) {
    //        console.log(response);
    //        console.log("Đã xóa cache");
    //    })
    //    .catch(function (error) {
    //        console.log(error);
    //    });
}
// detect mobile
function DetectMobile() {
    var sw = $(window).width();
    if (sw < 768) {
        return "1";
    } 
    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        },
        none: function() {
            return (!isMobile.any());
        }
    };
    if (isMobile.any()){
        return "1";
    } else if (isMobile.none()) {
        return "0";
    }
    return "0";
}
function getToDay() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = dd + '/' + mm + '/' + yyyy;
    return today;
}
function GetWebsite() {
    var website = $('#drWebsite_frm').val();
    if (typeof (website) == 'undefined') website = "";//$('txtHostName_Header').val();
    return website;
}
function loadjscssfile(filename, filetype) {
            if (filetype == "js") { //if filename is a external JavaScript file
                var fileref = document.createElement('script')
                fileref.setAttribute("src", filename)
            }
            else if (filetype == "css") { //if filename is an external CSS file
                var fileref = document.createElement("link")
                fileref.setAttribute("rel", "stylesheet")
                fileref.setAttribute("type", "text/css")
                fileref.setAttribute("href", filename)
            }
            if (typeof fileref != "undefined")
                document.getElementsByTagName("head")[0].appendChild(fileref)
        }
// fix datebox
$.fn.datebox.defaults.formatter = function (date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return (d < 10 ? '0' + d : d) + '/' + (m < 10 ? '0' + m : m) + '/' + y;
};

$.fn.datebox.defaults.parser = function (s) {
    if (s) {
        var a = s.split('/');
        var d = new Number(a[0]);
        var m = new Number(a[1]);
        var y = new Number(a[2]);
        var dd = new Date(y, m - 1, d);
        return dd;
    } else {
        return new Date();
    }
};


// Lấy giá trị Regsystem File
function GetValueRegSystem(code, id) {
    $.ajax({
        type: "POST",
        url: "/ManageCart/GetRegSystemFile",
        data: "{'code':'" + code + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (response) {
            var value = response.d;
            document.getElementById(id).innerHTML = value;
        }
    });
}

function GetMax_Number(field, table, id, cond) {
    $.ajax({
        type: "POST",
        url: "/ManageCart/Max_Number_Field",
        data: "{Field:'" + field + "',Table:'" + table + "',Cond: '" + cond + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#" + id).val(response.d);
        }
    });
}
function AutoGeneral_ViTri(table,filter,fvalue,id) {
    $.ajax({
        type: "POST",
        url: "/ManageCart/AutoGeneral_ViTri",
        data: "{Table: '"+ table + "',Filter: '" + filter +"',Fvalue:'"+ fvalue +"' }",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var text = response.d;
            $("#" + id).val(response.d);
        }
    });
}
// message box
function MessageBoxError(s) {
    //$.messager.alert('Thông báo', s, 'error');
    showToast("err", s);
}
function MessageBoxSuccess(s) {
     showToast("msg", s);
    //$.messager.alert('Thông báo', s, 'info');
}
function MessageBoxWarning(s) {
    showToast("war", s);
    //$.messager.alert('Thông báo', s, 'warning');
}
// message box
function MessageBoxSuccessLink(s) {
    $.messager.confirm('Hoàn thành', 'Bạn muốn tiếp tục ?', function (r) {
        if (!r) {
            window.location = s;
        }
    });
}
function ShowMessage(s) {
     showToast("msg", s);    
//    $.messager.show({
//        title: 'Thông báo',
//        msg: '<i class="fa fa-info-circle"></i><div>' + s + '</div>',
//        timeout: 5000,
//        style: {
//            left: 0,
//            right: '',
//            top: '',
//            bottom: -document.body.scrollTop - document.documentElement.scrollTop
//        }
//    });
}

function ShowMessageW(s) {
    showToast("war", s);
//    $.messager.show({
//        title: 'Cảnh báo',
//        msg: '<i class="fa fa-warning"></i><div>' + s + '</div>',
//        timeout: 5000,
//        style: {
//            left: 0,
//            right: '',
//            top: '',
//            bottom: -document.body.scrollTop - document.documentElement.scrollTop
//        }
//    });
}
function ShowComfirm(title,msg,funcOK, funcNO){
            iziToast.show({
                color: 'dark',
                icon: 'iziToast-icon ico-question revealIn',
                title: title,
                message: msg,
                position: 'center', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
                progressBarColor: 'rgb(0, 255, 184)',
                buttons: [
          [
            '<button>Đồng ý</button>',
            function (instance, toast) {
               if (funcOK && (typeof funcOK == "function")) {
                  funcOK();   
               }
                //end ajax
                instance.hide({
                    transitionOut: 'fadeOutUp'
                }, toast);
            }
          ],
          [
            '<button>Đóng</button>',
            function (instance, toast) {
                if (funcNO && (typeof funcNO == "function")) {
                    funcNO();   
                }
                instance.hide({
                    transitionOut: 'fadeOutUp'
                }, toast);
            }
          ]
        ]
            });
}

// no-img
function imgError(image) {
    image.onerror = "";
    image.src = "/Images/no-img.jpg";
    return true;
}
function numberWithCommas(This) {
    var phone = ('"' + This.val() + '"').replace(/[^\d]+/g, '');
    var length = phone.length;
    if (length >= 10 && length <= 12) {
        if (length === 10) {
            This.val(phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1.$2.$3"));
        }
        if (length === 11) {
            This.val(phone.replace(/(\d{4})(\d{3})(\d{4})/, "$1.$2.$3"));
        }
        if (length === 12) {
            This.val(phone.replace(/(\d{4})(\d{4})(\d{4})/, "$1.$2.$3"));
        }
    }
}

function isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    }
    return false;
}
function isNumber(evt) {
    var iKeyCode = (evt.which) ? evt.which : evt.keyCode
    if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57) && iKeyCode!=13)
        return false;

    return true;
}  
function isPhone(phone) {
    phone = String(phone);
    var x = phone.substring(0, 1);
    var x2 = phone.substring(1, 2);
    if (phone.length !== 10 || x !== '0' || x2 === '0' || validatePhone(phone) === false) return false;
    else return true;
}
function validatePhone(txtPhone) {
    var filter = /^[0-9-+]+$/;
    return filter.test(txtPhone);
}

function showToast(type, message) {
    var title = "";
    console.log(type + "|" + message);
    switch (type) {
        case "msg":
            title = "Hii!";
            iziToast.success({
                message: message,
            });
            break;
        case "err":
            title = "Lỗi: ";
            iziToast.error({
                title: title,
                message: message,
            });
            break;
        case "war":
            title = "Oop!";
            iziToast.warning({
                title: title,
                message: message,
            });
            break;
        default:
            title = "Hii!";
            iziToast.message({
                title: title,
                message: message,
            });
    }
};
function GetNameToDay(){
    var date = new Date(); 
    // Lấy số thứ tự của ngày hiện tại
    var current_day = date.getDay();
     // Khai báo đối tượng Date
    var date = new Date(); 
    // Lấy số thứ tự của ngày hiện tại
    var current_day = date.getDay();
    return GetNameDay(current_day);
}
function GetNameDay(current_day){ 
    // Biến lưu tên của thứ
    var day_name = ''; 
    // Lấy tên thứ của ngày hiện tại
    switch (current_day) {
    case 0:
        day_name = "Chủ nhật";
        break;
    case 1:
        day_name = "Thứ hai";
        break;
    case 2:
        day_name = "Thứ ba";
        break;
    case 3:
        day_name = "Thứ tư";
        break;
    case 4:
        day_name = "Thứ năm";
        break;
    case 5:
        day_name = "Thứ sau";
        break;
    case 6:
        day_name = "Thứ bảy";
    }
    return day_name;
}

        // Price
        function GetMoneyTextBox(id) {
            var value = document.getElementById(id).value.trim();
            if (value == "" || typeof value == "undefined") {
                value = "0";
            }
            var value = value.replace(/,/g, "");
            return value;
        }
        function GetMoneyHTML(id) {
            var value = document.getElementById(id).innerHTML.trim();
            if (value == "" || typeof value == "undefined") {
                value = "0";
            }
            var value = value.replace(/,/g, "");
            return value;
        }
        // Price fomat
        function FormatPrice(nStr) {
            nStr += '';
            var x = nStr.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        }
        function onKeyUpMoney(Num, id) {
            Num += '';
            Num = Num.replace(',', ''); Num = Num.replace(',', ''); Num = Num.replace(',', '');
            Num = Num.replace(',', ''); Num = Num.replace(',', ''); Num = Num.replace(',', '');
            x = Num.split('.');
            x1 = x[0];
            x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1))
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            document.getElementById(id).value = x1 + x2;
        }
        function isNumberKey(evt) {
            var charCode = (evt.which) ? evt.which : event.keyCode
            if (charCode != 46 && charCode > 31
            && (charCode < 48 || charCode > 57))
                return false;
            return true;
        }
        // File Upload
        function UpLoadImage(id, url, width, height) {
            var fileUpload = $("[id='" + id + "']").get(0);
            var files = fileUpload.files;
            var data = new FormData();
            for (var i = 0; i < files.length; i++) {
                data.append(files[i].name, files[i]);
            }
            data.append("url", url);
            data.append("width", width);
            data.append("height", height);
            $.ajax({
                url: "/WebService/FileUpload.ashx",
                type: "POST",
                data: data,
                contentType: false,
                processData: false,
                success: function (result) {
                    if (result == "1") {
                        // Reload
                        MessageBoxSuccess("Đăng ảnh thành công.");
                    } else {
                        MessageBoxWarning("Vui lòng chọn lại ảnh.");
                        $("#" + id).val("");
                    }
                }
            });
        }
        // format date
        function formatDate(date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + strTime;
        }

        // Get url
(function (expCharsToEscape, expEscapedSpace, expNoStart, undefined) {
    modURLParam = function (url, paramName, paramValue) {
        paramValue = paramValue != undefined
            ? encodeURIComponent(paramValue).replace(expEscapedSpace, '+') : paramValue;
        var pattern = new RegExp('([?&]' + paramName.replace(expCharsToEscape, '\\$1') + '=)[^&]*');
        if (pattern.test(url)) {
            return url.replace(pattern,
                function ($0, $1) {
                    return (paramValue != undefined && paramValue != "") ? $1 + paramValue : '';
                }
            ).replace(expNoStart, '$1?');
        }
        else if (paramValue != undefined && paramValue != "") {
            return url + (url.indexOf('?') + 1 ? '&' : '?') + paramName + '=' + paramValue;
        }
        else {
            return url;
        }
    };
})(/([\\\/\[\]{}().*+?|^$])/g, /%20/g, /^([^?]+)&/);
        //
        function GetUrl(a, b) {
            var url = document.URL;
            url = modURLParam(url, a, b);
            location.href = url;
}

function GetUrls(a, b, c, d) {
    var url = document.URL;
    url = modURLParam(url, a, b);
    url = modURLParam(url, c, d);
    location.href = url;
}
        //Editor


function RenderEditor(tbox, value) {
    var height = 600;
    RenderEditor(tbox, value, height);
}
function RenderEditor(tbox, value, editHeight) {
    if(typeof editHeight == "undefined")  editHeight = 600;
    console.log("Height Editor : " + editHeight);
 
    var container = tbox + "_div";
    var editor = tbox + "_editor";
    var id_editor = $(editor).attr("id");

    if (id_editor == "undefined") return;
    $(container).empty();
    $(container).append('<textarea id="' + id_editor + '" class="teditor2 easyui-validatebox">' +
                                value + '</textarea>');
    $(tbox).val(value);
    $(tbox).hide();


    width = (window.innerWidth > 0) ? window.innerWidth : screen.width;


    var stoolbar = 'template insert | undo redo |  formatselect fontsizeselect |  bold italic forecolor backcolor  | alignleft aligncenter alignright alignjustify | removeformat | preview code fullscreen';
    if (width <= 768) {
        editHeight = width;
        stoolbar = 'insert alignleft aligncenter alignright alignjustify code fullscreen';
    }


    tinymce.init({
        setup: function (ed) {
            ed.on('change', function (e) {
                $(tbox).val(ed.getContent());
            });
        },
        relative_urls: false,
        selector: editor,
        height: editHeight,
        menubar: false,
        plugins: [
                'advlist autolink lists link image preview anchor textcolor template',
                'searchreplace visualblocks fullscreen',
                'insertdatetime media table contextmenu paste code help wordcount', 'advcode fullscreen preview'
              ],
        toolbar: stoolbar,
        content_style: ".mce-content-body {padding:10px;}",
        content_css: [
                '/Styles/bootstrap.min.css',
                '/Styles/content_editor.css',
                '/Styles/style.css',
                '/Styles/template.css',
                ],
        code_dialog_width: 800,
        code_dialog_height: 600,
        preview_dialog_width: 800,
        template_replace_values: {
            Content_11: GetContent("Content_11")
        },
        file_browser_callback: function (field, url, type, win) {
            tinyMCE.activeEditor.windowManager.open({
                url: '/FileBrowser/FileBrowser.aspx?caller=tinymce4&langCode=en&type=' + type,
                title: 'File Browser',
                width: 700,
                height: 500,
                inline: true,
                close_previous: false
            }, {
                window: win,
                field: field
            });
            return false;
        },
        templates: [
                { title: 'Mẫu link quan tâm block', description: 'Mẫu link quan tâm block', "url": "/Images/Template/Temp_Link_Block.htm" },
                { title: 'Thông tin liên hệ Eco3d', description: 'Thông tin liên hệ Eco3d', "url": "/Images/Template/Temp_Contact.htm" },
                { title: 'Tiêu đề 1', description: 'Mẫu tempalte tiêu đề đoạn tin', "url": "/Images/Template/Temp_heading.htm" },
                { title: 'Block', description: 'Mẫu tempalte Block', "url": "/Images/Template/Temp_Block.htm" },
                { title: 'Slide sản phẩm', description: 'Mẫu tempalte Slide sản phẩm', "url": "/Images/Template/Temp_Slide_Info.htm" }
                ]
    });
}
function GetContent(id) {
    var value = $("#" + id).val();
    if (value == null) value = "Nội dung Template";
    return value;
}
// String 
String.prototype.replaceAll = function (find, replace) {
    if (replace === undefined) {
        return this.toString();
    }
    return this.replace(new RegExp(find, 'g'), replace);
};
function Xoa_dau(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}
function UrlString(str){
    str = str.replace(/[#$%^&*()]/g, "");
    str = str.replace(/\s/g, "-");
    str = Xoa_dau(str);
    return str;
}
function FixImgUrl(imgUrl){
    if(imgUrl.startsWith("http")){
        return imgUrl;
    }else{
        imgUrl = imgUrl.startsWith("/") ? imgUrl : "/" + imgUrl;
    }
    return imgUrl;
}
function DeSpecialStr(str) {
    //return str.replaceAll("&amp;","&").replaceAll("&#039","'").replaceAll("<br>","\n");
    //return str.replaceAll("&amp;","&").replaceAll("&#039","'");
    str= str.toString().replaceAll("&amp;","&");
    str = str.toString().replaceAll("<br/>", "\n").replaceAll("<br>", "\n");
    str = str.replaceAll("~~","'");
    str = str.replaceAll("&#039;", "'");
    str = str.replaceAll("~","'");
    str = str.replaceAll("&quot;","\"");
    return str;
}
function SpecialStr(str) {
    if( str == null) return "";
    str = str.replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    str = str.replaceAll("\n", "<br>");
    str = str.replace(/\r/g, "").replace(/\t/g, "");
    return str;
}


function DecodeTextArea(content) {
    content = content.toString().replaceAll("<br/>","\n");
    content = content.toString().replaceAll("~~","'");
    content = content.toString().replaceAll("&#39;","'");
    content = content.toString().replaceAll("~","'");
    content = content.toString().replaceAll("&quot;","\"");
    return content;
}
function EncodeJson(content) {
    content = content.toString().replace(/'/g, '&#39;');
    content = content.toString().replace(/&quot;/g, '"');
    return content;
}
// Đổi mật khẩu xác nhận
function DoiMatKhauXacNhan() {
    $.messager.prompt('Đổi mật khẩu xác nhận', 'Nhập mật khẩu mới', 'password', function (r) {
        if (r) {
            $.messager.prompt('Đổi mật khẩu xác nhận', 'Xác nhận mật khẩu', 'password', function (s) {
                if (s) {
                    if (r != s){
                        ShowMessageW("Xác nhận mật khẩu chưa đúng");
                    }
                    else {
                        $.ajax({
                            type: "POST",
                            url: "/ManageCart/SaveRegSystem",
                            data: "{'code':'MatKhauXacNhan','value':'" + r + "'}",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            async: true,
                            success: function (response) {
                                var check = response.d;
                                if (check == "1") {
                                    ShowMessage("Đã thay đổi mật khẩu xác nhận");
                                }
                                else {
                                    ShowMessageW(check);
                                }
                            }
                        });
                    }
                } else if (typeof s != 'undefined') {
                    ShowMessageW("Vui lòng nhập mật khẩu xác nhận");
                }
            });
        } else if (typeof r != 'undefined') {
            ShowMessageW("Vui lòng nhập mật khẩu mới");
        }
    });
}
function FullSizePopup(idPopup) { 
    $("#" + idPopup).addClass("fullsize");
    $("#" + idPopup).css("width","calc(100vw - 60px)");
    $("#" + idPopup).css("height", "calc(100vh - 30px)");
    $("#" + idPopup).find('.card-body').css("height", "calc(100vh - 100px)");
    $("#" + idPopup).css("top", "0px !important");
    $("#" + idPopup).find(".card").css("height","100%");
    $("#" + idPopup).find(".card").parent().css("height","100%");
    $("#" + idPopup).find(".card-footer").css("position", "absolute");
    $("#" + idPopup).find(".card-footer").css("left", "0px");
    $("#" + idPopup).find(".card-footer").css("bottom","0px");
    $("#" + idPopup).find(".card-footer").css("width", "100%");
    $(window).scrollTop(0);
}
// CountDown FlashSale
function CountDownFS(id, seconds) {
    var interval = setInterval(function () {
        var days = Math.floor(seconds / 24 / 60 / 60);
        var hoursLeft = Math.floor((seconds) - (days * 86400));
        var hours = Math.floor(hoursLeft / 3600);
        var minutesLeft = Math.floor((seconds) - (days * 86400) - (hours * 3600));
        var minutes = Math.floor(minutesLeft / 60);
        var remainingSeconds = seconds % 60;
        if (remainingSeconds < 10) {
            remainingSeconds = "0" + remainingSeconds;
        }
        if (days < 10) {
            days = "0" + days;
        }
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (days != 0) {
            document.getElementById(id).innerHTML = "<i class=\"fa fa-clock-o\"></i>&nbsp;<b>" + days + "</b>&nbsp;NGÀY&nbsp;<b>" + hours + "</b>&nbsp;GIỜ&nbsp;<b>" + minutes + "</b>&nbsp;PHÚT&nbsp;<b>" + remainingSeconds + "</b>&nbsp;GIÂY";
        }
        else if (hours != 0) {
            document.getElementById(id).innerHTML = "<i class=\"fa fa-clock-o\"></i>&nbsp;<b>" + hours + "</b>&nbsp;GIỜ&nbsp;<b>" + minutes + "</b>&nbsp;PHÚT&nbsp;<b>" + remainingSeconds + "</b>&nbsp;GIÂY";
        }
        else if (hours == 0) {
            document.getElementById(id).innerHTML = "<i class=\"fa fa-clock-o\"></i>&nbsp;<b>" + +minutes + "</b>&nbsp;PHÚT&nbsp;<b>" + remainingSeconds + "</b>&nbsp;GIÂY";
        }
        if (seconds == 0) {
            clearInterval(interval);
            document.getElementById(id).innerHTML = "";
        } else {
            seconds--;
        }
    }, 1000);
}
var formatThousands = function(n, dp){
  var s = ''+(Math.floor(n)), d = n % 1, i = s.length, r = '';
  while ( (i -= 3) > 0 ) { r = ',' + s.substr(i, 3) + r; }
  return s.substr(0, i + 3) + r + 
    (d ? '.' + Math.round(d * Math.pow(10, dp || 2)) : '');
};
var toVND = function(n, dp){
  return formatThousands(n) + "₫";
};
function StrLength(count, id) {
    var value = $("#" + id).val();
    $("#" + count).html(value.length);
}
function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}
function onCopyInput(id) {
    var copyText = document.getElementById(id);
    if (copyText == null) {
        ShowMessageW(id);
        return;

    }
    copyText.select();
    document.execCommand("Copy");
}

function setColumns(idFrame,widthColumn) {
    var widthFrame =$("#" + idFrame).width(); 
    var numColumn = Math.min(Math.round(widthFrame / widthColumn));
    console.log("data-columns--" + numColumn);
    $("#" + idFrame).attr("data-columns", numColumn);
}
function arrayRemoveDoc(arr, value) {
    return arr.filter(function (ele) {
        return ele != value;
    });
}

