<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title><%= htmlWebpackPlugin.options.title %></title>
  <%= htmlWebpackPlugin.options.css %>
</head>
<body>
<div id="app"></div>
<!-- built files will be auto injected -->
<%= htmlWebpackPlugin.options.script %>
</body>
</html>
