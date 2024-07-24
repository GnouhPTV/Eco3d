//####################################################
// jQuery Handle
//####################################################
(function($)
{
	$(document).ready(function()
	{
		// Hide it
		$(".hideit").click(function()
		{
			$(this).fadeOut();
		});
		
		// Lightbox
		$('.lightbox').nstUI({
			method:	'lightbox'
		});
                
                // Number format
		//$('.format_number').number(true);
		
		// Form handle
		$('.form_action').each(function()
		{
			$(this).nstUI({
				method:	'formAction',
				formAction:	{
					field_load: $(this).attr('_field_load')
				}
			});
		});
                		
		// Verify action
		$('.verify_action').nstUI({
			method:	'verifyAction'
		});
		
		// Tooltip
		$('[_tooltip]').nstUI({
			method:	'tooltip'
		});
		
		// Drop Down
		$('[_dropdown]').nstUI({
			method:	'dropdown'
		});
		
		// Placeholder
		$('input.placeholder').nstUI({
			method:	'placeholder'
		});
		
		// Accordion
		$('.accordion').each(function()
		{
			var _t = $(this);
			_t.nstUI({
				method:	'accordion',
				accordion: {type: _t.attr('_accordion_type')}
			});
		});
		
		// Auto check pages
		$('.auto_check_pages').each(function()
		{
			auto_check_pages($(this));
		});
		
		// Date picker
		$('.datepicker').each(function()
		{
			var config_default = { 
					defaultDate: +7,
					autoSize: true,
					dateFormat: 'dd-mm-yy',
					changeMonth: true,
					changeYear: true,
					yearRange: "1975"
			};
			
			var config_cur = $(this).attr('_config');
			config_cur = (config_cur) ? JSON.parse(config_cur) : {};
			
			var config = $.extend({}, config_default, config_cur);
			$(this).datepicker(config);
		});
		
		
		
		// Autocomplete
		var cache = {}, lastXhr;
		$('.autocomplete').each(function()
		{
			var url_search = $(this).attr('_url');
			
			$(this).autocomplete(
			{
				minLength: 2,
				source: function(request, response)
				{
					var term = request.term;
					
					if (term in cache)
					{
						response(cache[term]);
						return;
					}
		
					lastXhr = $.getJSON(url_search, request, function(data, status, xhr)
					{
						cache[term] = data;
						if (xhr === lastXhr)
						{
							response(data);
						}
					});
				}
			});
		});
		
		// Change lang currency
		$('.change_lang, .change_currency').click(function()
		{
			$(this).nstUI({
				method:	"loadAjax",
				loadAjax: {
					url: $(this).attr('_url'),
					field: {load:'', show:''},
					event_complete: function()
					{
						window.location.reload();
					}
				}
			});
			
			return false;
		});
		
	});
})(jQuery);


//####################################################
// Main function
//####################################################
/**
 * Load ajax
 */
function load_ajax(_t)
{
    var field = jQuery(_t).attr('_field');
    var url = jQuery(_t).attr('_url');

    jQuery(_t).nstUI(
    {
        method:	"loadAjax",
        loadAjax:{
                url: url,
                field: {load: field+'_load', show: field+'_show'}
        }
    });

    return false;
}

/**
 * Gan gia tri cua cac bien vao html
 */
function temp_set_value(html, params)
{
    jQuery.each(params, function(param, value)
    {
            var regex = new RegExp('{'+param+'}', "igm");
            html = html.replace(regex, value);
    });

    return html;
}

/**
 * Copy gia tri giua 2 field
 */
function copy_value(from, to)
{
    jQuery(this).nstUI({
            method:	'copyValue',
            copyValue: {
                    from: from,
                    to: to
            }
    });
}

/**
 * Hien thi lightbox
 */
function lightbox(t)
{
    jQuery(t).nstUI({
            method:	'lightbox'
    });
}

/**
 * An pages khi ko co chia trang
 */
function auto_check_pages(t)
{
    if (t.find('a')[0] == undefined)
    {
            t.remove();
    }
}


/**
 * Hien thi panel cua account
 */
function load_account_panel()
{
    jQuery(this).nstUI(
    {
        method:	"loadAjax",
        loadAjax:{
            url: site_url + 'user/account_panel',
            field: {load: '_', show: 'account_panel'}
        }
    });
}

/*
 * @param {type} object
 */
function setPLocation(url, setFocus) 
{
    if (setFocus) 
    {
        window.opener.focus();
    }
    
    window.opener.location.href = url;
    window.close();
}

/*
 * @param {type} object
 */
function printObject(object) 
{
    var printContents = document.getElementById(object).innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
}
/*
 * 
 * @param {type} id
 */
 function printOrder(url) 
 {
    $.ajax({
        url: url,
        dataType: 'html',
        type: 'post',
        success: function (html) 
        {
            window.frames['print_content'].document.body.innerHTML = html;
            window.frames['print_content'].window.focus();
            window.frames['print_content'].window.print();
        }
    });
}


/**
 * Thay doi captcha
 */
function change_captcha(field)
{
    var t = jQuery('#'+field);
    var url = t.attr('_captcha')+'?id='+Math.random();
    t.attr('src', url);

    return false;
}

/*
* Hoan load du lieu cho 1 doi tuong
*/                        
function ajax_load_item(widget, _url, type, result)
{
    (function($)
    {
        $(document).ready(function()
        {
            var area = $(widget);
            $.ajax({
                url : _url,
                type : 'post',
                dateType: 'json',
                data : {},
                success : function (data)
                {
                    if (data['total'] != undefined && data['total'])
                    {
                        area.find(result).html(data['total']);
                    }
                }
            });
        });
    })(jQuery);
}
