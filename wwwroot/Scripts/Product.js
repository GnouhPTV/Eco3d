
$(function () {
    $("#productTab").tabs();
    var keyword = SpecialStr($("#txtKeyProduct").val()).split(',');
    var option = {};
    option["element"] = "b";
    option["separateWordSearch"] = false;
    $(".content_bold").mark(keyword, option);

    var hts = $('.thongsotop').height();
    if (typeof hts == 'undefined') {
        hts = 0;
    }

    var hbh = $('#div_banhang').height()
    if (typeof hbh == 'undefined') {
        hbh = 0;
    }
    var height_a = hts + hbh;
    if (height_a > 125) {
        $('#note-product').append('<a id="aFT" href="javascript:ShowMoreFT(0);">Xem thêm..</a>')
    }
    //LoadCTKhuyenMai();
    //LoadContent_NhomHang();
    //LoadContent_HangSX();




});

$(window).scroll(function () {
    var sTop = $(this).scrollTop();
    var sttLoad = Math.floor(sTop / 350) + 1;

    var isLoad = $("#RelateProduct_Container").attr("data-load");
    if (isLoad == "0") LoadRelateProduct();
});

function ShowMoreFT() {
    $('#note-product').addClass('max');
}
function SSOpenProduct(code, giaoviec) {
    window.open('http://eco3d.salesoft.vn/cp/product-edit?id=' + code + '&giaoviec=' + giaoviec, '_blank');
}
function ProductAddToShop(idcuahang, code) {
    if (code == "") return false;
    if (idcuahang == "0") return false;
    $.messager.confirm('Nhắc nhở', 'Bạn muốn Đăng ký hàng hóa này?', function (r) {
        if (r) {
            $.ajax({
                type: "POST",
                url: "/ManageCart/AddProductShop",
                data: "{id: '" + idcuahang + "',code: '" + code + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    var check = response.d;
                    if (check == "1") {
                        ShowMessage("Đăng ký thành công!");
                        $("[id='btnRegisterShop']").hide();
                    }
                }
            });
        }
    });
}
function LoadRelateProduct() {
    var cat = $("#txtPage_Category").val();
    var id = $("#txtPage_Ma").val();
    var container = "#RelateProduct_Container";
    // Load Ajax
    $.ajax({
        type: 'Get',
        data: { cat: cat, id: id },
        url: '/Controls/HangHoa/_RelateProduct.aspx',
        success: function (msg) {
            $(container).html(msg);
        },
        beforeSend: function () {
            $(container).attr("data-load", 1);
        },
        complete: function () {

        }
    });
}
//function LoadCTKhuyenMai() {
//    var ma = $('#txtRelate_Ma').val();
//    var ma1 = $('#txtRelate_Ma1').val();
//    var malienket = $('#txtRelate_MaLienKet').val();
//    var ft = $('#txtFeatureTop').val();

//    $.ajax({
//        type: 'Get',
//        data: { ma: ma, ma1: ma1, malienket: malienket },
//        url: '/Controls/HangHoa/_LoadChuongTrinhDetail.aspx',
//        beforeSend: function () {
//            $('.loaddingProduct').html('<img src="/Images/loading2.gif" />');
//        },
//        success: function (msg) {
//            setTimeout(
//                function () {
//                    $('#div_banhang').html(msg);
//                }, 500);
//            if (msg == "") {
//                $('#div_banhang').hide();
//            }
//            if (typeof ft == '' && msg == '') {
//                $('#note-product').hide();
//            }
//        },
//        complete: function () {
//            var html = $('#note-product').html();
//            if (html == '<div id="div_banhang" style="display: none;"></div>') {
//                $('#note-product').hide();
//            }
//        }
//    });
//}
function LoadLoaiHangDetailSP() {
    var ma = $('#txtRelate_Ma').val();
    $.ajax({
        type: 'Get',
        data: { ma: ma },
        url: '/Controls/LoaiHang/_LoadDetailProduct.aspx',
        success: function (msg) {
            if (msg != "") {
                $('#navLoaiHang').show();
                $('#navLoaiHang ul').html(msg);
            }
        }
    });
}

//function LoadContent_NhomHang() {
//    var idCate = $('#content_NH').attr('data-id');
//    $.ajax({
//        type: 'Get',
//        data: { idCate: idCate },
//        url: '/Pages/Ajax/_Product_ContentNhomHang.aspx',
//        success: function (msg) {
//            if (msg != "") {
//                $('#content_NH').show();
//                $('#content_NH').html(msg);
//                FixContentNH(".mota_nhom");
//            }
//        }
//    });
//}

