/*
$.getJSON(getTopicUrl('ech', 'en'),
    function(response) {
      layers = response.layers;
      layer = map.addLayer(getOlLayerById('ch.swisstopo.pixelkarte-farbe'));
    });
*/

/*
var swissProjection = new ol.Projection({
	code: 'EPSG:21781',
	units: ol.ProjectionUnits.METERS,
	// Validity extent from http://spatialreference.org
	extent: new ol.Extent(485869.5728, 76443.1884, 837076.5648, 299941.7864)
});
ol.proj.addProjection(swissProjection);
*/

/**
 * Returns a standard pixel karte without querying REST service
 */
var getDefaultLayer = function() {
  
	// Configure the standard base layer
  var layerData = {
  	"id":"ch.swisstopo.pixelkarte-farbe",
  	"attribution":"&copy; Data: swisstopo", "timedim":"20130213",
  	"tilegrid":{"c":["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16",
		"17","18","19","20","21","22","23","24","25","26"],"minZoom":0,"a":[4000,3750,3500,3250,3000,
		2750,2500,2250,2000,1750,1500,1250,1000,750,650,500,250,100,50,20,10,5,2.5,2,1.5,1,0.5],
		"maxZoom":26,"d":[420000,350000],"f":null,"b":null,"e":[256,256]},
		"url":"http://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/{Time}/21781/"+
		"{TileMatrix}/{TileRow}/{TileCol}.jpeg"};

	// Setup a tile grid
	var createTileGrid = function(resolutions) {
		var resolutions = 
			[650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.0, 0.5, 0.25, 0.1];
	  var origin = [420000, 350000];
	  var matrixIds = $.map(resolutions, function(r, i) { return i + ''; });
	  return new ol.tilegrid.WMTS({
		    matrixIds: matrixIds,
		    origin: origin,
		    resolutions: resolutions
		  });
	}

	// Return an OpenLayers object
  return new ol.layer.TileLayer({
        id: layerData.id,
        source: new ol.source.WMTS({
          attributions: [
            new ol.Attribution(layerData.attribution)
          ],
          dimensions: {
            'Time': layerData.timedim
          },
          projection: 'EPSG:21781',
          requestEncoding: 'REST',
          tileGrid: createTileGrid(),
          url: layerData.url,
          extent: [420000, 900000, 30000, 350000]
        })
      });
};

/**
 * Create a new OpenLayers 3 map
 */
var map = new ol.Map({
  controls: ol.control.defaults({
    attribution: false
  }),
  renderer: ol.RendererHint.CANVAS,
  target: 'map',
  view: new ol.View2D({
    projection: ol.proj.configureProj4jsProjection({
		  code: 'EPSG:21781',
		  extent: [485869.5728, 837076.5648, 76443.1884, 299941.7864]
		}),
    center: ol.extent.getCenter([420000, 900000, 30000, 350000]),
    resolution: 500.0//,
    //resolutions: resolutions
  })
});

// Add map UI controls
map.addControl(new ol.control.ZoomToExtent());
map.addControl(new ol.control.ZoomSlider());

// Add required layers
map.addLayer(getDefaultLayer());