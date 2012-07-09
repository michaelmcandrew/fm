<?php

/**
 * @file nucleus-extend-class.tpl.php
 * Default theme implementation to display a extend class popup.
 * This is only a feature in backend.
 *
 * @see nucleus_create_popup_extend_classes()
 */
?>
<div class="form-item tb-extend-class" id="<?php print $name?>-tb-extend-class"<?php print $show_extend_class_popup ? "" : ' style="display: none;"';?>>
  <label><?php print("Select Classes:")?></label>
  <div id="<?php print $name;?>-groups" class="tb-popup-ct tb-extend-class-groups clearfix">
    <?php print $nucleus_extend_class_form_groups;?>
  </div>
</div>