function FixContentNH(divContainer) {
    var $container = $(divContainer);
    var maxHeight = "300px";
    var height = $container.height();
    if (height > 300) {
        $container.height(maxHeight);
        $container.find(".button_readmore").show();
        $container.find(".button_readless").hide();
        $container.find(".gradient").show();
    } else {
        $container.find(".button_readmore").hide();
        $container.find(".button_readless").hide();
        $container.find(".gradient").hide();
    }
    $container.find('.button_readmore').click(function () {
        $container.height("100%");
        $container.find(".button_readmore").hide();
        $container.find(".button_readless").show();
        $container.find(".gradient").hide();
    });
    $container.find('.button_readless').click(function () {
        $container.height(maxHeight);
        $container.find(".button_readmore").show();
        $container.find(".button_readless").hide();
        $container.find(".gradient").show();
    });

}
//function LoadContent_HangSX() {
//    var idBranch = $('#content_HangSX').attr('data-id');
//    $.ajax({
//        type: 'Get',
//        data: { idBranch: idBranch },
//        url: '/Pages/Ajax/_Product_ContentHangSX.aspx',
//        success: function (msg) {
//            if (msg != "") {
//                $('#content_HangSX').show();
//                $('#content_HangSX').html(msg);
//            }
//        }
//    });
//}

function ContentKM() {
    var height = $(".sale_text").parent().height();
    var width = $(".sale_text").parent().width();
    $(".sale_text_content").css("height", "auto");
    $(".sale_text_content").css("width", width + "px");
}

$(document).ready(function () {
    // tool
    $(".product-tool a").click(function () {
        if ($('.product-tool ul').css('display') == 'none') {
            $(".product-tool ul").fadeIn("slow");
        } else {
            $(".product-tool ul").fadeOut("slow");
        }
    });
    //
    $("#view_more_relate").click(function () {
        $(".product-relate-body").css("height", "auto");
        $("#view_more_relate").hide();
    });
    //To the b keyword
    var key = $('#txtPage_Key').val();
    var keyarr = key.split(',');
    var option = {};
    option["element"] = "b";
    option["separateWordSearch"] = false;
    //$(".content_bold").mark(keyarr, option);
    //Load san pham ma phu
    LoadListProductDetail();
    $('input[name="cbPR"]').change(function () {
        var name = $(this).val();
        var check = $(this).prop('checked');
        console.log("Change: " + name + " to " + check);
        LoadListProductDetail();
    });
    //Load noi dung khuyen mai
    ContentKM();

    PageGetYoutube();
    $("#img-relate img").click(function () {
        var ma = $("#txtPage_Ma").val();
        var re_src = $(this).attr('data-src');
        var reid = $(this).attr('data-id');
        var main_src = $("#img_" + ma).attr('src');
        $("#imgMainTemp").val("main_src");
        if ($("#reimg_" + reid).attr('checked') == '1') {
            $("#img_" + ma).attr('src', $("#imgMainTemp").val());
        } else {
            $("#img_" + ma).attr('src', re_src);
        }

        $("#reimg_" + reid).attr('src', main_src);
        $("#reimg_" + reid).attr('checked', '1');

    });
    $("#fileUpload").change(function () {
        UpLoadImages();
    });
    //            if (screen.width > 768) {
    //                $(".img-view").elevateZoom({ containLensZoom: true, gallery: 'img-relate', cursor: 'pointer', galleryActiveClass: "active" });
    //            }
    // Phóng to anh san pham
    if ($(".fancybox").length) {
        $(".fancybox").fancybox({
            thumbs: {
                autoStart: true
            }
        });
    }

    // đánh giá sản phẩm //
    var rate_area = $('.star');
    if (rate_area.length > 0) {
        rate_area.each(function () {
            var $star = $(this);
            if ($star.hasClass('big')) {
                $star.raty({
                    starOff: '/Images/star-big-off.png',
                    starOn: '/Images/star-big-on.png',
                    starHalf: '/Images/star-big-on.png',
                    space: false,
                    score: function () {
                        return $(this).attr('data-score');
                    }
                });
            }
            else {
                $star.raty({
                    starOff: '/Images/star-off.png',
                    starOn: '/Images/star-on.png',
                    starHalf: '/Images/star-big-on.png',
                    space: false,
                    score: function () {
                        return $(this).attr('data-score');
                    },
                    click: function (score, evt) {
                        alert("Đánh giá " + score + " sao!");
                    }
                });
            }
        });
    }
    $('.le-quantity a').click(function (e) {
        e.preventDefault();
        var currentQty = $(this).parent().parent().find('input[name=qty], .le-quantity input[type=text]').val();
        if ($(this).hasClass('minus') && currentQty > 0) {
            $(this).parent().parent().find('input[name=qty], .le-quantity input[type=text]').val(parseInt(currentQty, 10) - 1);
        } else {
            if ($(this).hasClass('plus')) {
                $(this).parent().parent().find('input[name=qty], .le-quantity input[type=text]').val(parseInt(currentQty, 10) + 1);
            }
        }
    });
    LoadTaiLieuDetail();
    GetValueRegSystem("ProductFooter", "productcontent_footer");
});
// Chính sách sản phẩm productcontent_footer
function ShowContent(id, key) {
    document.getElementById('content-cs').innerHTML = "";
    var current = $("#CurrentCS").val();
    if (current == "" || current == id) {
        if ($("#content-cs:hidden").length) {
            GetValueRegSystem(key, "content-cs");
            $("#content-cs").slideDown();
            $("#" + id).addClass('minusx');
        }
        else {
            $("#content-cs").slideUp();
            $("#" + id).removeClass('minusx');
        }
    } else {
        $("#" + current).removeClass('minusx');
        GetValueRegSystem(key, "content-cs");
        $("#content-cs").slideDown();
        $("#" + id).addClass('minusx');
    }
    $("#CurrentCS").val(id);
}
function LoadTaiLieuDetail() {
    var key = "";
    var ma = $("#txtPage_Ma").val();
    var malienket = $("#txtPage_MaLienKet").val();
    var ma1 = $("#txtPage_Ma1").val();
    $('.bg-detail-list > tr').remove();
    $.ajax({
        type: 'Get',
        data: { ma: ma, malienket: malienket, ma1: ma1 },
        url: '/Controls/_LoadTaiLieuDetail.aspx',
        beforeSend: function () {
            $('.loaddingProduct').html('<img src="/Images/loading2.gif" />');
        },
        success: function (msg) {
            //var check = msg.replaceAll(" ", "");
            let check = msg.replace(/\s/g, "");
            console.log('check');
            console.log(check);
            if (check == "<tableid=\"tbl_tailieu\"></table>") {
                $('.widget-tailieu').hide();
            }
            setTimeout(
                function () {
                    $('#content-tailieu').html(msg);
                }, 500
            );
        }
    });
}
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
            FixContentNH(".product_footer");
        }
    });
}

