(function ($) {

if (Drupal.Nucleus == undefined) {
  Drupal.Nucleus = {};
}
Drupal.Nucleus.currentRegionBlockPopupId = false;
Drupal.Nucleus.currentRegionBlockButtonId = false;
Drupal.Nucleus.closestRelative = false;

Drupal.behaviors.nucleusGridAction = {
  attach: function (context) {
    $('.rb-setting-sub-form .rb-setting-btn').click(function(event) {
      button_id = $(this).attr('id');
      page_prefix = Drupal.Nucleus.currentPagePrefix();
      constant_key = "_setting_btn_" + page_prefix;
      constant_key_pos = button_id.indexOf(constant_key);
      constant_key_len = constant_key.length;
      type = button_id.substr(0, constant_key_pos);
      key = button_id.substr(constant_key_pos + constant_key_len);
      popup_id = type + "_popup_" + page_prefix + key;
      if(Drupal.Nucleus.currentRegionBlockPopupId) {
        $('#' + Drupal.Nucleus.currentRegionBlockPopupId).hide();
      }
      Drupal.Nucleus.showPopup(popup_id, button_id);
      Drupal.Nucleus.eventStopPropagation(event);
    });

    $(document).bind('click', function() {
      Drupal.Nucleus.hidePopup(false);
    });
    $('.tb-popup-wrap').click(function(event) {
      Drupal.Nucleus.eventStopPropagation(event);
    });
  }
};

Drupal.Nucleus.showPopup = function(popupId, buttonId) {
  if(Drupal.Nucleus.currentRegionBlockButtonId != buttonId && popupId != Drupal.Nucleus.currentRegionBlockPopupId) {
    Drupal.Nucleus.currentRegionBlockButtonId = buttonId;
    Drupal.Nucleus.currentRegionBlockPopupId = popupId;
    $('#' + Drupal.Nucleus.currentRegionBlockButtonId).addClass('active');
    var popup = $('#' + popupId);
    var button = $('#' + buttonId);

    if(!Drupal.Nucleus.closestRelative) {
      Drupal.Nucleus.closestRelative = Drupal.Nucleus.getClosestRelative(popup);
    }
    var popup_wrapper = $("#edit-settings-popup-container");
    var button_top = button.offset().top + 25;
    var button_left = button.offset().left;
    var popup_top = button_top - Drupal.Nucleus.closestRelative.top;
    var popup_left = button_left - Drupal.Nucleus.closestRelative.left;
    var page_prefix = Drupal.Nucleus.currentPagePrefix();
    var page_review_container = $("#" + page_prefix + "page_preview_container");
    var preview_left = page_review_container.offset().left;
    var preview_width = page_review_container.width();
    if (button_left + popup.width() > preview_left + preview_width) {
      popup_left -= button_left + popup.width() - (preview_left + preview_width);
    }
    popup.css({top: popup_top + "px", left: popup_left + "px"});
    popup.show();
  }
  else {
    Drupal.Nucleus.currentRegionBlockButtonId = false;
    Drupal.Nucleus.currentRegionBlockPopupId = false;
  }
}

Drupal.Nucleus.savePopupDialog = function(event, page_key, type, key) {
  if (!Drupal.Nucleus.extendClassGroupsNameList || !Drupal.Nucleus.extendClassesList) {
    window.setTimeout(function() {Drupal.Nucleus.saveExtendClassPopup(event, page_key, type, key)}, 50);
    return;
  }

  var page_prefix = (page_key == 'default' || $page_key == '') ? "" : (page_key + "_");
  var style_name = page_prefix + type + "_" + key + "_style";
  var selector_style_name = style_name + "_selector";
  var width_name = page_prefix + key + "_width";
  var selector_width_name = width_name + "_selector";
  var hidden_name = page_prefix + type + "_" + key + '_extend_class';
  var name = hidden_name.replace(/_/gi, '-');
  var current_page = page_key;

  var values = [];
  var texts = [];
  var selector_style = $('select[name="' + selector_style_name + '"]');
  if (selector_style) {
    var style = selector_style.val();
    $('input[name="' + style_name + '"]').val(style);
    if (style == 'default') {
      if(type == 'block') {
        style = Drupal.Nucleus.getApplyingBlockStyle(current_page, type, key);
      }
    }

    if (Drupal.Nucleus.extendClassSupportGroups !== undefined && Drupal.Nucleus.extendClassSupportGroups[style]) {
      var group_name_list = Drupal.Nucleus.extendClassSupportGroups[style];
      var support_some_group = false;
      for (var x in group_name_list) {
        var group = group_name_list[x];
        var radio = $('input:radio[name="' + name + '-' + group + '"]:checked');
        if (radio) {
          var value = radio.val();
          if (value != undefined && value != '') {
            var text = Drupal.Nucleus.extendClassesList[value];
            values.push(group);
            values.push(value);
            texts.push(text);
          }
        }
      }
      var shower_text = texts.join(', ');
      if (shower_text == "") {
        shower_text = "&nbsp;";
      }
      $('#' + name + '-shower').html(shower_text);
      $('input:hidden[name="' + hidden_name + '"]').attr("value", values.join(' '));
    }
  }

  var selector_width = $('select[name="' + selector_width_name + '"]');
  if (selector_width) {
    var width = selector_width.val();
    $('input[name="' + width_name + '"]').val(width);
  }

  Drupal.Nucleus.hidePopup(true);
  Drupal.Nucleus.eventStopPropagation(event);
  $('#' + type + '_setting_btn_' + page_prefix + key).addClass('changed-settings');
}

Drupal.Nucleus.cancelPopupDialog = function(event, page_key, type, key) {
  Drupal.Nucleus.hidePopup(true);

  var page_prefix = (page_key == 'default' || $page_key == '') ? "" : (page_key + "_");
  var style_name = page_prefix + type + "_" + key + "_style";
  var selector_style_name = style_name + "_selector";
  var width_name = page_prefix + key + "_width";
  var selector_width_name = width_name + "_selector";
  var hidden_name = page_prefix + type + "_" + key + '_extend_class';
  var name = hidden_name.replace(/_/gi, '-');

  var input_extend_class = $('input:hidden[name="' + hidden_name + '"]');
  var selector_style = $('select[name="' + selector_style_name + '"]');
  if(selector_style && input_extend_class) {
    selector_style.val($('input:hidden[name="' + style_name + '"]').val());
    current_extend_class = input_extend_class.val();
    var parts = current_extend_class.split(' ');
    for(var i = 0; i < parts.length; i += 2) {
      var group = parts[i];
      var extend_class = parts[i + 1];
      $('#' + name + '-' + group + '-' + extend_class).attr('checked', 'checked');
    }
    Drupal.Nucleus.handleShowHideGroupExtendClass(page_key, type, key, selector_style.val());
  }
  var selector_width = $('select[name="' + selector_width_name + '"]');
  if (selector_width) {
    selector_width.val($('input:hidden[name="' + width_name + '"]').val());
  }
}

Drupal.Nucleus.onChangeBlockStyle = function(page_key, type, key) {
  if (!Drupal.Nucleus.extendClassSupportGroups) {
    window.setTimeout(function() {Drupal.Nucleus.onChangeBlockStyle(page_key, type, key)}, 50);
    return;
  }

  var page_prefix = (page_key == 'default' || $page_key == '') ? "" : (page_key + "_");
  var style_name = page_prefix + type + "_" + key + "_style";
  var selector_style_name = style_name + "_selector";
  var hidden_name = page_prefix + type + "_" + key + '_extend_class';
  var name = hidden_name.replace(/_/gi, '-');
  var current_page = page_key;

  var selector_style = $('select[name="' + selector_style_name + '"]');
  if (selector_style) {
    var style = selector_style.val();
    if (style == 'default') {
      if(type == 'block') {
        style = Drupal.Nucleus.getApplyingBlockStyle(current_page, type, key);
      }
    }

    Drupal.Nucleus.handleShowHideGroupExtendClass(current_page, type, key, style);

    if (type == 'region') {
      var region_key = key;
      region_key = region_key.replace(/_/gi, '-');
      Drupal.Nucleus.showHideRegionExtendClass(Drupal.Nucleus.regionsBlocksList['regions'][region_key], current_page, region_key, style);
    }
  }
}

Drupal.Nucleus.handleShowHideGroupExtendClass = function(page_key, type, key, style) {
  if (Drupal.Nucleus.extendClassSupportGroups !== undefined && Drupal.Nucleus.extendClassSupportGroups[style]) {
  var page_prefix = (page_key == 'default' || $page_key == '') ? "" : (page_key + "_");
  var style_name = page_prefix + type + "_" + key + "_style";
    var selector_style_name = style_name + "_selector";
    var hidden_name = page_prefix + type + "_" + key + '_extend_class';
    var name = hidden_name.replace(/_/gi, '-');
    var current_page = page_key;

    var values = [];
    var texts = [];
    var group_name_list = Drupal.Nucleus.extendClassSupportGroups[style];
    var visited = {};
    for (var x in group_name_list) {
      var group = group_name_list[x];
      visited[group] = true;
      var radio = $('input:radio[name="' + name + '-' + group + '"]:checked');
      if (radio) {
        var value = radio.val();
        if (value != undefined && value != '') {
          var text = Drupal.Nucleus.extendClassesList[value];
          values.push(group);
          values.push(value);
          texts.push(text);
        }
      }
    }

    if (Drupal.Nucleus.styleSupportCounter[style]) {
      for (x in Drupal.Nucleus.extendClassGroupsNameList) {
        var group = Drupal.Nucleus.extendClassGroupsNameList[x];
        var element = $('#' + name + "-" + group + "-group");
        if (element) {
          if (visited[group]) {
            element.show();
          }
          else {
            element.hide();
          }
        }
      }

      var shower_text = texts.join(', ');
      if (shower_text == "") shower_text = "&nbsp;";
      $('#' + name + '-shower').html(shower_text);
      $('input:hidden[name="' + hidden_name + '"]').attr("value", values.join(' '));
      $('#' + name + '-tb-extend-class').show();
    }
    else {
      $('#' + name + '-shower').html('');
      $('input:hidden[name="' + hidden_name + '"]').attr("value", '');
      $('#' + name + '-tb-extend-class').hide();
    }
  }
}

Drupal.Nucleus.showHideRegionExtendClass = function(blocks_list, page_key, key, style) {
  for (var block_key in blocks_list) {
    if (blocks_list[block_key]) {
      var page_prefix = (page_key == 'default' || $page_key == '') ? "" : (page_key + "_");
      var style_name = page_prefix + "block_" + block_key + "_style";
      var selector_style_name = style_name + "_selector";
      var hidden_name = page_prefix + "block_" + block_key + '_extend_class';
      var name = hidden_name.replace(/_/gi, '-');
      var block_style = $('select[name="' + selector_style_name + '"]').val();
      if (block_style == 'default') {
        Drupal.Nucleus.handleShowHideGroupExtendClass(page_key, 'block', block_key, style);
      }
    }
  }
}

Drupal.Nucleus.getApplyingBlockStyle = function(page_key, type, key) {
  var block_key = key;
  var region_key = Drupal.Nucleus.regionsBlocksList['blocks'][block_key];
  region_key = region_key.replace(/-/gi, '_');
  var page_prefix = (page_key == 'default' || $page_key == '') ? "" : (page_key + "_");
  var region_selector = page_prefix + "region_" + region_key + "_style_selector";
  var region_style = $('select[name="' + region_selector + '"]').val();
  return region_style;
}

Drupal.Nucleus.hidePopup = function(end_setting) {
  if (end_setting) {
    $('#' + Drupal.Nucleus.currentRegionBlockButtonId).removeClass('active');
  }
  if (Drupal.Nucleus.currentRegionBlockButtonId) {
    Drupal.Nucleus.currentRegionBlockButtonId = false;
  }
  if (Drupal.Nucleus.currentRegionBlockPopupId) {
    $('#' + Drupal.Nucleus.currentRegionBlockPopupId).hide();
    Drupal.Nucleus.currentRegionBlockPopupId = false;
  }
}

Drupal.Nucleus.eventStopPropagation = function(event) {
  if (event.stopPropagation) {
    event.stopPropagation();
  }
  else if (window.event) {
    window.event.cancelBubble = true;
  }
}

Drupal.Nucleus.onChangeRegionWidth = function(page_key, region) {
}

Drupal.Nucleus.currentPagePrefix = function() {
  return "";
}

Drupal.Nucleus.getClosestRelative = function(popup) {
  var parent = popup;
  while (parent && parent.css('position') != 'relative') {
    parent = parent.parent();
  }
  if(parent) {
    return {'top': parent.offset().top, 'left': parent.offset().left};
  }
  else {
    return {'top': 0, 'left': 0};
  }
}

})(jQuery);
