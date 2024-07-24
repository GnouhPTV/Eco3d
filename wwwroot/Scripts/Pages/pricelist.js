function buildGridBaoGia() {
    if (typeof (Website) == "undefined") {
        Website = {};
    }
    var objcart;
    var methods = {};
    methods.PriceListCartGrid = null;
    methods.GridCartCollection = null;
    var $table = $('#tblpricelist');
    var priceCookie = $.JSONCookie('PriceStoreCustomer');
    $table.find('tbody').remove();
    if (!!priceCookie) {
        var list = new CartCollection();
        var totalItem = 0;
        if (priceCookie["price"] != null) {
            if (priceCookie["price"].length > 0) {
                var stt = 1;
                _.each(priceCookie["price"], function (item) {
                    var dept = new Cart({
                        'stt': stt,
                        'id': item.Id,
                        'Image': item.Image,
                        'Name': item.Name,
                        'Quantity': item.Quantity
                    });
                    stt += 1;
                    totalItem += item.Quantity;
                    list.push(dept);
                });
            }
        }
        $("#total-quantity").html($.formatNumber(totalItem, { format: "#,##0", locale: "us" }));
        $(".cart-price-counter").html(totalItem);
        methods.GridCartCollection = list;
        methods.PriceListCartGrid = new PriceListCartGrid({ collection: list });
        $table.append(methods.PriceListCartGrid.render().el);
    }
}
function YeuCauBaoGiaCustomer() {
    var opt = $("#ddlPrice").val();
    var name = $("#txtNameBG").val();
    var phone = $("#txtPhoneBG").val();
    var email = $("#txtEmailBG").val();
    var company = $("#txtCompany").val();
    var price = $("#ddlPrice").val();
    var user = $("#getUser").val();
    var ghichu = $("#txtGhiChuBG").val();
    ghichu = JSON.stringify(ghichu);
    if (typeof price == "undefined") {
        price = 'Cap2';
    }
    var priceInCookie = $.JSONCookie('PriceStoreCustomer');
    if (!!priceInCookie && priceInCookie["price"].length > 0) {
        var listPrice = JSON.stringify(priceInCookie["price"]);
        $.ajax({
            type: "POST",
            url: "/Product/YeuCauBaoGia",
            data: "{'name':'" + name + "','phone':'" + phone + "','email':'" + email + "','price':'" + price + "','list':'" + listPrice + "','user':'" + user + "','opt':'" + opt + "','ghichu':'" + ghichu + "'}",
            beforeSend: function () {
                //$('#tblpricelist').hide();
                $('.loadding').html('<img src="/Images/loading2.gif" />');
            },
            success: function (response) {
                setTimeout(
                    function () {
                        var body = response;
                        if (body != "") {
                            $('.loadding').html('');
                            OnCloseBaoGia();
                            // Báo giá hàng thành công
                            MessageBoxSuccess("Bạn đã gửi yêu cầu báo giá! <br/> Chúng tôi sẽ gửi báo giá vào email của Quý khách trong thời gian sớm nhất.");
                            // Xóa giỏ hàng
                            $.JSONCookie('PriceStoreCustomer', { "price": [] }, { path: '/' });
                            $('#tblpricelist').show();
                        }
                        else {
                            MessageBoxError("Có lỗi hệ thống, Khách hàng vui lòng liên hệ để được báo giá.");
                        }
                    }, 1000
                );
            }
        });
    }
}
//cap nhat thong tin don hang
window.PriceListCartGrid = Backbone.View.extend({
    tagName: 'tbody',
    render: function () {
        $(this.el).html('');
        var i = 1;
        _.each(this.collection.models, function (sfunction) {
            $(this.el).append((new PriceListGridItem({ model: sfunction })).render().el);
            i++;
        }, this);
        return this;
    },
    initialize: function () {
        var self = this;
        this.collection.bind("reset", this.render, this);
        this.collection.bind("add", function (sfunction) {
            $(self.el).prepend(new PriceListGridItem({ model: sfunction }).render().el);
        });
    }
});
//
window.PriceListGridItem = Backbone.View.extend({
    tagName: 'tr',
    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },
    events: {
        'click .cr-drop-price': 'removeItem',
        'change  .pquantity': 'updatePrice'
    },
    updatePrice: function (event) {
        var self = this;
        if (event.type == 'keyup') {
            window.quantity_focus_id = $(event.currentTarget).attr('id');
        }
        var cookieName = 'PriceStoreCustomer';
        var productCookie = { "price": [] };
        var ob = $.JSONCookie(cookieName);
        if (ob == null || ob['price'] == null) {
            ob = productCookie;
        }
        var isExists = false;
        $.each(ob["price"], function (i, v) {
            if (v.Id == self.model.get('id')) {
                isExists = true;
                var quantity = parseInt($("#pQuantity" + self.model.get('stt')).val());
                if (isNaN(quantity) || quantity == 0) {
                    quantity = 1;
                    $("#pQuantity" + self.model.get('id')).val(quantity);
                }
                v.Quantity = quantity;
                return false;
            }
        });
        eval('objcart = ' + JSON.stringify(ob), window);
        $.JSONCookie(cookieName, objcart, { path: '/' });
        buildGridBaoGia();
    },
    removeItem: function (event) {
        var self = this;
        var cookieName = 'PriceStoreCustomer';
        var productCookie = { "price": [] };
        var oj = $.JSONCookie(cookieName);
        if (oj == null) {
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
        }

        eval('objcart = ' + JSON.stringify(oj), window);
        $.JSONCookie(cookieName, objcart, { path: '/' });
        buildGridBaoGia();
    },
    render: function () {
        var self = this;
        this.template = _.template('<td class="code mhide"><img src="<%=model.Image%>" style="width:50px" alt="" title="" /></td>'
            + '<td class="name"><%= model.Name%></td><td class="quantity"><input type="text" class="pquantity input" name="Quantity" id="pQuantity<%= model.stt %>" value="<%= model.Quantity%>" size="9" style="width:48px;text-align:right;margin:0px;"></td>'
            + '<td class="cr-drop-price"><img src="/Images/close.png" alt="Xóa" title="Xóa" /></td>');
        $(this.el).html(this.template({ model: this.model.toJSON() }));
        return this;
    },
    close: function () {
        $(this.el).remove();
    }
});