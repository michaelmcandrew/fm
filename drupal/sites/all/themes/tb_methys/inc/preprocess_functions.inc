<?php
/**
 * @file
 * Override of preprocess functions.
 */

/**
 * Override or insert variables into the node template.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 */
function tb_methys_preprocess_node(&$vars) {
  $vars['created_day'] = date('d', $vars['created']);
  $vars['created_month'] = date('M', $vars['created']);
  $vars['page'] = ($vars['type'] == 'page') ? true : false; 
}
/**
 * Override or insert variables into the block template.
 */
function tb_methys_preprocess_block(&$vars) {
  $block = $vars['block'];
  $subject = $block->subject;
  $parts = explode(" ", $subject);
  $vars['methys_subject'] = "";
  if (count($parts) > 1) {
    $pre_subject = $parts[0];
    unset($parts[0]);
    $subject = implode(" ", $parts);
    $vars['methys_subject'] = "<span class='first-word'>" . $pre_subject . "</span> " . $subject;
  }
}

/**
 * Override or insert variables into the page template.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 */
function tb_methys_preprocess_page(&$vars) {
  if (isset($vars['node'])) {
    if($vars['node']->type != 'page')
    {
      $result = db_select('node_type', NULL, array('fetch' => PDO::FETCH_ASSOC))
        ->fields('node_type', array('name'))
        ->condition('type', $vars['node']->type)
        ->execute()->fetchField();
      $vars['title'] = $result;
    }
  }
}

/**
 * Preprocess theme function to print a single record from a row, with fields
 */
function tb_methys_preprocess_views_view_fields(&$vars) {
  if (isset($vars['view']->style_plugin->definition['module']) && $vars['view']->style_plugin->definition['module'] == 'views_slideshow') {
    $fields = $vars['fields'];
    if(count($fields) >= 3) {
      $fields_key = array_keys($fields);
      $fields[$fields_key[1]]->wrapper_prefix = '<div class="slideshow-group-fields-wrapper">' . $fields[$fields_key[1]]->wrapper_prefix; 
      $fields[$fields_key[count($fields_key) - 1]]->wrapper_suffix = $fields[$fields_key[count($fields_key) - 1]]->wrapper_suffix . '</div>'; 
    }
  }
}

/**
 * Override or insert variables into the html template.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 */
function tb_methys_preprocess_html(&$vars) {
  $comment_class = "page-comment-reply-node";
  foreach ($vars['classes_array'] as $key => $value) {
    if($value == 'page-comment-reply-') {
      $vars['classes_array'][$key] = $comment_class;
      $comment_class = "page-comment-reply-comment";
    }
  }
}
