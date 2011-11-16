<?php
$_SERVER['HTTP_HOST'] = 'example.org';
$_SERVER['REMOTE_ADDR'] = '127.0.0.1';

define('DRUPAL_ROOT', dirname(realpath(__FILE__)));

include_once 'includes/bootstrap.inc';
drupal_bootstrap(DRUPAL_BOOTSTRAP_DATABASE);
print(db_query('select users_roles.uid,name from users inner join users_roles on users.uid=users_roles.uid where rid=1;'));