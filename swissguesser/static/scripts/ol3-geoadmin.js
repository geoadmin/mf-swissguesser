// Not necessary with ol.js or ga.js
/*
goog.require('ga.Map');
goog.require('ga.layer');
goog.require('ol.View');
*/

// Create a GeoAdmin Map
var map, geoadmin = {};

geoadmin.init = function() {
  map = new ga.Map({
    // Define the div where the map is placed
    target: 'map',
    // Create a 2D view
    view: new ol.View({
      // Define the default resolution
      // 10 means that one pixel is 10m width and height
      // List of resolution of the WMTS layers:
      // 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1, 0.5, 0.25, 0.1
      resolution: geoadmin.isLayoutHorizontal('#map') ? 500 : 650,
      // Define a coordinate CH1903 for the center of the view
      center: [660000, 190000]
    })
  });
  // Add GeoAdmin layers
  var lyr = ga.layer.create('ch.swisstopo.pixelkarte-farbe');
  map.addLayer(lyr);
};

geoadmin.reset = function() {
  map.getView().setResolution(
    geoadmin.isLayoutHorizontal('#map') ? 500 : 650);
  map.getView().setCenter([660000, 190000]);
  map.getView().setRotation(0);
};

geoadmin.isLayoutHorizontal = function(obj) {
  var o = $(obj);
  if (o.length < 1) return false;
  return (o.width()/o.height()) < 1.0;
};

geoadmin.getDistanceEuclidian = function(A, B) {
  return Math.sqrt(
        Math.pow(Math.abs(A[0] - B[0]), 2) +
        Math.pow(Math.abs(A[1] - B[1]), 2));
};

geoadmin.getDistanceGeometric = function(A, B) {
  var proj = map.getView().getProjection();
  var merc = ol.proj.get('EPSG:900913'); // Mercator
  var pA = new ol.geom.Point(A); //.transform(proj, merc);
  var pB = new ol.geom.Point(B); //.transform(proj, merc);
  return pA.distanceTo(pB); // TODO: Unsuppoted in OpenLayers3
};