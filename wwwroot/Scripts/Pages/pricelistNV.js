function buildGridBaoGiaNV() {
    if (typeof (Website) == "undefined") {
        Website = {};
    }
    var objcart;
    var methods = {};
    methods.PriceListCartGridNV = null;
    methods.GridCartCollection = null;
    var $table = $('#tblpricelist');
    var priceCookie = $.JSONCookie('PriceStore');
    var priceCookie2 = $.JSONCookie('PriceStore2');
    if (!!priceCookie['price'] && priceCookie['price'].length >= 0) {
        var object;
        if (!!priceCookie2['price'] && priceCookie2['price'].length >= 0) {
            object = priceCookie['price'].concat(priceCookie2['price']);
        } else {
            object = priceCookie['price'];
        }
        $table.find('tbody').remove();
        var list = new CartCollection();
        var totalItem = 0;
        var stt = 1;
        _.each(object, function (item) {
            var dept = new Cart({
                'stt': stt,
                'id': item.Id,
                'id1': item.Id1,
                'Name': item.Name,
                'Price': $.formatNumber(item.Price, { format: "#,###.##", locale: "us" }),
                'Promo': item.Promo,
                'Quantity': item.Quantity,
                'Note': item.Note
            });
            stt += 1;
            totalItem += parseInt(item.Quantity);
            list.push(dept);
        });
        $("#total-quantity").html($.formatNumber(totalItem, { format: "#,###", locale: "us" }));
        $(".cart-price-counter").html(totalItem);
        methods.GridCartCollection = list;
        methods.PriceListCartGridNV = new PriceListCartGridNV({ collection: list });
        $table.append(methods.PriceListCartGridNV.render().el);
        // Lưu giá
        getPriceItem();
    }
}
function IsEmail(email) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!regex.test(email)) {
        return false;
    } else {
        return true;
    }
}
// Chọn mức giá
function SelectPriceItem() {
    var totalPrice = 0;
    var priceCookie = $.JSONCookie('PriceStore');
    var priceCookie2 = $.JSONCookie('PriceStore2');
    if (!!priceCookie['price'] && priceCookie['price'].length > 0) {
        var object;
        if (!!priceCookie2['price'] && priceCookie2['price'].length > 0) {
            object = priceCookie['price'].concat(priceCookie2['price']);
        } else {
            object = priceCookie['price'];
        }
        var list = new CartCollection();
        _.each(object, function (item) {
            var id = item.Id;
            // Lấy giá
            var mucgia = $('#ddlGia').val();
            $.ajax({
                type: "POST",
                url: "/ManageCart/GetPriceProduct",
                data: "{id: '" + id + "',mucgia: '" + mucgia + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    var r = response.d;
                    if (r != '0') {
                        $("[id='pPrice" + id + "']").val($.formatNumber(r, { format: "#,##0", locale: "us" }));
                        // lưu cookie
                        DAY24H.Cart.AddToPriceCookie(item.Id, item.Name, 0, r, item.Id1, item.Promo);
                    } else {
                        $("[id='pPrice" + id + "']").val($.formatNumber(item.Price, { format: "#,##0", locale: "us" }));
                    }
                    // tính tổng tiền
                    sumTotalPrice();
                }
            });
        });
    }
}
function getPriceItem() {
    var totalPrice = 0;
    var priceCookie = $.JSONCookie('PriceStore');
    var priceCookie2 = $.JSONCookie('PriceStore2');
    if (!!priceCookie['price'] && priceCookie['price'].length > 0) {
        var object;
        if (!!priceCookie2['price'] && priceCookie2['price'].length > 0) {
            object = priceCookie['price'].concat(priceCookie2['price']);
        } else {
            object = priceCookie['price'];
        }
        var list = new CartCollection();
        var chung_tu = sessionStorage.getItem("chung_tu");
        var copy = sessionStorage.getItem("copy");
        if ((chung_tu == '' || chung_tu == null) && (copy == '' || copy == null)) {
            _.each(object, function (item) {
                var id = item.Id;
                // Lấy giá
                var mucgia = $('#ddlGia').val();
                $.ajax({
                    type: "POST",
                    url: "/ManageCart/GetPriceProduct",
                    data: "{id: '" + id + "',mucgia: '" + mucgia + "'}",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        var r = response.d;
                        if (r != '0') {
                            $("[id='pPrice" + id + "']").val($.formatNumber(r, { format: "#,##0", locale: "us" }));
                            // lưu cookie
                            DAY24H.Cart.AddToPriceCookie(item.Id, item.Name, 0, r, item.Id1, item.Promo);
                        } else {
                            $("[id='pPrice" + id + "']").val($.formatNumber(item.Price, { format: "#,##0", locale: "us" }));
                        }
                        // Tổng tiền
                        sumTotalPrice();
                    }
                });
            });
        }
    }
}
function sumTotalPrice() {
    var totalPrice = 0;
    var totalItem = 0;
    var priceCookie = $.JSONCookie('PriceStore');
    var priceCookie2 = $.JSONCookie('PriceStore2');
    if (!!priceCookie['price'] && priceCookie['price'].length > 0) {
        var object;
        if (!!priceCookie2['price'] && priceCookie2['price'].length > 0) {
            object = priceCookie['price'].concat(priceCookie2['price']);
        } else {
            object = priceCookie['price'];
        }
        var list = new CartCollection();
        _.each(object, function (item) {
            // Tổng tiền
            totalItem += parseInt(item.Quantity);
            totalPrice += (parseFloat(item.Price) * parseFloat(item.Quantity)) - (parseFloat(item.Price) * parseFloat(item.Quantity) * parseFloat(item.Promo) / 100);
            $("#total-quantity").html($.formatNumber(totalItem, { format: "#,###", locale: "us" }));
            $("#total-price").html($.formatNumber(totalPrice, { format: "#,###.##", locale: "us" }));
        });
    }
}
//cap nhat thong tin don hang
window.PriceListCartGridNV = Backbone.View.extend({
    tagName: 'tbody',
    render: function () {
        $(this.el).html('');
        var i = 1;
        _.each(this.collection.models, function (sfunction) {
            $(this.el).append((new PriceListGridItemNV({ model: sfunction })).render().el);
            i++;
        }, this);
        return this;
    },
    initialize: function () {
        var self = this;
        this.collection.bind("reset", this.render, this);
        this.collection.bind("add", function (sfunction) {
            $(self.el).prepend(new PriceListGridItemNV({ model: sfunction }).render().el);
        });
    }
});
//
window.PriceListGridItemNV = Backbone.View.extend({
    tagName: 'tr',
    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },
    events: {
        'click .cr-drop-price': 'removeItem',
        'change  .pquantity': 'updatePrice',
        'change  .pprice': 'updatePrice',
        'change  .ppromo': 'updatePrice',
        'change  .pnote': 'updatePrice'
    },
    updatePrice: function (event) {
        var self = this;
        if (event.type == 'keyup') {
            window.quantity_focus_id = $(event.currentTarget).attr('id');
        }
        var cookieName = 'PriceStore';
        var productCookie = { "price": [] };
        var ob = $.JSONCookie(cookieName);
        if (ob == null || ob['price'] == null) {
            ob = productCookie;
        }
        var isExists = false;
        $.each(ob["price"], function (i, v) {
            if (v.Id == self.model.get('id')) {
                isExists = true;
                var quantity = parseInt($("[id='pQuantity" + self.model.get('id') + "']").val());
                var promo = parseFloat($("[id='pPromo" + self.model.get('id') + "']").val());
                var price = $("[id='pPrice" + self.model.get('id') + "']").val();
                var note = $("[id='pNote" + self.model.get('id') + "']").val().replace(/'/g, '');
                price = price.replace(/,/g, "");
                if (isNaN(quantity) || quantity == 0) {
                    quantity = 1;
                    $("[id='pQuantity" + self.model.get('id') + "']").val(quantity);
                }
                if (isNaN(promo) || promo == 0 || promo >= 100) {
                    promo = 0;
                    $("[id='pPromo" + self.model.get('id') + "']").val(promo);
                }
                if (isNaN(price) || price == 0) {
                    promo = 0;
                    $("[id='pPrice" + self.model.get('id') + "']").val(price);
                }
                v.Quantity = quantity;
                v.Price = price;
                v.Promo = promo;
                v.Note = note;
                return false;
            }
        });
        // Update cookie2
        if (!isExists) {
            cookieName = 'PriceStore2';
            ob = $.JSONCookie(cookieName);
            if (ob == null || ob['price'] == null) {
                ob = productCookie;
            }
            $.each(ob["price"], function (i, v) {
                if (v.Id == self.model.get('id')) {
                    isExists = true;
                    var quantity = parseInt($("[id='pQuantity" + self.model.get('id') + "']").val());
                    var promo = parseFloat($("[id='pPromo" + self.model.get('id') + "']").val());
                    var price = $("[id='pPrice" + self.model.get('id') + "']").val();
                    var note = $("[id='pNote" + self.model.get('id') + "']").val().replace(/'/g, '');
                    price = price.replace(/,/g, "");
                    if (isNaN(quantity) || quantity == 0) {
                        quantity = 1;
                        $("[id='pQuantity" + self.model.get('id') + "']").val(quantity);
                    }
                    if (isNaN(promo) || promo == 0 || promo >= 100) {
                        promo = 0;
                        $("[id='pPromo" + self.model.get('id') + "']").val(promo);
                    }
                    if (isNaN(price) || price == 0) {
                        promo = 0;
                        $("[id='pPrice" + self.model.get('id') + "']").val(price);
                    }
                    v.Quantity = quantity;
                    v.Price = price;
                    v.Promo = promo;
                    v.Note = note;
                    return false;
                }
            });
        }
        // Save cookie
        eval('objcart = ' + JSON.stringify(ob), window);
        $.JSONCookie(cookieName, objcart, { path: '/' });
        // Sum quantity
        sumTotalPrice();
    },
    removeItem: function (event) {
        var self = this;
        var cookieName = 'PriceStore';
        var productCookie = { "price": [] };
        var oj = $.JSONCookie(cookieName);
        if (oj == null || JSON.stringify(oj) == '{}') {
            oj = productCookie;
        }
        var isExists = false;
        var eIndex = 0;
        $.each(oj["price"], function (i, v) {
            if (v.Id == self.model.get('id')) {
                isExists = true;
                return false;
            }
            eIndex++;
        });
        if (isExists) {
            oj["price"].splice(eIndex, 1);
            eval('objcart = ' + JSON.stringify(oj), window);
            $.JSONCookie(cookieName, objcart, { path: '/' });
        } else {
            // Xóa trong cookie 2
            var cookieName = 'PriceStore2';
            var oj = $.JSONCookie(cookieName);
            if (oj == null || JSON.stringify(oj) == '{}') {
                oj = productCookie;
            }
            var isExists = false;
            var eIndex = 0;
            $.each(oj["price"], function (i, v) {
                if (v.Id == self.model.get('id')) {
                    isExists = true;
                    return false;
                }
                eIndex++;
            });
            if (isExists) {
                oj["price"].splice(eIndex, 1);
                eval('objcart = ' + JSON.stringify(oj), window);
                $.JSONCookie(cookieName, objcart, { path: '/' });
            }
        }
        buildGridBaoGiaNV();
    },
    render: function () {
        var self = this;
        this.template = _.template('<td class="code"><a href="javascript:void(0)" onclick="XemTonKho(\'<%=model.id%>\');"><img src="/WebService/GetImgCode.ashx?imgId=<%= model.id1%>" style="width:50px" alt="" title="" onerror="imgError(this);" /></a><br/><img class="cr-drop-price" src="/Images/delete-all.png" alt="Xóa" title="Xóa" /></td><td class="name"><%= model.Name%> (<a><%= model.id%></a>)<br/><br/><input type="text" class="pnote input" id="pNote<%= model.id %>" placeholder="Ghi chú..." value="<%= model.Note%>" style="width:60%"></td><td class="quantity"><input type="text" class="pquantity input" name="Quantity" id="pQuantity<%= model.id %>" value="<%= model.Quantity%>" size="1" style="width:48px;text-align:right;margin:0px;"></td><td class="price"><input type="text" class="pprice input" id="pPrice<%= model.id %>" value="<%= model.Price%>" style="width:70px;text-align:right;margin:0px"><br/>- <input type="text" class="ppromo input" id="pPromo<%= model.id %>" value="<%= model.Promo%>" style="width:40px;text-align:right;margin: 3px 0 0;"> %</td></td>');
        $(this.el).html(this.template({ model: this.model.toJSON() }));
        return this;
    },
    close: function () {
        $(this.el).remove();
    }
})