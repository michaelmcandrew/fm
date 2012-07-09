<?php
/**
 * @file
 */
?>
<div id="block_popup_<?php print $page_prefix . $block_key;?>" class="tb-popup-wrap">
  <div class="tb-popup">
    <div class="goto-block">
      <a href="<?php print base_path();?>admin/structure/block/manage/<?php print $block->module;?>/<?php print $block->delta;?>/config"><?php print("Go to Block Configure");?></a>
    </div>
    <?php print $block_settings_form;?>
    <div class="tb-popup-actions clearfix">
      <a href="javascript:void(0);" id="<?php print "";?>-save" class="tb-form-btn save-btn" onclick="Drupal.Nucleus.savePopupDialog(event, '<?php print $page_key; ?>', '<?php print 'block'; ?>', '<?php print $block_key; ?>')"/><?php print t('OK');?></a>
      <a href="javascript:void(0);" id="<?php print "";?>-close" class="tb-form-btn close-btn" onclick="Drupal.Nucleus.cancelPopupDialog(event, '<?php print $page_key; ?>', '<?php print 'block'; ?>', '<?php print $block_key; ?>')"/><?php print t('Cancel');?></a>
    </div>
  </div>
</div>
