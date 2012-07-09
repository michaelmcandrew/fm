<?php
/**
 * @file
 */
?>
<div id="region_popup_<?php print $page_prefix . $region_key;?>" class="tb-popup-wrap">
  <div class="tb-popup">
    <?php print $region_settings_form;?>
    <div class="tb-popup-actions clearfix">
      <a href="javascript:void(0);" id="<?php print "";?>-save" class="tb-form-btn save-btn" onclick="Drupal.Nucleus.savePopupDialog(event, '<?php print $page_key; ?>', '<?php print 'region'; ?>', '<?php print $region_key; ?>')"/><?php print t('OK');?></a>
      <a href="javascript:void(0);" id="<?php print "";?>-close" class="tb-form-btn close-btn" onclick="Drupal.Nucleus.cancelPopupDialog(event, '<?php print $page_key; ?>', '<?php print 'region'; ?>', '<?php print $region_key; ?>')"/><?php print t('Cancel');?></a>
    </div>
  </div>
</div>