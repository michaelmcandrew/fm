jQuery.widget("ui.nucleus_sortable", jQuery.extend({}, jQuery.ui.sortable.prototype, {

  _init: function(){
    this.element.data('sortable', this.element.data('nucleus_sortable'));
    return jQuery.ui.sortable.prototype._init.apply(this, arguments);
  },

  // Override _getParentOffset to fix bug lost position in overlay
  _getParentOffset: function() {
    //Get the offsetParent and cache its position
    this.offsetParent = this.helper.offsetParent();
    var po = this.offsetParent.offset();

    // This is a special case where we need to modify a offset calculated on start, since the following happened:
    // 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
    // 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
    //    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
    if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && this.scrollParent[0].tagName.toLowerCase() != 'html' && jQuery.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
      po.left += this.scrollParent.scrollLeft();
      po.top += this.scrollParent.scrollTop();
    }

    if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
    || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && jQuery.browser.msie)) //Ugly IE fix
      po = { top: 0, left: 0 };

    return {
      top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
      left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
    };
  }
}));

jQuery.ui.nucleus_sortable.defaults = jQuery.extend({}, jQuery.ui.sortable.defaults);

(function ($) {
if (Drupal.Nucleus == undefined) {
  Drupal.Nucleus = {};
}

Drupal.behaviors.nucleusLayoutAction = {
  attach: function (context) {
    $( ".dragable-blocks-list" ).nucleus_sortable({
      connectWith: ".dragable-blocks-list",
      distance: 10,
      start: function(event, ui) {
    	var item = $(ui.item);
        var block_wrapper_id = item.attr('id');
        var block_key = block_wrapper_id.substr(22);
        $("#block_popup_" + block_key).hide();        
      },
      update: function(event, ui) {
        var target = $(event.target);
        var item = $(ui.item);
        var counter = 0;
        target.children().each(function() {
          var child_id = $(this).attr('id');
          var weight_id = child_id.replace("block_preview_wrapper", "block_weight_hidden");
          $('input[name="' + weight_id + '"]').val(counter);
          counter ++;
        });
      },
      receive: function(event, ui) {
        var target = $(event.target);
        var item = $(ui.item);

        var page_prefix = Drupal.Nucleus.currentPagePrefix();

        var block_wrapper_id = item.attr('id');
        var block_key = block_wrapper_id.substr(22);
        var hidden_name = page_prefix + "region_block_hidden_" + block_key;
        var current_region_key = $('input[name="' + hidden_name + '"]').val();

        var target_region_id = target.attr('id');
        var new_region_key = target_region_id.substr(17);

        Drupal.Nucleus.moveBlockAction(page_prefix, block_key, hidden_name, current_region_key, new_region_key);
        $('select[name="' + page_prefix + 'block_' + block_key + '_style_region_selector"]').val(new_region_key);
      }
    });
  }
};

Drupal.Nucleus.onChangeRegion = function(page_key, block_key) {
  var hidden_name = page_prefix + "region_block_hidden_" + block_key;
  var current_region_key = $('input[name="' + hidden_name + '"]').val();
  var current_region_name = current_region_key.replace(/_/gi, '-');

  var new_region_key = $('select[name="' + page_prefix + 'block_' + block_key + '_style_region_selector"]').val();
  var new_region_name = new_region_key.replace(/_/gi, '-');

  var new_blocks_container = $('#draggable_region_' + new_region_key);
  var current_blocks_container = $('#draggable_region_' + current_region_key);
  var block_preview_wrapper = $('#block_preview_wrapper_' + block_key);
  block_preview_wrapper.appendTo('#draggable_region_' + new_region_key);
  if($('#draggable_region_' + new_region_key).length > 0) {
    Drupal.Nucleus.smoothScroll('#draggable_region_' + new_region_key, 50, -50);
    Drupal.Nucleus.moveBlockAction(page_key, block_key, hidden_name, current_region_key, new_region_key);
    if(Drupal.Nucleus.currentRegionBlockPopupId) {
      $('#' + Drupal.Nucleus.currentRegionBlockPopupId).hide();
      Drupal.Nucleus.currentRegionBlockPopupId = false;
      Drupal.Nucleus.currentRegionBlockButtonId = false;
    }
    Drupal.Nucleus.showPopup(popup_id, button_id);
  }
}

Drupal.Nucleus.moveBlockAction = function(page_key, block_key, hidden_name, current_region_key, new_region_key) {
  var page_prefix = (page_key == 'default' || page_key == '') ? "" : (page_key + "_");
  var current_region_name = current_region_key.replace(/_/gi, '-');
  var new_region_name = new_region_key.replace(/_/gi, '-');
  $('input[name="' + hidden_name + '"]').val(new_region_key);
  var style_name = page_prefix + "region_" + new_region_key + "_style";
  var region_style = $('input[name="' + style_name + '"]').val();
  region_style = (region_style == '') ? 'default' : region_style;

  Drupal.Nucleus.regionsBlocksList['blocks'][block_key] = new_region_name;
  Drupal.Nucleus.regionsBlocksList['regions'][current_region_name][block_key] = 0;
  Drupal.Nucleus.regionsBlocksList['regions'][new_region_name][block_key] = 1;
  Drupal.Nucleus.showHideRegionExtendClass(Drupal.Nucleus.regionsBlocksList['regions'][new_region_name], page_key, new_region_name, region_style);
}

Drupal.Nucleus.getCurrentYPos = function() {
  if (self.pageYOffset) {
    return self.pageYOffset;
  }
  if (document.documentElement && document.documentElement.scrollTop) {
    return document.documentElement.scrollTop;
  }
  if (document.body.scrollTop) {
    return document.body.scrollTop;
  }
  return 0;
}

Drupal.Nucleus.getElementYPos = function(eID) {
  return $(eID).offset().top;
}

Drupal.Nucleus.smoothScroll = function(eID, duration, delta) {
  if (!duration) {
    duration = 500;
  }
  if (!delta) {
    delta = 0;
  }
  var startY = Drupal.Nucleus.getCurrentYPos();
  var stopY = Drupal.Nucleus.getElementYPos(eID) + delta;
  var distance = stopY - startY;
  var speed = Math.round(duration / 33);
  var step  = Math.round(distance / speed);
  if (!step) {
    scrollTo(0, stopY); return;
  }
  var leapY = startY;
  var timer = 0;
  while (leapY != stopY) {
    leapY += step;
    if ((stopY > startY && leapY > stopY) || (stopY < startY && leapY < stopY)) {
      leapY = stopY;
    }
    setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
    timer++;
  }
  return;
}
})(jQuery);
