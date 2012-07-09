jQuery(window).load(function(){
	window.setTimeout(nucleus_set_equal_height, 100);
	var search_button = jQuery('#search-block-form .button input.form-submit');
	if(search_button) {
		search_button.val(" ");
	}	
}); 

function nucleus_set_equal_height() {
//	jQuery('key1, key2, key3, ...').equalHeightColumns();
	jQuery('#panel-bottom-wrapper .grid-inner').matchHeights();
	jQuery('.container-inner, #sidebar-second-wrapper').matchHeights();
	jQuery('#main-content, #sidebar-first-wrapper').matchHeights();
	jQuery('.mass-top .views-view-grid .grid-inner').matchHeights();
	var pager_next = jQuery('ul.pager > li.pager-next > a');
	var pager_last = jQuery('ul.pager > li.pager-last > a');
	var pager_previous = jQuery('ul.pager > li.pager-previous > a');
	var pager_first = jQuery('ul.pager > li.pager-first > a');
	if (pager_next) {
		pager_next.html('&nbsp;');
	}
		
	if (pager_last) {
		pager_last.html('&nbsp;');
	}
		
	if (pager_previous) {
		pager_previous.html('&nbsp;');
	}
		
	if (pager_first) {
		pager_first.html('&nbsp;');
	}
}