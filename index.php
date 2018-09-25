<?php include_once("index.html");
$app->get('/', function() use($app) {
  $app['monolog']->addDebug('logging output.');
  return str_repeat('Hello', getenv('TOKEN'));
});
?>
