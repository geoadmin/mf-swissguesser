var swissExtent = [420000, 900000, 30000, 350000];
  // [485869.5728, 837076.5648, 76443.1884, 299941.7864]

var swissProjection = ol.proj.configureProj4jsProjection({
  code: 'EPSG:21781', extent: swissExtent
});

var layers = [
  new ol.layer.TileLayer({
    source: new ol.source.TiledWMS({
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

var map = new ol.Map({
  controls: ol.control.defaults({}, [
    new ol.control.ScaleLine({
      units: ol.control.ScaleLineUnits.METRIC
    })
  ]),
  layers: layers,
  renderers: ol.RendererHints.createFromQueryData(),
  target: 'map',
  view: new ol.View2D({
    projection: swissProjection,
    center: [660000, 190000],
    resolutions: [650.0, 500.0, 250.0, 100.0],
    zoom: 2
  }),
  restrictedExtent: swissExtent
});