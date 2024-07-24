$(document).ready(function () {
    if (typeof (DAY24H) == "undefined") {
        DAY24H = {};
    }
    var obj;
    var objprice;
    var productInCookie = $.JSONCookie('ProductStore');
    DAY24H.Cart = (function () {
        var methods = {};
        methods.CartGrid = null;
        methods.Collection = null;
        var $table = $('#list-details,#list-detail-right');
        var $tableComapre = $('.comparelist .dropdown-menu-daxem .ds');

        methods.buildGrid = function () {
            var productInCookie = $.JSONCookie('ProductStore');
            if (!!productInCookie['products'] && productInCookie['products'].length > 0) {
                $table.find('tbody').remove();
                var list = new CartCollection();
                var totalPrice = 0;
                var totalQuantity = 0;
                var stt = 1;
                _.each(productInCookie["products"], function (item) {
                    var dept = new Cart({
                        'stt': stt,
                        'id': item.Id,
                        'Code': item.Code,
                        'ProductName': item.ProductName,
                        'Quantity': item.Quantity,
                        'Image': item.Image,
                        'Price': item.Price == null ? 0 : item.Price,
                        'TotalPrice': (item.Price == null ? 0 : item.Price) * item.Quantity,
                        'FormatPrice': $.formatNumber(item.Price, { format: "#,##0", locale: "us" }),
                        'FormatTotalPrice': $.formatNumber(item.TotalPrice, { format: "#,##0", locale: "us" })
                    });
                    stt += 1;
                    totalPrice += (item.Price == null ? 0 : item.Price) * item.Quantity;
                    totalQuantity += item.Quantity;
                    list.push(dept);
                });
                $table.fadeIn();
                methods.Collection = list;
                methods.CartGrid = new CartGrid({ collection: list });
                $table.append(methods.CartGrid.render().el);
                $(".cart-info").html('<span>' + totalQuantity + " sản phẩm</span>");
                $(".cart-total, .cart_total_quantity").html(totalQuantity + ' sản phẩm');
                $("#MenuShowHeader .box-counter").html(totalQuantity);
                $(".cart-counter").html(totalQuantity);
                $(".total-price").html($.formatNumber(totalPrice, { format: "#,###", locale: "us" }) + '₫');
                $('.cart_total_price').html('<font color="#f00">' + $.formatNumber(totalPrice, { format: "#,###", locale: "us" }) + '₫</font>');
                $(".payment-bar").show();

            } else {
                $table.find('tbody').remove();
                productInCookie = { "products": [] };
                eval('obj = ' + JSON.stringify(productInCookie), window);
                $.JSONCookie('ProductStore', obj, { path: '/' });
                $(".cart-counter").html('0');
                $(".cart-info").html('<span>Giỏ hàng trống</span>');
                $(".cart-total, .cart_total_quantity").html('0 sản phẩm');
                $(".total-price").html('0 Đ');
                $('.cart_total_price').html('Giá: <font color="#9f0401">0 ₫</font>');
                $(".payment-bar").hide();
            }
        };

        methods.buildGridCompare = function () {

            var productInCookie = $.JSONCookie('ProductStoreCompare');
            if (!!productInCookie['products'] && productInCookie['products'].length > 0) {
                $tableComapre.empty();
                var list = new CartCollection();
                var list1 = new CartCollection();

                var totalPrice = 0;
                var totalQuantity = 0;
                var stt = 1;
                var pCodeCategory = 0;
                var idCategory = 0;
                var iditem1 = 0;
                var iditem2 = 0;
                _.each(productInCookie["products"], function (item) {
                    var dept = new Cart({
                        'stt': stt,
                        'id': item.Id,
                        'Code': item.Code,
                        'ProductName': item.ProductName,
                        'ImgUrl': item.ImgUrl,
                        'IdCategory': item.IdCategory,
                        'PCodeCategory': item.PCodeCategory,
                        'Url': item.Url,
                        'Quantity': item.Quantity,
                        'Price': item.Price == null ? 0 : item.Price,
                        'TotalPrice': (item.Price == null ? 0 : item.Price) * item.Quantity,
                        'FormatPrice': $.formatNumber(item.Price, { format: "#,###", locale: "us" }),
                        'FormatTotalPrice': $.formatNumber(item.TotalPrice, { format: "#,###", locale: "us" })
                    });
                    //console.log('stt:' + stt + '---' + item.ProductName + '------' + 'IdCategory :' + item.IdCategory + '---PCodeCategory:' + item.PCodeCategory);
                    stt += 1;
                    totalPrice += (item.Price == null ? 0 : item.Price) * item.Quantity;
                    totalQuantity += item.Quantity;
                    list.push(dept);

                });
                var last = stt - 2;
                list.models = list.models.reverse();

                pCodeCategory = list.at(0).get('PCodeCategory');
                idCategory = list.at(0).get('IdCategory');
                //console.log('pCodeCategoryvuacho' + pCodeCategory);
                $tableComapre.parent().removeClass('compare_hide');
                $tableComapre.fadeIn();
                methods.Collection = list;
                methods.GridCompare = new GridCompare({ collection: list });

                $(".compare-counter").html(totalQuantity);
                // rel html list hàng hóa
                $tableComapre.append(methods.GridCompare.render().el);

                // lọc theo danh mục sảnh phẩm mới chọn

                var filtered = new Backbone.Collection(list.filter(function (model) {
                    return model.get('PCodeCategory') === pCodeCategory;
                }));
                //console.log(filtered);

                iditem1 = filtered.at(0).get('id');

                if (filtered.length >= 2) {
                    iditem1 += '-vs-' + filtered.at(1).get('id');
                }
                if (filtered.length >= 3) {
                    iditem1 += '-vs-' + filtered.at(2).get('id');
                }
                var linkCompareTo = '<a id="aCompareTo" href="/so-sanh-san-pham/C' + pCodeCategory + '/' + iditem1 + '" >'
                    + '<span>..so sánh <i class="fa fa-long-arrow-right"></i></span> </a>';

                $tableComapre.append(linkCompareTo);

                //$(".compare-btn").show();


            } else {
                $tableComapre.empty();
                productInCookie = { "products": [] };
                eval('obj = ' + JSON.stringify(productInCookie), window);
                $.JSONCookie('ProductStoreCompare', obj, { path: '/' });
                $(".compare-counter").html('0');
                $tableComapre.parent().addClass('compare_hide');

            }
        };
        /*
        Hàm cập nhập dữ liệu trên trang sau khi save
        */
        methods.updateGrid = function (model, isNew) {
            $table.fadeIn("fast");
            if (isNew) {
                methods.Collection.add(model, { at: 0 });
            }
        };
        methods.Add2Cart = function (pId, quantity, imageContainer) {
            $.ajax({
                type: "POST",
                url: "/Product/GetInforProductByCode",
                data: { code: pId },
                success: function (response) {
                    var product = response;
                    var priceItem;
                    var status;
                    var imageUrl;
                    // Lấy giá lẻ
                    priceItem = product.giaLe == null ? 0 : product.giaLe
                    status = product.sL_Ton == null ? 0 : product.sL_Ton;

                    //if (typeof option == 'undefined') {
                    //    if (option['img'] != "") product.ImageUrl = option['img'];
                    //}
                    var nameTB = product.ten;
                    methods.AddToCookie(imageContainer, product.ma, product.ten, quantity, priceItem, status, product.imageViewUrl);
                    //hiệu ứng ảnh bay lên
                    var imgId = "img_" + pId;
                    //if ($('#MenuShowHeader .link_cart').length) {
                    //    flyToElement('#' + imgId, $('#MenuShowHeader .link_cart'));
                    //} else {
                    //    flyToElement('#' + imgId, $('.cart'));
                    //}
                    ShowMessage("Đã thêm <b>" + nameTB + "</b> vào giỏ hàng.");
                },
                failure: function (msg) {
                    alert(msg);
                }
            });
        };
        methods.Add2Compare = function (pId, quantity, imageContainer) {
            $.ajax({
                type: "POST",
                url: "/ManageCart/GetInfo",
                data: "{'id':'" + pId + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    var product = response.d;
                    var priceItem;
                    var status;
                    // Lấy giá lẻ
                    priceItem = product.Price == null ? 0 : product.Price;
                    status = product.Inventory == null ? 0 : product.Inventory;
                    // Kiểm tra số lượng tồn

                    methods.AddToCookieCompare(imageContainer, product.Id, product.Name, quantity, priceItem, status, product.IdCategory);
                    //hiệu ứng ảnh bay lên
                    var imgId = "img_" + pId;
                    console.log(imgId);
                    flyToElement('#' + imgId, $('.comparelist'));
                    ShowMessage("Đã thêm <b>" + product.Name + "</b> vào danh sách so sánh.");

                },
                failure: function (msg) {
                    alert(msg);
                }
            });
        };
        methods.GetCateParentCode = function (imageContainer, id, name, quantity, price, status, idcategory) {
            // Load Data
            $.ajax({
                type: "POST",
                url: "/ManageCart/GetCateParentCode",
                data: '{"manhom":"' + idcategory + '"}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    var obj;
                    var cookieName = 'ProductStoreCompare';
                    var img = $("#" + imageContainer).find('img:first');
                    var imgURL = $(img).attr('src');
                    var Url = $(img).parent().attr('href');
                    var code = response.d;
                    //console.log(id + ' idcategory--------------------ajax add cookie: ' + code);
                    var productItem = { 'Id': id, 'ProductName': name, 'ImgUrl': imgURL, 'Url': Url, 'Quantity': quantity, 'Price': price, 'Status': status, 'IdCategory': idcategory, 'PCodeCategory': code };
                    var productCookie = { "products": [] };
                    var o = $.JSONCookie(cookieName);
                    if (o == null) {
                        o = productCookie;
                    }

                    var isExists = false;
                    $.each(o["products"], function (i, v) {
                        if (v.Id == productItem.Id) {
                            isExists = true;
                            return false;
                        }
                    });
                    if (!isExists) {
                        o["products"].push(productItem);
                    }
                    eval('obj = ' + JSON.stringify(o), window);
                    $.JSONCookie(cookieName, obj, { path: '/' });
                    methods.buildGridCompare();
                }
            });
        }
        //Thêm vào cookie ProductCompare
        methods.AddToCookieCompare = function (imageContainer, id, name, quantity, price, status, idcategory) {
            name = name.replace(/'/g, "");
            // kiểm tra ký tự đặc biệt trong mã            
            methods.GetCateParentCode(imageContainer, id, name, quantity, price, status, idcategory);
        };
        //
        methods.AddToCookie = function (imageContainer, id, name, quantity, price, status, image) {
            console.log(name);
            console.log(image);
            if (name != null) {
                name = name.replace(/'/g, "");
            }
            // lưu vào cookie
            var idCookie = id;
            console.log('productID: ' + id)
            console.log('productname: ' + name)
            var cookieName = 'ProductStore',
                productItem = { 'Id': idCookie, 'ProductName': name, 'Quantity': quantity, 'Price': price, 'Status': status, 'Image': image };
            var productCookie = { "products": [] };
            var o = $.JSONCookie(cookieName);
            if (o == null) {
                o = productCookie;
            }
            var isExists = false;
            $.each(o["products"], function (i, v) {
                if (v.Id == productItem.Id) {
                    isExists = true;
                    var q = v.Quantity + quantity;
                    v.Quantity = q;
                    v.Price = price;
                    return false;
                }
            });
            if (!isExists) {
                o["products"].push(productItem);
            }
            //eval('obj = ' + JSON.stringify(o), window);
            var obj = JSON.parse(JSON.stringify(o))
            $.JSONCookie(cookieName, obj, { path: '/' });
            methods.buildGrid();
        };
        // thêm vào báo giá
        methods.AddPriceList = function (pId, quantity) {
            $.ajax({
                type: "POST",
                url: "/ManageCart/GetInfo",
                data: "{'id':'" + pId + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    var product = response.d;
                    methods.AddToPriceCookie(product.Id, product.Name, quantity, 0, product.Id);
                }
            });
        };
        methods.AddPriceListCustomer = function (pId, quantity, option, numBG, imageViewUrl) {
            $.ajax({
                type: "POST",
                url: "/Product/GetInforProductByCode",
                data: { code: pId },
                success: function (response) {
                    var product = response;
                    console.log(product.imageViewUrl);
                    methods.AddToPriceCookieCustomer(product.ma, product.ten, quantity, 0, numBG, product.imageViewUrl);
                }
            });
        };

        methods.AddToPriceCookie = function (id, name, quantity, price, id1, promo) {
            name = name.replace(/'/g, "");
            name = name.replace(/"/g, "");
            // lưu vào cookie
            var priceCookieName = 'PriceStore';
            var itemPrice = { 'Id': id, 'Name': name, 'Quantity': quantity, 'Price': price, 'Id1': id1, 'Promo': promo, 'Note': '' };
            var priceCookie = { "price": [] };
            var oj = $.JSONCookie(priceCookieName);
            if (oj == null || JSON.stringify(oj) == '{}') {
                oj = priceCookie;
            }
            // count item in cookies
            var count = 0;
            _.each(oj["price"], function (item) {
                ++count;
            });
            if (count > 13) {
                var isExists = false;
                $.each(oj["price"], function (i, v) {
                    if (v.Id == itemPrice.Id) {
                        isExists = true;
                        var q = v.Quantity + quantity;
                        v.Quantity = q;
                        v.Promo = promo;
                        v.Price = price;
                        return false;
                    }
                });
                if (!isExists) {
                    priceCookieName = 'PriceStore2';
                    oj = $.JSONCookie(priceCookieName);
                    if (oj == null || JSON.stringify(oj) == '{}') {
                        oj = priceCookie;
                    }
                    var isExists2 = false;
                    $.each(oj["price"], function (i, v) {
                        if (v.Id == itemPrice.Id) {
                            isExists2 = true;
                            var q = v.Quantity + quantity;
                            v.Quantity = q;
                            v.Promo = promo;
                            v.Price = price;
                            return false;
                        }
                    });
                    if (!isExists2) {
                        oj["price"].push(itemPrice);
                    }
                }
            } else {
                var isExists3 = false;
                $.each(oj["price"], function (i, v) {
                    if (v.Id == itemPrice.Id) {
                        isExists3 = true;
                        var q = v.Quantity + quantity;
                        v.Quantity = q;
                        v.Promo = promo;
                        v.Price = price;
                        return false;
                    }
                });
                if (!isExists3) {
                    oj["price"].push(itemPrice);
                }
            }
            eval('objprice = ' + JSON.stringify(oj), window);
            $.JSONCookie(priceCookieName, objprice, { path: '/' });
        };
        methods.AddToPriceCookieCustomer = function (id, name, quantity, promo, numBG, image) {
            name = name.replace(/'/g, "");
            name = name.replace(/"/g, "");
            var code = id;
            console.log(name);
            console.log(image);
            if (typeof (['size']) != null) {
                id += "-size-" + ['size'];
                if (['name'] != "") {
                    name += " " + [''] + " " + [''];
                }
            }



            // lưu vào cookie
            var priceCookieName = 'PriceStoreCustomer';
            var itemPrice = { 'Id': id, 'Code': code, 'Name': name, 'Quantity': quantity, 'Promo': promo, 'Note': '', 'Image': image };
            var priceCookie = { "price": [] };
            var oj = $.JSONCookie(priceCookieName);
            if (oj == null || JSON.stringify(oj) == '{}') {
                oj = priceCookie;
            }
            // count item in cookies
            var count = 0;
            _.each(oj["price"], function (item) {
                ++count;
            });
            var typeBG = ['type'];


            var isExists3 = false;
            $.each(oj["price"], function (i, v) {
                if (v.Id == itemPrice.Id) {
                    isExists3 = true;
                    var q = v.Quantity + quantity;
                    //if (typeBG == "BG1" && q > numBG) {
                    //    q = numBG - 1;
                    //}
                    //if (typeBG == "BG2" && q > numBG) {
                    //    q = numBG - 1;
                    //}
                    //console.log("so luong bg " + typeBG + "---" + q);
                    v.Quantity = v.Quantity;
                    v.Promo = promo;
                    v.Price = price;
                    return false;
                }
            });
            if (!isExists3) {
                oj["price"].push(itemPrice);
            }

            eval('objprice = ' + JSON.stringify(oj), window);
            $.JSONCookie(priceCookieName, objprice, { path: '/' });
        };
        //remove compare item
        methods.RemoveCompareFirstItem = function () {
            var cookieName = 'ProductStoreCompare';
            var productCookie = { "products": [] };
            var o = $.JSONCookie(cookieName);
            if (o == null) {
                o = productCookie;
            }
            var isExists = false;
            var eIndex = 0;
            //            $.each(o["products"], function (i, v) {
            //                if (v.Id == pId) {
            //                    isExists = true;
            //                    return false;
            //                }
            //                eIndex++;
            //            });
            //            if (isExists) {
            o["products"].splice(0, 1);
            //            }

            eval('obj = ' + JSON.stringify(o), window);
            $.JSONCookie(cookieName, obj, { path: '/' });
            methods.buildGridCompare();
        };
        methods.RemoveCompareItem = function (pId) {
            var cookieName = 'ProductStoreCompare';
            var productCookie = { "products": [] };
            var o = $.JSONCookie(cookieName);
            if (o == null) {
                o = productCookie;
            }
            var isExists = false;
            var eIndex = 0;
            $.each(o["products"], function (i, v) {
                if (v.Id == pId) {
                    isExists = true;
                    return false;
                }
                eIndex++;
            });
            if (isExists) {
                o["products"].splice(eIndex, 1);
            }

            eval('obj = ' + JSON.stringify(o), window);
            $.JSONCookie(cookieName, obj, { path: '/' });
            methods.buildGridCompare();
        };
        methods.CompareThis = function (code, parentCodeCategory) {
            //            var idcategory = $(this).attr("dcid");
            //            var parentCodeCategory = $(this).attr("pcode");
            //var id = $(this).attr("did");
            // alert(idcategory);
            //console.log(idcategory)
            var productInCookie = $.JSONCookie('ProductStoreCompare');
            //                if (!!productInCookie['products'] && productInCookie['products'].length > 0) {

            var list = new CartCollection();

            var totalPrice = 0;
            var totalQuantity = 0;
            var stt = 1;
            var iditem1 = 0;
            var iditem2 = 0;
            _.each(productInCookie["products"], function (item) {
                var dept = new Cart({
                    'stt': stt,
                    'id': item.Id,
                    'Code': item.Code,
                    'ProductName': item.ProductName,
                    'ImgUrl': item.ImgUrl,
                    'IdCategory': item.IdCategory,
                    'PCodeCategory': item.PCodeCategory,
                    'Url': item.Url,
                    'Quantity': item.Quantity,
                    'Price': item.Price == null ? 0 : item.Price,
                    'TotalPrice': (item.Price == null ? 0 : item.Price) * item.Quantity,
                    'FormatPrice': $.formatNumber(item.Price, { format: "#,###", locale: "us" }),
                    'FormatTotalPrice': $.formatNumber(item.TotalPrice, { format: "#,###", locale: "us" })
                });
                stt += 1;
                totalPrice += (item.Price == null ? 0 : item.Price) * item.Quantity;
                totalQuantity += item.Quantity;
                list.push(dept);
            });


            // lọc theo danh mục sảnh phẩm mới chọn

            var filtered = new Backbone.Collection(
                list.filter(function (model) {
                    return (model.get('PCodeCategory') === parentCodeCategory && model.get('id') != code);
                })
            );
            filtered.models = filtered.models.reverse();



            iditem1 = code;

            if (filtered.length >= 1) {
                iditem1 += '-vs-' + filtered.at(0).get('id');
            }
            if (filtered.length >= 2) {
                iditem1 += '-vs-' + filtered.at(1).get('id');
            }

            var linkCompareTo = '/so-sanh-san-pham/C' + parentCodeCategory + '/' + iditem1;
            // console.log(linkCompareTo)
            $(location).prop('href', linkCompareTo);

        };
        methods.RemoveCartItem = function (pId) {
            var cookieName = 'ProductStore';
            var productCookie = { "products": [] };
            var o = $.JSONCookie(cookieName);
            if (o == null) {
                o = productCookie;
            }
            var isExists = false;
            var eIndex = 0;
            $.each(o["products"], function (i, v) {
                if (v.Id == pId) {
                    isExists = true;
                    return false;
                }
                eIndex++;
            });
            if (isExists) {
                o["products"].splice(eIndex, 1);
            }

            eval('obj = ' + JSON.stringify(o), window);
            $.JSONCookie(cookieName, obj, { path: '/' });
            methods.buildGrid();
        };
        // quy ước về hàm khởi tạo
        methods.init = function () {
            methods.buildGrid();
            methods.buildGridCompare();
            // Thêm vào giỏ hàng
            $(".add2cart").bind("click", function () {
                var pId = $(this).attr('data-id');
                var id = "quantityNb_" + pId;
                var vQuantity = parseFloat(document.getElementById(id).value);
                if (isNaN(vQuantity)) {
                    var vQuantity = 1;
                }
                methods.Add2Cart(pId, vQuantity, 'productImageWrapID_' + pId);
            });
            $(".add2compare").bind("click", function () {
                var pId = $(this).attr('data-id');
                var vQuantity = parseFloat($('#quantity_' + pId).val());
                if (isNaN(vQuantity)) {
                    var vQuantity = 1;
                }
                methods.Add2Compare(pId, vQuantity, 'productImageWrapID_' + pId);
            });

            $("#button-cart,.le-button").bind("click", function () {
                var pId = $(this).attr('data-id');
                var vQuantity = parseFloat($("#quantityNb").val());
                if (isNaN(vQuantity)) {
                    var vQuantity = 1;
                }
                // thêm option size
                var size = ""; var mp_id = "";
                var nameOpt = "";
                if ($('.product-detail-code-relate a').length != 0) {
                    size = $('.product-option-value').html().trim();
                    mp_id = $('.product-option-value').attr("data-id");
                    nameOpt = $('#size-label').attr('rel');
                }
                //if (mp_id != "") pId = mp_id;
                var option = new Array();
                option['name'] = nameOpt;
                option['size'] = size;
                option['id'] = mp_id;
                option['img'] = $(".product-img-zoom > a > img").attr("src");
                methods.Add2Cart(pId, vQuantity, 'productImageWrapID_' + mp_id, option);
            });
            $("#ConnectProduct_Container .le-button").bind("click", function () {
                var pId = $(this).attr('data-id');
                var pMark = $(this).attr('data-mark');
                var vQuantity = parseFloat($("#quantityNb").val());
                if (isNaN(vQuantity)) {
                    var vQuantity = 1;
                }
                // thêm option size
                var size = ""; var mp_id = "";
                var nameOpt = "";

                if (mp_id != "") pId = mp_id;
                var option = new Array();
                option['name'] = nameOpt;
                option['size'] = '';
                option['id'] = pId;
                option['img'] = $(".product-img-zoom > a > img").attr("src");
                methods.Add2Cart(pId, vQuantity, 'productImageConnectID_' + pMark, option);

            });
            $(".selectProduct:checkbox").bind("click", function () {
                var pId;
                if (this.checked) {
                    pId = $(this).val();
                    var vQuantity = 1;
                    methods.Add2Cart(pId, vQuantity, 'product_related_' + pId);
                } else {
                    pId = $(this).val();
                    methods.RemoveCartItem(pId);
                }
            });
            // Thêm vào báo giá khách hàng
            $("#form_bg .bg-price").bind("click", function () {
                var pId = $(this).attr('data-id');
                var opt = $(this).attr('data-opt');
                var numBG = $(this).attr('data-num');
                OpenPopupBaoGiaCustomer(opt);
                var vQuantity = parseFloat($("#quantityNb").val());
                if (isNaN(vQuantity)) {
                    var vQuantity = 1;
                }
                if (isNaN(numBG)) {
                    vQuantity = numBG;
                }
                // thêm option size
                var size = "";
                var nameOpt = "";
                if ($('.product-detail-code-relate a').length != 0) {
                    size = $('.product-option-value').html().trim();
                    nameOpt = $('#size-label').attr('rel');
                }
                //console.log('managecart.js---name: ' + name);
                var option = new Array();
                option['name'] = nameOpt;
                option['size'] = size;
                //pId = pId + "-" + size
                methods.AddPriceListCustomer(pId, vQuantity, option, numBG);
            });

            // báo giá
            $(".button-price").bind("click", function () {
                var pId = $(this).attr('data-id');
                var opt = $(this).attr('data-opt');
                OpenPopupBaoGia();
                var vQuantity = parseFloat($('#quantity_' + pId).val());
                if (isNaN(vQuantity)) {
                    var vQuantity = 1;
                }
                methods.AddPriceList(pId, vQuantity, "", 0);
            });
        };
        return methods;
    })(DAY24H.Cart);
    DAY24H.Cart.init();
    $(".cart-l", this).on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(".cart-detail").toggleClass("show");
        $(document).on('click', function closeCart(e) {
            if ($('.cart-detail').has(e.target).length === 0) {
                $('.cart-detail').removeClass('show');
            }
        });
        $(".cart-close").on("click", function (e) {
            e.preventDefault();
            $('.cart-detail').removeClass('show');
        });
    });

});
window.GridCompare = Backbone.View.extend({
    tagName: 'content',
    render: function () {
        $(this.el).empty();
        var i = 1;

        // sắp xếp hàng mới thêm lên đầu
        //sort by "age" desc this.collection.models.reverse()

        _.each(this.collection.models, function (sfunction) {
            $(this.el).append((new GridItemCompare({ model: sfunction })).render().el);
            i++;
        }, this);
        return this;
    },
    initialize: function () {
        var self = this;
        this.collection.bind("reset", this.render, this);
        this.collection.bind("add", function (sfunction) {
            $(self.el).prepend(new GridItemCompare({ model: sfunction }).render().el);
        });
    }
});
window.GridItemCompare = Backbone.View.extend({
    tagName: 'div class="product-item-daxem" style="float:left"',
    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },
    events: {
        'click .cr-drop': 'removeItem'
    },
    removeItem: function (event) {
        var self = this;
        var cookieName = 'ProductStoreCompare';
        var productCookie = { "products": [] };
        var o = $.JSONCookie(cookieName);
        if (o == null) {
            o = productCookie;
        }
        var isExists = false;
        var eIndex = 0;
        $.each(o["products"], function (i, v) {
            if (v.Id == self.model.get('id')) {
                isExists = true;
                return false;
            }
            eIndex++;
        });
        if (isExists) {
            o["products"].splice(eIndex, 1);
        }

        eval('obj = ' + JSON.stringify(o), window);
        $.JSONCookie(cookieName, obj, { path: '/' });
        DAY24H.Cart.buildGridCompare();
    },
    render: function () {

        var html = '<div class="product-item-info">'
            + '<div class="product-item-photo">'
            + '<a class="product-item-img" href="<%= model.Url%>" title="<%= model.ProductName%>">'
            + '<img alt="<%= model.ProductName%>" src="<%= model.ImgUrl%>">'
            + '</a>'
            + '<a class="product-item-name" href="<%= model.Url%>" >'
            + '<span><%= model.ProductName%></span>'
            + '</a>'
            + '<a class="product-item-del" href="javascript:DeleteCompareItem(\'<%= model.id%>\');" rel="<%= model.id%>" >'
            + '<span><i class="fa fa-close"></i></span>'
            + '</a>'
            + '<a class="product-item-comparethis comparethis" href="javascript:CompareThis(\'<%= model.id%>\',\'<%= model.PCodeCategory%>\');" pcode="<%= model.PCodeCategory%>" did="<%= model.id%>" >'
            + '<span><i class="fa fa-bar-chart"></i></span>'
            + '</a>'
            + '<a id="compare_plus_<%= model.id%>" class="product-item-compareplus comparethis" href="javascript:CompareThis(\'<%= model.id%>\',\'<%= model.PCodeCategory%>\');" pcode="<%= model.PCodeCategory%>" did="<%= model.id%>" >'
            + '<span><i class="fa fa-chevron-circle-down"></i></span>'
            + '</a>'
            + '</div>'
            + '</div>';

        this.template = _.template(html);
        $(this.el).html(this.template({ model: this.model.toJSON() }));
        return this;
    },
    close: function () {
        $(this.el).remove();
    }
});

