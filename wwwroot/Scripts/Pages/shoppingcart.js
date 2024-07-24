$(document).ready(function () {
    if (typeof (DAY24H) == "undefined") {
        DAY24H = {};
    }
    var objcart;
    DAY24H.ShoppingCart = (function () {
        var methods = {};
        methods.CheckOutCartGrid = null;
        methods.GridCartCollection = null;
        methods.ViewCartGrid = null;
        methods.CustomerModel = null;
        var $table = $('#list-cart-detail');
        var $tableview = $('#view-cart-detail');

        methods.IsEmail = function (email) {
            var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!regex.test(email)) {
                return false;
            } else {
                return true;
            }
        };
        methods.buildGrid = function () {
            var productInCookie = $.JSONCookie('ProductStore');
            if (!!productInCookie) {
                $table.find('tbody').remove();
                var list = new CartCollection();
                if (productInCookie["products"].length == 0) {
                    $(".main-cart-content").empty().append('<p style="text-align:center; font-weight:bold; margin-top:10px;color:red">CHƯA CÓ ĐƠN HÀNG NÀO ĐƯỢC CHỌN</p>');
                    $("#cart-total").hide();
                    $("#view-total-price").empty();
                }

                if (productInCookie["products"].length > 0) {
                    var totalItem = 0, totalPrice = 0; totalUnitPrice = 0;
                    var stt = 1;
                    _.each(productInCookie["products"], function (item) {
                        var prices = 0;
                        var status = '';
                        prices = (item.Price == null ? 0 : item.Price) * item.Quantity;
                        if (item.Status > 0) {
                            status = 'Có sẵn';
                        } else {
                            status = 'Đặt hàng';
                        }
                        var dept = new Cart({
                            'stt': stt,
                            'id': item.Id,
                            'ProductName': item.ProductName,
                            'Quantity': item.Quantity,
                            'Price': item.Price == null ? 0 : item.Price,
                            'TotalPrice': prices,
                            'FormatPrice': $.formatNumber(item.Price, { format: "#,###", locale: "us" }),
                            'Status': status,
                            'FormatTotalPrice': $.formatNumber(prices, { format: "#,###", locale: "us" })
                        });
                        stt += 1;
                        totalItem += item.Quantity;
                        totalPrice += prices;
                        list.push(dept);
                    });
                    $("#cart-total").show();
                    $("#view-total-quantity").html($.formatNumber(totalItem, { format: "#,###", locale: "us" }));
                    $("#view-total-price").html($.formatNumber(totalPrice, { format: "#,###", locale: "us" }) + " đ");
                    $table.fadeIn();
                }
                methods.GridCartCollection = list;
                methods.CheckOutCartGrid = new CheckOutCartGrid({ collection: list });
                $table.append(methods.CheckOutCartGrid.render().el);
                if (window.quantity_focus_id != null) {
                    $("#" + window.quantity_focus_id).putCursorAtEnd();
                }
            } else {
                $table.empty();
            }
        };
        // Lưu thông tin khách hàng
        methods.SaveCustomerInfo = function () {
            // validate
            var valid = $("#ttkhachhang").form('validate');
            if (valid === false) {
                return false;
            }
            // kiểm tra mã xác nhận
            var captcha = $("#txtCaptchaCheckOut").val();
            var imgCaptcha = $("#imgcaptchaCheckOut").val();
            if (captcha === "") {
                MessageBoxWarning("Bạn phải nhập mã xác nhận.");
                return false;
            }
            if (captcha.toLowerCase() != imgCaptcha.toLowerCase()) {
                MessageBoxWarning("Mã xác nhận không chính xác.");
                return false;
            }
            var customerInfo = { 'UserName': $("#username").val(), 'CustomerName': $("#fullname").val(), 'Address': $("#address").val(), 'Telephone': $("#telephone").val(), 'Email': $("#email").val(), 'TicketType': 'PhieuDatHang' };

            $("#sUserName").html(customerInfo.UserName);
            $("#sFullName").html(customerInfo.CustomerName);
            $("#sAddress").html(customerInfo.Address);
            $("#sTelephone").html(customerInfo.Telephone);
            $("#sEmail").html(customerInfo.Email);

            $("#table-waiting_label").show();
            $("#table-checkout-info").hide();
            $tableview.find('tbody').remove();
            var list = new CartCollection();
            var sTotalPrice = 0; sQuantity = 0;
            var productInCookie = $.JSONCookie('ProductStore');
            var bResult = 0;
            var paymentType = $('#paymenttype').val();
            if (!!productInCookie && productInCookie["products"].length > 0) {
                var customer = JSON.stringify(customerInfo);
                var products = JSON.stringify(productInCookie["products"]);
                $.ajax({
                    type: "POST",
                    url: "/ManageCart/CheckOut",
                    data: "{'s1':'" + customer + "','s2':'" + products + "','s3':'" + paymentType + "'}",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: true,
                    success: function (response) {
                        var body = response.d;
                        if (body != null && body != "") {
                            _.each(productInCookie["products"], function (item) {
                                var stt = 1;
                                var status = '';
                                var prices = 0;
                                prices = (item.Price == null ? 0 : item.Price) * item.Quantity;
                                if (item.Status > 0) {
                                    status = 'Có sẵn';
                                } else {
                                    status = 'Đặt hàng';
                                }
                                var dept = new Cart({
                                    'stt': stt,
                                    'id': item.Id,
                                    'ProductName': item.ProductName,
                                    'Quantity': item.Quantity,
                                    'Price': item.Price == null ? 0 : item.Price,
                                    'TotalPrice': prices,
                                    'FormatPrice': $.formatNumber(item.Price, { format: "#,###", locale: "us" }),
                                    'Status': status,
                                    'FormatTotalPrice': $.formatNumber(prices, { format: "#,###", locale: "us" })
                                });
                                stt += 1;
                                sTotalPrice += prices;
                                sQuantity += item.Quantity;
                                list.push(dept);
                            });
                            // đặt hàng thành công
                            MessageBoxSuccess("Đặt hàng thành công.");
                            $("#table-waiting_label").hide();
                            $("#sTotal").html($.formatNumber(sTotalPrice, { format: "#,###", locale: "us" }) + " đ");
                            $("#sQuantity").html($.formatNumber(sQuantity, { format: "#,###", locale: "us" }));
                            $tableview.fadeIn();
                            methods.ViewCartGrid = new ViewCartGrid({ collection: list });
                            $tableview.append(methods.ViewCartGrid.render().el);
                            $("#view-checkout-info").show();
                            // Xóa giỏ hàng
                            $.JSONCookie('ProductStore', { "products": [] }, { path: '/' });
                            DAY24H.Cart.buildGrid();
                            // Gửi mail tới khách hàng
                            $.ajax({
                                type: "POST",
                                url: "/ManageCart/SendEmail",
                                data: "{'s1':'" + JSON.stringify(customerInfo) + "','s2':'" + body + "'}",
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                async: true,
                                success: function (response) {
                                },
                                failure: function (msg) {
                                }
                            });
                        }
                        else {
                            MessageBoxError("Có lỗi khi đặt hàng.");
                            var url = '/thanh-toan';
                            window.location = url;
                        }
                    },
                    failure: function (msg) {
                        MessageBoxError("Đặt hàng không thành công.");
                        bResult = 0;
                    }
                });
            }
        }
        methods.init = function () {
            methods.buildGrid();
            $(".do-payment").bind("click", methods.SaveCustomerInfo); //
            $(".pquantity, .pquantityx, .pprice .ppromo").numeric(false, function () { alert("Chỉ cho phép nhập số"); this.value = ""; this.focus(); });
        };
        return methods;
    })(DAY24H.ShoppingCart);
    DAY24H.ShoppingCart.init();
});
//cap nhat thong tin don hang
window.CheckOutCartGrid = Backbone.View.extend({
    tagName: 'tbody',
    render: function () {
        $(this.el).html('');
        var i = 1;
        _.each(this.collection.models, function (sfunction) {
            $(this.el).append((new CheckOutCartGridItem({ model: sfunction })).render().el);
            i++;
        }, this);
        return this;
    },
    initialize: function () {
        var self = this;
        this.collection.bind("reset", this.render, this);
        this.collection.bind("add", function (sfunction) {
            $(self.el).prepend(new CheckOutCartGridItem({ model: sfunction }).render().el);
        });
    }
});
window.CheckOutCartGridItem = Backbone.View.extend({
    tagName: 'tr',
    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },
    events: {
        'click .cr-drop': 'removeItem',
        'keyup  .pquantity': 'updatePrice'
    },
    updatePrice: function (event) {
        var self = this;
        if (event.type == 'keyup') {
            window.quantity_focus_id = $(event.currentTarget).attr('id');
        }
        var cookieName = 'ProductStore';
        var productCookie = { "products": [] };
        var o = $.JSONCookie(cookieName);
        if (o == null || o['products'] == null) {
            o = productCookie;
        }
        var isExists = false;
        $.each(o["products"], function (i, v) {
            if (v.Id == self.model.get('id')) {
                isExists = true;
                var quantity = parseInt($("#pQuantity" + self.model.get('id')).val());
                if (isNaN(quantity) || quantity == 0) {
                    quantity = 1;
                    $("#pQuantity" + self.model.get('id')).val(quantity);
                }
                v.Quantity = quantity;
                v.TotalPrice = v.Price * quantity;
                return false;
            }
        });
        eval('obj = ' + JSON.stringify(o), window);
        $.JSONCookie(cookieName, obj, { path: '/' });
        DAY24H.ShoppingCart.buildGrid();
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

        eval('objcart = ' + JSON.stringify(o), window);
        $.JSONCookie(cookieName, objcart, { path: '/' });
        DAY24H.ShoppingCart.buildGrid();
    },
    render: function () {
        var self = this;
        this.template = _.template('<td style="text-align:center;"><%= model.stt%></td><td class="code"><%= model.id%></td><td class="name" colspan="2"><a href="javascript:void(0)"><%= model.ProductName%></a></td>'
                    + '<td class="quantity">'
                      + '<input type="text" class="pquantity" name="Quantity" id="pQuantity<%= model.id %>" value="<%= model.Quantity%>" size="1" ">'
                      + '<em class="daux"> x </em>'
                      +'<em class="price"><%= model.FormatPrice %></em> '
                      +' <em class="hr">-----------------</em> '
                      +'<em class="total"><%= model.FormatTotalPrice %></em>'
                      +'</td><td class="promotion"><%= model.Status %></td><td class="cr-drop"><img src="/Images/close.png" alt="Xóa" title="Xóa" /></td>');
        $(this.el).html(this.template({ model: this.model.toJSON() }));
        return this;
    },
    close: function () {
        $(this.el).remove();
    }
});
//xem thong tin don hang
window.ViewCartGrid = Backbone.View.extend({
    tagName: 'tbody',
    render: function () {
        $(this.el).html('');
        var i = 1;
        _.each(this.collection.models, function (sfunction) {
            $(this.el).append((new ViewCartGridItem({ model: sfunction })).render().el);
            i++;
        }, this);
        return this;
    },
    initialize: function () {
        var self = this;
        this.collection.bind("reset", this.render, this);
        this.collection.bind("add", function (sfunction) {
            $(self.el).prepend(new ViewCartGridItem({ model: sfunction }).render().el);
        });
    }
});
window.ViewCartGridItem = Backbone.View.extend({
    tagName: 'tr',
    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },
    events: {
    },
    render: function () {        
        this.template = _.template('<td style="text-align:center;"><%= model.stt%></td><td class="code"><%= model.id%></td><td class="name" colspan="2"><a href="javascript:void(0)"><%= model.ProductName%></a></td>'
                    + '<td class="quantity">'
                      + '<em class="pquantity"><%= model.Quantity%> </em>'
                      + '<em class="daux"> x </em>'
                      + '<em class="price"><%= model.FormatPrice %></em> '
                      + ' <em class="hr">-----------------</em> '
                      + '<em class="total"><%= model.FormatTotalPrice %></em>'
                      + '</td><td class="promotion"><%= model.Status %></td>');
        $(this.el).html(this.template({ model: this.model.toJSON() }));
        return this;
    },
    close: function () {
        $(this.el).remove();
    }
});