function onReviewProduct(ma) {
    $.ajax({
        type: "POST",
        url: "/ManageCart/ReviewProducts",
        data: "{'ma':'" + ma + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (response) {
            var check = response.d;
            if (check == 1) {
                ShowMessage("Duyệt thành công");
                //LoadDataProduct();
            }
            else {
                ShowMessage("Duyệt không thành công");
            }
        }
    });
}
function PageGetYoutube() {
    console.log('Youtube BeGin');
    var idHoangHoa = $("#txtPage_Ma").val();
    var malienket = $("#txtPage_MaLienKet").val();
    var tableName = "DM_HangHoa_Youtube";
    var url_video = "";
    $.ajax({
        type: "POST",
        url: "/ManageCart/GetYoutubeAttackProduct",
        data: "{tableName: '" + tableName + "', id: '" + idHoangHoa + "', malienket: '" + malienket + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var urls = ""; var ids = "";
            $(response.d).find(tableName).each(function () {
                // Set values 
                urls += "," + $(this).find('URLImage').text();
                ids += "," + $(this).find('ID').text();
                url_video = $(this).find('URLImage').text();
                $(".header_youtube").attr("href", $(this).find('URLImage').text());

            });
            $("#txtPage_Youtube").val(url_video);
            $("#txtPage_Youtube_ID").val(ids);
            if (urls == "") {
                $(".link_video").hide();
            }
            Render_Youtube(url_video);

        },
        complete: function () {
            //Render_Youtube(url_video);
        }
    });
}
function Render_Youtube(url) {

    var patt = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(patt);

    var result = (match && match[7].length == 11) ? match[7] : false;

    //          if (result == null) return;
    console.log('url video' + result);
    var res = result.toString().replace(/\?v=/gi, "");
    res = res.replace(/&$/gi, "");
    console.log('youtube---' + res);

    if (res != 'false') {
        var html = '<iframe id="ifYoutube" style="width:100%;height:auto" src="https://www.youtube.com/embed/' + res + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
        $("#ProductYoutube_div").html(html);

        $("#ifYoutube").height($("#ifYoutube").width() / 16 * 9);
    }
}
function Youtube_Click() {
    //ul#img-detail-arr,txtAttach_IMG
    var urls = $("#txtPage_Youtube").val();
    var ids = $("#txtPage_Youtube_ID").val();
    var imgarr = urls.split(",");
    var idimgarr = ids.split(",");
    $("ul#youtube-attack-arr").empty();
    $.each(imgarr, function (index, value) {
        //console.log(index + ": " + ids + ": " + idimgarr[index]);
        if (value.toString().trim() != "") {
            var win = window.open(value, '_blank');
        }
    });
}
// Load mã phụ
function LoadListProductDetail() {
    var status = '1';
    var type = '1';
    var key = "";
    var parent = $("#txtRelate_CategoryParent").val();
    var category = $('#txtPage_Category').val();
    var ma = $("#txtPage_Ma").val();
    var malienket = $("#txtPage_MaLienKet").val();

    $('.bg-detail-list > tr').remove();

    var filter = "";
    var radios = document.getElementsByName('cbPR');
    for (var i = 0, max = radios.length; i < max; i++) {
        if (radios[i].checked == true) {
            filter += radios[i].value + ",";
        }
    }
    console.log('LoadListProductDetail');

    $.ajax({
        type: 'Get',
        data: { ma: ma, malienket: malienket, parent: parent, category: category, filter: filter },
        url: '/Controls/HangHoa/_ListProductDetail.aspx',
        beforeSend: function () {
            $('.loaddingProduct').html('<img src="/Images/loading2.gif" />');
        },
        success: function (msg) {

            //$('.bg-detail-list tr').remove();
            // add new
            $('.product-detail-code-relate').html(msg);

        },
        complete: function (data) {
            var countSP = $('.product-details .product-option li').length;
            //select Size
            if (countSP > 0) {
                var nameOpt = $('.product-details .product-option li:first-child').attr('rel');
                $('#size-label').attr('rel', nameOpt);
                var aSize1 = $('.product-details .product-option li:first-child a');
                var size1 = aSize1.attr('data-info');
                var labelSize1 = 'Chọn ' + $('.product-details .product-option li:first-child').attr('rel').toLowerCase();
                $('#size-label').html(labelSize1);
                SelectSize(aSize1, size1);
            }
        }
    });
}

