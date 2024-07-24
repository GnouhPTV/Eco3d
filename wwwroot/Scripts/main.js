'use strict';
$(document).ready(function () {
    $(".sticky").stick_in_parent({ offset_top: 70 });
    // Sản phẩm yêu thích
    $("a#add_favorite, a.add_favorite").click(function () {
        var id = $(this).attr('data');
        var name = $(this).attr('data-name');
        $.ajax({
            type: "POST",
            url: "/ManageCart/AddFavorite",
            data: "{'id':'" + id + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (response) {
                ShowMessage("Đã thêm <b>" + name + "</b> vào sản phẩm yêu thích.");
                //console.log(id);
                flyToElement('#img_' + id, $('.wishlist'));
                //getCountFavorite();
            }
        });
    });
    // LazyLoad
    _runLazyLoad();
});
function _runLazyLoad() {
    setTimeout(function () {
        $("img.lazyload").unveil(0, function () {
            $(this).load(function () {
                this.classList.remove("lazyload");
            });
        });
    }, 500);
}
var Web5s = function (options) {
    // Login Register
    var runLoginTrigger = function () {
        $("#modal_trigger").leanModal({top: 150, overlay: 0.6, closeButton: ".modal_close"});
        $(function () {
            // Calling Register Form
            $("#register_form").click(function () {
                $(".user_login").hide();
                $(".user_register").show();
                $(".header_title").text('Đăng ký');
                return false;
            });

            // Going back to Login Forms
            $(".back_btn").click(function () {
                $(".user_login").show();
                $(".user_register").hide();
                $(".header_title").text('Đăng nhập');
                return false;
            });
        });
    }

    // Show MenuMobiles
    var runMenuMobiles = function () {
        var overlay = $('.overlay');
        var menushow = $('#menu_show');
        var leftshow = $('#web_leftsidebar');
        $(".show_menu_on").click(function (e) {
            showMenu();
            return false;
        });
        $(".leftsidebar").click(function (e) {
            showLeftsidebar();
            return false;
        });
        $(".overlay").click(function (e) {
            hideMenu();
            hideLeftsidebar();
            return false;
        });
        function showMenu() {
            menushow.stop().animate({
                left: 0
            }, 0);
            overlay.show();
        }
        function hideMenu() {
            menushow.stop().animate({
                left: -300
            }, 0);
            overlay.hide();
        }
        function showLeftsidebar() {
            leftshow.stop().animate({
                left: 0,
                opacity: 1
            }, 0);
            overlay.show();
        }
        function hideLeftsidebar() {
            leftshow.stop().animate({
                left: -350
            }, 0);
            overlay.hide();
        }
    }

    // SlideShow
    var runSlideShow = function () {
        $("#owl-slideshow-web5s").owlCarousel({
            items: 1,
            loop: false,
            nav: true,
            navText: ["<i class='fa fa-caret-left'></i>", "<i class='fa fa-caret-right'></i>"],
            dots: true,
            smartSpeed: 450,
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            autoplay: true,
            autoplayHoverPause: true
        });

        $('#hotdealTab a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });
    }

    // HotDeal
    var runHotDeal = function () {
        $("#owl-hotdeal-web5s").owlCarousel({
            items: 1,
            loop: false,
            nav: false,
            navText: ["<i class='fa fa-caret-left'></i>", "<i class='fa fa-caret-right'></i>"],
            dots: true,
            autoplay: false,
            autoplayHoverPause: true
        });
    }

    // New Featured
    var runNewArrival = function () {
        $("#owl-arrival-web5s, #owl-promotion-web5s").owlCarousel({
            items: 1,
            loop: false,
            nav: true,
            navText: ["<i class='fa fa-caret-left'></i>", "<i class='fa fa-caret-right'></i>"],
            dots: false,
            responsive: {
                0: {items: 1},
                414: {items: 1},
                768: {items: 1},
                992: {items: 1},
                1200: {items: 1}
            },
            autoplay: false,
            autoplayHoverPause: true
        });
    }

    // Show Products
    var runShowProducts = function () {
    }

    // Brand Banner
    var runBrandBanner = function () {
        $("#owl-brand-web5s").owlCarousel({
            items: 6,
            loop: false,
            nav: false,
            dots: false,
            responsive: {
                0: {items: 2},
                414: {items: 2},
                768: {items: 5},
                992: {items: 6},
                1200: {items: 6}
            },
            autoplay: true,
            autoplayHoverPause: true
        });
    }

    // Scroll Filter
    var runScrollFilter = function () {
        $(document).ready(function () {
            $(".scroll-list ol").mCustomScrollbar({
                scrollButtons: {
                    enable: true
                }
            });
        });
    }

    // IMG Zoom
    var runIMGZoom = function () {
        $('#web5s-zoom').elevateZoom({
            zoomType: "inner",
            cursor: "pointer",
            zoomWindowFadeIn: 500,
            zoomWindowFadeOut: 750,
            gallery: 'gallery-img-list',
            galleryActiveClass: 'active'
        });

        $("#gallery-img-list").owlCarousel({
            items: 4,
            loop: false,
            nav: true,
            navText: ["<i class='fa fa-caret-left'></i>", "<i class='fa fa-caret-right'></i>"],
            dots: false,
            addClassActive: true,
            slideSpeed: 500
        });
    }

    // Product Related
    var runProductRelated = function () {
        $("#product-related-owl").owlCarousel({
            items: 4,
            loop: false,
            nav: true,
            navText: ["<i class='fa fa-caret-left'></i>", "<i class='fa fa-caret-right'></i>"],
            dots: false,
            responsive: {
                0: {items: 1},
                414: {items: 2},
                768: {items: 4},
                992: {items: 4},
                1200: {items: 4}
            },
            autoplay: false,
            autoplayHoverPause: true
        });
    }

    // Custom JS
    var runCustomJS = function ()
    {
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

        $('#productTab a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });
        (function ($) {
            fakewaffle.responsiveTabs(['xs', 'sm']);
        })(jQuery);
    }

    var runCheckout = function()
    {
      $("#divCheckoutLogin").show();
      $("#divCheckoutCallback").hide();
      $("input[name$='user_type']").click(function() 
      {
        var _url  =  $(this).attr("_url");
        var value = $(this).val();
        
        // Set action cho form
        $("#form_checkout").attr("action", _url);
        if (value == 'Yes') 
        {
            $("#divCheckoutLogin").show();
            $("#divCheckoutCallback").hide();
            $("button[type=submit]").removeAttr("disabled");
            $('#form_login_password').prop('disabled', false);
        } 
        else 
        {
            $("#divCheckoutCallback").show();
            $("#divCheckoutLogin").hide();
            $("#divCheckoutLogin button[type=submit]").attr("disabled", "disabled");
            $('#form_login_password').prop('disabled', true);
        }
      });
    }

    var runTooltip = function () {
        var originalLeave = $.fn.popover.Constructor.prototype.leave;
        $.fn.popover.Constructor.prototype.leave = function (obj) {
            var self = obj instanceof this.constructor ?
                    obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)
            var container, timeout;
            originalLeave.call(this, obj);
            if (obj.currentTarget) {
                container = $(obj.currentTarget).siblings('.popover')
                timeout = self.timeout;
                container.one('mouseenter', function () {
                    clearTimeout(timeout);
                    container.one('mouseleave', function () {
                        $.fn.popover.Constructor.prototype.leave.call(self, self);
                    });
                })
            }
        };
        $('[data-toggle="popover"]').popover({
            html: true,
            trigger: 'click hover',
            placement: 'top',
            delay: {show: 50, hide: 50}
        });
    }

    // Sale Code
    var runsaleCode = function () {
        $(document).ready(function () {
            $('#saleOff_label a').click(function () {
                $('#saleoffCode').addClass('show');
            });
            $('.hb-remove').click(function () {
                $('#saleoffCode').removeClass('show');
            });
        });

        $('input[type="checkbox"]').click(function () {
            if ($(this).attr("value") == "addhome") {
                $("#frm-shipping").slideToggle(400);
            }
            if ($(this).attr("value") == "addVAT") {
                $(".body_VAT").slideToggle(400);
            }
        });
    }

    // Back to Top
    var runTotop = function () {
        var offset = 300,
            //browser window scroll (in pixels) after which the "back to top" link opacity is reduced
            offset_opacity = 1200,
            //duration of the top scrolling animation (in ms)
            scroll_top_duration = 700;
                //grab the "back to top" link
            $back_to_top = $('.bTo-top');
            $nav_content = $('#ftwp-container');

        //hide or show the "back to top" link
        $(window).scroll(function () {
            
            if ($(this).scrollTop() > offset) {
                $back_to_top.addClass('bTo-is-visible');           
                $('#ftwp-container').addClass('ftwp-fixed-to-post');
            } else {
                $back_to_top.removeClass('bTo-is-visible bTo-fade-out');
                $('#ftwp-container').removeClass('ftwp-fixed-to-post');
            }
            if ($(this).scrollTop() > offset_opacity) {
                console.log($(this).scrollTop());
                $back_to_top.addClass('bTo-fade-out');
                $('#ftwp-container').addClass('ftwp-fixed-to-post');
            }
        });

        //smooth scroll to top
        $back_to_top.on('click', function (event) {
            event.preventDefault();
            $('body,html').animate({
                scrollTop: 0,
            }, scroll_top_duration
                    );
        });


    }

    return {
        init: function (options) {
            runLoginTrigger();
            runMenuMobiles();
            runSlideShow();
            runHotDeal();
            runNewArrival();
            runShowProducts();
            runBrandBanner();
            runScrollFilter();
            runIMGZoom();
            runProductRelated();
            runCustomJS();
            runCheckout();
            runTooltip();
            runsaleCode();
            runTotop();
        }
    }
}();
//custom js cho site
}
// get cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
// SignOut
function SignOut() {
    $.messager.confirm('Nhắc nhở', 'Bạn muốn đăng xuất ?', function (r) {
        if (r) {
            $.ajax({
                type: "POST",
                url: "/ManageCart/SignOut",
                data: "{}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: true,
                success: function (response) {
                    setTimeout(function () { location.reload(); }, 200);
                }
            });
        }
    });
}

