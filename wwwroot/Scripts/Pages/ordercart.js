$(document).ready(function () {
    if (typeof (DAY24H) == "undefined") {
        DAY24H = {};
    }
    var objcart;
    DAY24H.OrderCart = (function () {
        var methods = {};
        methods.CheckOutCartGrid = null;
        methods.GridCartCollection = null;
        methods.ViewCartGrid = null;
        methods.CustomerModel = null;
        var $table = $('#list-cart-detail');
        var $tableview = $('#view-cart-detail');
        methods.buildGrid = function () {
            console.log('Đã vào')
            var productInCookie = $.JSONCookie('OrderStore');
            var productInCookie2 = $.JSONCookie('OrderStore2');
            if (!!productInCookie['products'] && productInCookie['products'].length >= 0) {
                var object;
                if (!!productInCookie2['products'] && productInCookie2['products'].length >= 0) {
                    object = productInCookie['products'].concat(productInCookie2['products']);
                } else {
                    object = productInCookie['products'];
                }
                $table.find('tbody').remove();
                var list = new CartCollection();
                var totalItem = 0, totalPrice = 0; totalUnitPrice = 0;
                var stt = 1;
                _.each(object, function (item) {
                    if (item.Promo == null || typeof item.Promo === "undefined") {
                        item.Promo = 0;
                    }
                    var prices = 0;
                    if (item.Promo < 100) {
                        prices = item.Price * item.Quantity - item.Price * item.Quantity * item.Promo / 100;
                    } else {
                        prices = item.Price * item.Quantity - item.Promo;
                    }
                    var dept = new Cart({
                        'stt': stt,
                        'id': item.Id,
                        'ShortName': item.Name.substr(0, 20) + "...",
                        'Name': item.Name,
                        'Quantity': item.Quantity,
                        'Price': item.Price == null ? 0 : item.Price,
                        'TotalPrice': prices,
                        'FormatPrice': $.formatNumber(item.Price, { format: "#,###", locale: "us" }),
                        'FormatPromotion': $.formatNumber(item.Promo, { format: "#,###", locale: "us" }),
                        'FormatTotalPrice': $.formatNumber(prices, { format: "#,###", locale: "us" })
                    });
                    stt += 1;
                    totalItem += item.Quantity;
                    totalPrice += prices;
                    list.push(dept);
                    console.log('dept: ' + JSON.stringify(dept))
                });
                $("#cart-total").show();
                $("#view-total-quantity").html($.formatNumber(totalItem, { format: "#,###", locale: "us" }));
                $("#view-total-price").html($.formatNumber(totalPrice, { format: "#,###", locale: "us" }));
                methods.GridCartCollection = list;
                console.log('list: ' + JSON.stringify(list))
                methods.CheckOutCartGrid = new CheckOutCartGrid({ collection: list });
                $table.append(methods.CheckOutCartGrid.render().el);
                if (window.quantity_focus_id != null) {
                    $("[id='" + window.quantity_focus_id + "']").putCursorAtEnd();
                }
                TinhTongTienHang();
            } else {
                $.JSONCookie('OrderStore', { "products": [] }, { path: '/' });
                $.JSONCookie('OrderStore2', { "products": [] }, { path: '/' });
                DAY24H.OrderCart.buildGrid();
                $table.empty();
                setTimeout(function () { window.location.href = "/phieu-dat-hang"; }, 100);
            }
        };
        methods.AddToCookie = function (id, name, quantity, price, promo) {
            name = name.replace(/'/g, "");
            // lưu vào cookie
            var cookieName = 'OrderStore', productItem = { 'Id': id, 'Name': name, 'Quantity': quantity, 'Price': price, 'Promo': promo };
            var productCookie = { "products": [] };
            var oj = $.JSONCookie(cookieName);
            if (oj == null) {
                oj = productCookie;
            }
            // count item in cookies
            var count = 0;
            _.each(oj["products"], function (item) {
                ++count;
            });
            if (count > 13) {
                var isExists = false;
                $.each(oj["products"], function (i, v) {
                    if (v.Id == productItem.Id) {
                        isExists = true;
                        var q = v.Quantity + quantity;
                        v.Quantity = q;
                        v.Promo = promo;
                        v.Price = price;
                        return false;
                    }
                });
                if (!isExists) {
                    cookieName = 'OrderStore2';
                    oj = $.JSONCookie(cookieName);
                    if (oj == null || JSON.stringify(oj) == '{}') {
                        oj = productCookie;
                    }
                    var isExists2 = false;
                    $.each(oj["products"], function (i, v) {
                        if (v.Id == productItem.Id) {
                            isExists2 = true;
                            var q = v.Quantity + quantity;
                            v.Quantity = q;
                            v.Promo = promo;
                            v.Price = price;
                            return false;
                        }
                    });
                    if (!isExists2) {
                        oj["products"].push(productItem);
                    }
                }
            } else {
                var isExists3 = false;
                if (oj == null || JSON.stringify(oj) == '{}') {
                    oj = productCookie;
                }
                $.each(oj["products"], function (i, v) {
                    if (v.Id == productItem.Id) {
                        isExists3 = true;
                        var q = v.Quantity + quantity;
                        v.Quantity = q;
                        v.Promo = promo;
                        v.Price = price;
                        return false;
                    }
                });
                if (!isExists3) {
                    oj["products"].push(productItem);
                }
            }
            eval('obj = ' + JSON.stringify(oj), window);
            $.JSONCookie(cookieName, obj, { path: '/' });
        };
        methods.init = function () {
            methods.buildGrid();
        };
        return methods;
    })(DAY24H.OrderCart);
    DAY24H.OrderCart.init();
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
        'change  .pquantity': 'updatePrice',
        'change  .pprice': 'updatePrice',
        'change  .ppromo': 'updatePrice'
    },
    updatePrice: function (event) {
        var self = this;
        if (event.type == 'change') {
            window.quantity_focus_id = $(event.currentTarget).attr('id');
        }
        var id = self.model.get('id');
        var cookieName = 'OrderStore';
        var productCookie = { "products": [] };
        var ob = $.JSONCookie(cookieName);
        if (ob == null || ob['products'] == null) {
            ob = productCookie;
        }
        var isExists = false;
        $.each(ob["products"], function (i, v) {
            if (v.Id == id) {
                isExists = true;
                var quantity = parseInt(GetMoneyTextBox("pQuantity" + id));
                var price = parseFloat(GetMoneyTextBox("pPrice" + id));
                var promo = parseFloat(GetMoneyTextBox("pPromo" + id));
                if (isNaN(promo) || promo == null) {
                    promo = 0;
                }
                if (isNaN(quantity) || quantity == 0) {
                    quantity = 1;
                    $("[id='pQuantity" + id + "']").val(quantity);
                }
                v.Quantity = quantity;
                v.Price = price;
                v.Promo = promo;
                return false;
            }
        });
        // Update cookie2
        if (!isExists) {
            cookieName = 'OrderStore2';
            ob = $.JSONCookie(cookieName);
            if (ob == null || ob['products'] == null) {
                ob = productCookie;
            }
            $.each(ob["products"], function (i, v) {
                if (v.Id == id) {
                    isExists = true;
                    var quantity = parseInt(GetMoneyTextBox("pQuantity" + id));
                    var price = parseFloat(GetMoneyTextBox("pPrice" + id));
                    var promo = parseFloat(GetMoneyTextBox("pPromo" + id));
                    if (isNaN(promo) || promo == null) {
                        promo = 0;
                    }
                    if (isNaN(quantity) || quantity == 0) {
                        quantity = 1;
                        $("[id='pQuantity" + id + "']").val(quantity);
                    }
                    v.Quantity = quantity;
                    v.Price = price;
                    v.Promo = promo;
                    return false;
                }
            });
        }
        //
        eval('obj = ' + JSON.stringify(ob), window);
        $.JSONCookie(cookieName, obj, { path: '/' });
        DAY24H.OrderCart.buildGrid();
    },
    removeItem: function (event) {
        var self = this;
        var cookieName = 'OrderStore';
        var productCookie = { "products": [] };
        var oj = $.JSONCookie(cookieName);
        if (oj == null) {
            oj = productCookie;
        }
        var isExists = false;
        var eIndex = 0;
        $.each(oj["products"], function (i, v) {
            if (v.Id == self.model.get('id')) {
                isExists = true;
                return false;
            }
            eIndex++;
        });
        if (isExists) {
            oj["products"].splice(eIndex, 1);
            eval('objcart = ' + JSON.stringify(oj), window);
            $.JSONCookie(cookieName, objcart, { path: '/' });
        } else {
            // Xóa trong cookie 2
            var cookieName = 'OrderStore2';
            var oj = $.JSONCookie(cookieName);
            if (oj == null || JSON.stringify(oj) == '{}') {
                oj = productCookie;
            }
            var isExists = false;
            var eIndex = 0;
            $.each(oj["products"], function (i, v) {
                if (v.Id == self.model.get('id')) {
                    isExists = true;
                    return false;
                }
                eIndex++;
            });
            if (isExists) {
                oj["products"].splice(eIndex, 1);
                eval('objcart = ' + JSON.stringify(oj), window);
                $.JSONCookie(cookieName, objcart, { path: '/' });
            }
        }
        DAY24H.OrderCart.buildGrid();
    },
    render: function () {
        var self = this;
        this.template = _.template('<td class="name"><%= model.stt%>. <a href="javascript:void(0);" title="<%= model.Name%>"><%= model.id%></a><br/><%= model.Name%></td><td class="quantity" style="text-align:center;"><input type="text" class="pquantity input" id="pQuantity<%= model.id %>" onkeypress="return isNumberKey(event)" value="<%= model.Quantity%>" /></td><td class="price"><input type="text" class="pprice input" onkeypress="return isNumberKey(event)" id="pPrice<%= model.id %>" value="<%= model.FormatPrice%>" /><input type="hidden" id="pPromo<%= model.id %>" value="0" /></td><td class="total"><%= model.FormatTotalPrice %></td><td class="drop"><img class="cr-drop" src="/Images/close.png" alt="Xóa" title="Xóa sản phẩm" /></td>');
        $(this.el).html(this.template({ model: this.model.toJSON() }));
        return this;
    },
    close: function () {
        $(this.el).remove();
    }
});
function TinhTongTienHang() {
    var tienhang = GetMoneyHTML("view-total-price");
    var mucthue = $("#ddlVAT").val();
    var tienthue = parseFloat(mucthue) * parseFloat(tienhang) / 100;
    var khuyenmai = GetMoneyTextBox("KhuyenMai");
    var thanhtien = parseFloat(tienhang) + parseFloat(tienthue) - parseFloat(khuyenmai);
    var thanhtoan = GetMoneyTextBox("PsNo");
    var conlai = parseFloat(thanhtien) - parseFloat(thanhtoan);
    $("#TienHang").val(FormatPrice(parseFloat(tienhang)));
    $("#TienThue").val(FormatPrice(parseFloat(tienthue)));
    $("#PsCo").val(FormatPrice(parseFloat(thanhtien)));
    $("#ConLai").val(FormatPrice(parseFloat(conlai)));
    //GetTextMoney(thanhtien);
}