function RelateAdd2Cart(pId) {
    var vQuantity = parseFloat($('#quantityNb_' + pId).val());
    if (isNaN(vQuantity)) {
        var vQuantity = 1;
    }
    DAY24H.Cart.Add2Cart(pId, vQuantity, 'productImageWrapID_' + pId);
    var imgId = '.product-img-zoom img';
    if ($('#MenuShowHeader .link_cart').length) {
        flyToElement(imgId, $('#MenuShowHeader .link_cart'));
    } else {
        flyToElement(imgId, $('.cart'));
    }

}
function SelectSize(aSelect, size) {
    $('.product-detail-code-relate a').removeClass('active');
    $('.product-option-value').html(size);

    var price = $('.product-detail-code-relate a[data-info= "' + size + '"]').attr('data-price');
    price = "<span id=\"product-price-selected\" >" + formatThousands(price) + "</span>" + "₫";
    if (price > 0) {
        $('.price .price-value').html(price);
    }
    $(aSelect).addClass('active');
}

function GetDetailPDF(masp) {
    // Xem nội dung 
    var _html = $('#html-detail-template').html();
    _html = _html.replaceAll("{{html-tensp}}", $('#html-tensp').html());// + $('#html-thong-so').html();
    _html = _html.replaceAll("{{html-thongso}}", $('#html-thongso').html());
    var img_pdf = $('.product-img-zoom').html()
    _html = _html.replaceAll("{{html-anh}}", img_pdf);
/*    _html += '<img class="html-img-footer" id="html-footer" src="" />';*/
    _html = _html.replace(/\n/g, '');
    _html = _html.replace(/\t/g, '');
    _html = _html.replace(/\s\s\s\s\s\s/g, ' ');
    var htmlPDF = {
        htmlPDF: _html,
        masp: masp
    };
    console.log(JSON.stringify(htmlPDF));
    $.ajax({
        type: "POST",
        url: "/GetPDF/GetDetailPDF",
        /* data: "{'htmlPDF': " + htmlPDF + ", 'namePDF': 'tenfile', 'masp': '" + masp + "'}",*/
        data: JSON.stringify(htmlPDF),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        beforeSend: function () {
            $('.page-loading').show();
        },
        headers: {
            RequestVerificationToken: csrfToken
        },
        success: function (response) {
            var url = response.file;
            if (url != "") {
                var link = document.getElementById("linkDownloadDetail");
                link.href = url;
                $('.page-loading').hide();
                link.click();
            } else {
                ShowMessageW("Lỗi tạo file PDF!");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            ErrAjax(xhr.responseText);
            $('.page-loading').hide();
        }
    });
}