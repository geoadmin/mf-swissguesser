var map = new ol.Map({
  controls: ol.control.defaults({
    attribution: false
  }),
  renderer: ol.RendererHint.CANVAS,
  target: 'map',
  view: new ol.View2D({
    projection: swissProjection,
    center: ol.extent.getCenter(swissExtent),
    resolution: 500.0,
    resolutions: resolutions
  })
});
map.addControl(new ol.control.ZoomToExtent());
map.addControl(new ol.control.ZoomSlider());

loadForTopic('ech', 'en');