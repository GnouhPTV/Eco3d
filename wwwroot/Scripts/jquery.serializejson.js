
/**
 * jQuery plugin to serialize all inputs decending from an
 *
 * @author Jan-Christian Nikles (j_nikles@web.de)
 * @since 2016-05-12
 *
 */
$.fn.serializeJson = function () {
  var inputs, select, textAreas, result, date, $input, name;

  inputs = this.find("input");
  selects = this.find("select");
  textAreas = this.find("textarea");
  result = {};

  inputs.each(function (index, input) {
    $input = $(input);
    name = $input.attr("name");

    switch(input.type) {
      case 'password':
      case 'text':
        result[name] = $input.val();
        break;
      case 'date':
        date = new Date($input.val());
        result[name] = date;
        break;
      case 'checkbox':
        result[name] = $input.is(":checked");
        break;
      case 'number':
        result[name] = parseInt($input.val());
    }
  });

  selects.each(function (index, select) {
    $input = $(select);
    name = $input.attr("name");

    result[name] = $input.val();
  });

  textAreas.each(function (index, area) {
    $input = $(area);
    name = $input.attr("name");
    result[name] = $input.val();
  });

  return result;
};