window.CartGrid = Backbone.View.extend({
    tagName: 'tbody',
    render: function () {
        $(this.el).html('');
        var i = 1;
        _.each(this.collection.models, function (sfunction) {
            $(this.el).append((new CartGridItem({ model: sfunction })).render().el);
            i++;
        }, this);
        return this;
    },
    initialize: function () {
        var self = this;
        this.collection.bind("reset", this.render, this);
        this.collection.bind("add", function (sfunction) {
            $(self.el).prepend(new CartGridItem({ model: sfunction }).render().el);
        });
    }
});
window.CartGridItem = Backbone.View.extend({
    tagName: 'tr',
    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },
    events: {
        'click .cr-drop': 'removeItem'
    },
    removeItem: function (event) {
        var self = this;
        var cookieName = 'ProductStore';
        var productCookie = { "products": [] };
        var o = $.JSONCookie(cookieName);
        if (o == null) {
            o = productCookie;
        }
        var isExists = false;
        var eIndex = 0;
        $.each(o["products"], function (i, v) {
            if (v.Id == self.model.get('id')) {
                isExists = true;
                return false;
            }
            eIndex++;
        });
        if (isExists) {
            o["products"].splice(eIndex, 1);
        }

        eval('obj = ' + JSON.stringify(o), window);
        $.JSONCookie(cookieName, obj, { path: '/' });
        DAY24H.Cart.buildGrid();
    },
    render: function () {
        this.template = _.template('<th class="cr-title" style="text-align:left"><img class="img-cart-product" src="<%=model.Image%>" alt="<%= model.ProductName%>" /><span title="<%= model.ProductName%>"><%=model.ProductName%><br/> <span class="cart-quantity"><%=model.Quantity %></span> <em class="daux"> x </em> <span class="cart-price"><%=model.FormatPrice%></span></span></th><th width="10%" class="cr-drop"><img src="/Images/close.png" alt="Xóa" title="Xóa" /></th>');
        $(this.el).html(this.template({ model: this.model.toJSON() }));
        return this;
    },
    close: function () {
        $(this.el).remove();
    }
});
function ShowYeuCauBaoGia(ob) {
    var pId = $(ob).attr('data-id');
    var opt = $(ob).attr('data-opt');
    var numBG = $(ob).attr('data-num');

    OpenPopupBaoGiaCustomer(opt);
    var vQuantity = parseFloat($("#quantityNb").val());
    console.log(vQuantity);
    if (isNaN(vQuantity)) {
        var vQuantity =20 ;
    }
    if (isNaN(numBG)) {
        vQuantity = numBG;
    }
    // thêm option size
    var size = "";
    var nameOpt = "";

    //console.log('managecart.js---name: ' + name);
    var option = new Array();
    option['name'] = "";
    option['size'] = "";
    //pId = pId + "-" + size
    DAY24H.Cart.AddPriceListCustomer(pId, vQuantity, option, numBG);

}
function _AddToCart(ob) {
    var pId = $(ob).attr('data-id');
    var vQuantity = parseFloat($('#quantity_' + pId).val());
    if (isNaN(vQuantity)) {
        var vQuantity = 1;
    }
    alert('_AddToCart');
    console.log(ob);
    console.log(pId);
    DAY24H.Cart.Add2Cart(pId, vQuantity, 'productImageWrapID_' + pId);
}