// Xóa báo giá
function ClearCookie() {
    // xóa cookie
    $.JSONCookie("PriceStore", { "price": [] }, { path: '/' });
    $.JSONCookie("PriceStore2", { "price": [] }, { path: '/' });
}
function NewBaoGia() {
    $.messager.confirm('Nhắc nhở', 'Bạn muốn tạo báo giá mới?', function (r) {
        if (r) {
            // xóa cookie
            ClearCookie();
            // lưu tham số chung_tu
            sessionStorage.setItem("chung_tu", "");
            sessionStorage.setItem("copy", "");
            location.href = 'bao-gia';
        }
    });
}
// Set Language
function SetLanguage(a) {
    $.ajax({
        type: "POST",
        url: "/ManageCart/SetLanguage",
        data: "{'language':'" + a + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (response) {
            location.reload();
        },
        failure: function (msg) {
        }
    });
}
// log out
function OnSignOut() {
    $.messager.confirm('Nhắc nhở', 'Bạn có chắc chắn muốn đăng xuất tài khoản?', function (r) {
        if (r) {
            $.ajax({
                type: "POST",
                url: "/ManageCart/SignOut",
                data: "{}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: true,
                success: function (response) {
                    setTimeout(function () { location.reload(); }, 500);
                }
            });
        }
    });
}

