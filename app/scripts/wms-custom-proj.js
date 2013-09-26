// # GeoAdmin.ch for OpenLayers 3
// https://github.com/geoadmin/web-storymaps
var map;
function initGeoAdmin() {

  // Swiss map extents
  var swissExtent = [420000, 900000, 30000, 350000];
    /// [485869.5728, 837076.5648, 76443.1884, 299941.7864]

  // Swiss geographic projection
  var swissProjection = ol.proj.configureProj4jsProjection({
    code: 'EPSG:21781', extent: swissExtent
  });

  var layers = [
    // Load pixel base map from GeoAdmin WMS server 
    new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: 'http://wms.geo.admin.ch/',
        crossOrigin: 'anonymous',
        attributions: [new ol.Attribution(
            '&copy; ' +
            '<a href="http://www.geo.admin.ch/internet/geoportal/en/home.html">' +
            'Pixelmap 1:1000000 / geo.admin.ch</a>')],
        params: {
          'LAYERS': 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
          'FORMAT': 'image/jpeg'
        },
        extent: swissExtent
      })
    })/*,
    // Add an additional GeoAdmin tile layer (optional)
    new ol.layer.TileLayer({
      source: new ol.source.TiledWMS({
        url: 'http://wms.geo.admin.ch/',
        crossOrigin: 'anonymous',
        attributions: [new ol.Attribution(
            '&copy; ' +
            '<a href="http://www.geo.admin.ch/internet/geoportal/en/home.html">' +
            'National parks / geo.admin.ch</a>')],
        params: {'LAYERS': 'ch.bafu.schutzgebiete-paerke_nationaler_bedeutung'},
        extent: swissExtent
      })
    })*/
  ];

  // Initialise map
  map = new ol.Map({
    controls: ol.control.defaults({}, [
      new ol.control.ScaleLine({
        units: ol.control.ScaleLineUnits.METRIC
      })
    ]),
    layers: layers,
    //renderers: ol.RendererHints.createFromQueryData(),
    renderer: ol.RendererHint.CANVAS,
    target: 'map',
    view: new ol.View2D({
      projection: swissProjection,
      center: [660000, 190000],
      resolutions: [650.0, 500.0, 250.0, 100.0],
      zoom: 2
    }),
    restrictedExtent: swissExtent
  });

}
