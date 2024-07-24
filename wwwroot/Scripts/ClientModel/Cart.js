var Cart = Backbone.Model.extend({
    defaults: {
        'id': 0,
        'IsActive': true,
        'nocache': (new Date()).toJSON()
    },

    /* model có id bang 0 là model mới url sẽ là add */
    isNew: function () {
        var id = this.get('id');
        if (!id || id == 0) {
            return true;
        }
        return false;
    },
    /*
    lấy url
    */
    url: function () {
        if (this.isNew()) {
            return '/cart/add_item';
        } else {
            return '/cart/update_item';
        }
    }
});
var Customer = Backbone.Model.extend({
    defaults: {
        'id': 0,
        'IsActive': true,
        'nocache': (new Date()).toJSON()
    },
    isNew: function () {
        var id = this.get('id');
        if (!id || id == 0) {
            return true;
        }
        return false;
    },
});
var CartCollection = Backbone.Collection.extend({
    model: Cart
});