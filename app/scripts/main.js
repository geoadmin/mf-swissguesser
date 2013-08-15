if (false) {

var swissExtent = [420000, 900000, 30000, 350000];
var swissProjection = ol.proj.configureProj4jsProjection({
  code: 'EPSG:21781',
  extent: swissExtent
});

var resolutions = [650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5,
  2.0, 1.0, 0.5, 0.25, 0.1];

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

var createTileGrid = function(resolutions) {
  var origin = [420000, 350000];
  var matrixIds = $.map(resolutions, function(r, i) { return i + ''; });
  return new ol.tilegrid.WMTS({
    matrixIds: matrixIds,
    origin: origin,
    resolutions: resolutions
  });
}

var defaultTileGrid = createTileGrid(
  [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250,
  1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5]);

var getTileGrid = function(resolutions) {
  return resolutions ? createTileGrid(resolutions) : defaultTileGrid;
}

var wmtsGetTileUrl = 'http://wmts.geo.admin.ch/1.0.0/{Layer}/default/' +
  '{Time}/21781/{TileMatrix}/{TileRow}/{TileCol}.{Format}';

var getTopicUrl = function(topicId, lang) {
	return 'http://mf-chsdi30t.bgdi.admin.ch/rest/services/' +
	       topicId + '/MapServer/layersconfig?lang=' +
	       lang;
	};

var layer, layers = [];
var loadForTopic = function(topicId, lang) {
  $.getJSON(getTopicUrl(topicId, lang),
	  function(response) {
	    layers = response.layers;

			map.addLayer(getOlLayerById('ch.swisstopo.pixelkarte-farbe'));
  	});
};

/**
 * Return an ol.layer.Layer object for a layer id.
 */
var getOlLayerById = function(id) {
  var layer = layers[id];
  var olLayer = layer.olLayer;
  var attribution = '&copy; Data: ' + layer.attribution;
  if (typeof olLayer == 'undefined') {
    if (layer.type == 'wmts') {
      var wmtsUrl = wmtsGetTileUrl.replace('{Layer}', id).
                    replace('{Format}', layer.format);

      olLayer = new ol.layer.TileLayer({
        id: id,
        source: new ol.source.WMTS({
          attributions: [
            new ol.Attribution(attribution)
          ],
          dimensions: {
            'Time': layer.timestamps[0]
          },
          projection: 'EPSG:21781',
          requestEncoding: 'REST',
          tileGrid: getTileGrid(layer.resolutions),
          url: wmtsUrl
        })
      });
      layer.olLayer = olLayer;
    }
  }
  return olLayer;
};

loadForTopic('ech', 'en');

}