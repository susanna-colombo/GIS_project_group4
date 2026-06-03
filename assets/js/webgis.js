//  GIS course - project (A.Y. 2025-2026)
//  Group 04
//  Web GIS page


// import all necessary modules
import 'ol/ol.css';
import '../../assets/css/custom.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import { Map, View, Overlay } from 'ol';
import { Tile, Image, Group, Vector } from 'ol/layer';
import { OSM, ImageWMS, XYZ, StadiaMaps } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { GeoJSON } from 'ol/format';
import { fromLonLat } from 'ol/proj';
import { ScaleLine, FullScreen, MousePosition, } from 'ol/control';
import LayerSwitcher from 'ol-layerswitcher';
import { createStringXY } from 'ol/coordinate';
import { Style, Fill, Stroke } from 'ol/style';

// layer switcher extension
import 'ol-ext/dist/ol-ext.css';
import LayerSwitcher2 from 'ol-ext/control/LayerSwitcher';


// OpenStreetMap base map
let osm = new Tile({
    title: "Open Street Map",
    type: "base", /* allows only single selection (one basemap at a time)*/
    visible: true,
    source: new OSM()
});


// Croatia NO2 AMAC map 2021-2023
let Croatia_no2_AMAC_2021_2023 = new Image({
	// type: 
    title: "NO2 AMAC map",
    /* type not specified allows for multiple selection*/
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gisgeoserver_04:Croatia_no2_2021_2023_AMAC_map' }
    }),
    visible: true
});

// Croatia PM10 AMAC map 2021-2023
let Croatia_pm10_AMAC_2021_2023 = new Image({
    title: "PM10 AMAC map",
    /* type not specified allows for multiple selection*/
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gisgeoserver_04:Croatia_pm10_2021_2023_AMAC_map' }
    }),
    visible: false
});

// Croatia PM2.5 AMAC map 2021-2023
let Croatia_pm2p5_AMAC_2021_2023 = new Image({
    title: "PM2.5 AMAC map",
    /* type not specified allows for multiple selection*/
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gisgeoserver_04:Croatia_pm2p5_2021_2023_AMAC_map' }
    }),
    visible: false
});


// Croatia Bivariate maps

// define style
function bivariateStyle(feature) {
  const val = feature.get('bivariate');

  const colors = {
    '11': '#fffffe',
    '12': '#ffe8ee',
    '13': '#ffcbd7',
    '14': '#ffaec0',
    '15': '#ff88a6',

    '21': '#ddfffd',
    '22': '#cde6e5',
    '23': '#c3c6cb',
    '24': '#bba8b4',
    '25': '#b08ea6',

    '31': '#b9fffc',
    '32': '#a4dfdd',
    '33': '#95b6c3',
    '34': '#8a9cad',
    '35': '#7d8ba1',

    '41': '#7cfdfd',
    '42': '#64dbdc',
    '43': '#54b5bd',
    '44': '#4591a0',
    '45': '#397e8d',

    '51': '#50fffd',
    '52': '#44d6d4',
    '53': '#3c9fad',
    '54': '#32788f',
    '55': '#2a6682'
  };

  const color = colors[val] || '#cccccc';

  return new Style({
    fill: new Fill({
      color: color
    }),
    stroke: new Stroke({
      color: '#232323',
      width: 1
    })
  });
}

// Croatia NO2 Bivariate map
// define URL
var no2URL = "https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_04/wfs?" + 
"service=WFS&" + 
"version=2.0.0&" +
"request=GetFeature&" + 
"typeName=gisgeoserver_04:Croatia_no2_2023_bivariate&" + 
"srsname=EPSG:3857&" + 
"outputFormat=application/json";

// define source
let no2Source = new VectorSource({});

// define vector layer
let Croatia_no2_2023_bivariate = new Vector({
    title: "Croatia NO2 bivariate map",
    source: no2Source,
    visible: false,
    style: bivariateStyle
    });


// call the WFS service
fetch(no2URL)
.then((response) => {
    if (!response.ok) {
        throw new Error('Error ' + response.statusText);
        }
    response.json().then(data => {
        no2Source.addFeatures(
	    new GeoJSON().readFeatures(data)
	    )
    })
});

// Croatia PM2.5 Bivariate map
// define URL
var pm2p5URL = "https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_04/wfs?" + 
"service=WFS&" + 
"version=2.0.0&" +
"request=GetFeature&" + 
"typeName=gisgeoserver_04:Croatia_pm2p5_2023_bivariate&" + 
"srsname=EPSG:3857&" + 
"outputFormat=application/json";

// define source
let pm2p5Source = new VectorSource({});

// define vector layer
let Croatia_pm2p5_2023_bivariate = new Vector({
    title: "Croatia PM2.5 bivariate map",
    source: pm2p5Source,
    visible: false,
    style: bivariateStyle
    });


// call the WFS service
fetch(pm2p5URL)
.then((response) => {
    if (!response.ok) {
        throw new Error('Error ' + response.statusText);
        }
    response.json().then(data => {
        pm2p5Source.addFeatures(
	    new GeoJSON().readFeatures(data)
	    )
    })
});

// Croatia PM10 Bivariate map
// define URL
var pm10URL = "https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_04/wfs?" + 
"service=WFS&" + 
"version=2.0.0&" +
"request=GetFeature&" + 
"typeName=gisgeoserver_04:Croatia_pm10_2023_bivariate&" + 
"srsname=EPSG:3857&" + 
"outputFormat=application/json";

// define source
let pm10Source = new VectorSource({});

// define vector layer
let Croatia_pm10_2023_bivariate = new Vector({
    title: "Croatia PM10 bivariate map",
    source: pm10Source,
    visible: false,
    style: bivariateStyle
    });


// call the WFS service
fetch(pm10URL)
.then((response) => {
    if (!response.ok) {
        throw new Error('Error ' + response.statusText);
        }
    response.json().then(data => {
        pm10Source.addFeatures(
	    new GeoJSON().readFeatures(data)
	    )
    })
});


// Add the layer groups code here:
let basemapLayers = new Group({
	title: "Base Maps",
	layers:  [osm]
});

let amacLayers = new Group({
	title: 'AMAC Layers',
	layers: [
		Croatia_pm10_AMAC_2021_2023,
		Croatia_pm2p5_AMAC_2021_2023,
		Croatia_no2_AMAC_2021_2023	
	]
});

let bivariateLayers = new Group({
	title: 'Bivariate Maps',
	layers: [
		Croatia_pm10_2023_bivariate,
		Croatia_pm2p5_2023_bivariate,
		Croatia_no2_2023_bivariate	
	]
});

// Map Initialization
let mapOrigin = fromLonLat([15.9819, 44.5]);
let zoomLevel = 7;
let map = new Map({
    target: document.getElementById('map'),
    layers: [],
    view: new View({
        center: mapOrigin,
        zoom: zoomLevel
    }),
    projection: 'EPSG:3857' // bc openlayers uses this crs
});

// Add the map controls here:
map.addControl(new ScaleLine());
map.addControl(new FullScreen());
map.addControl(
	new MousePosition({
		coordinateFormat: createStringXY(4),
		projection: 'EPSG:4326',
		className: 'custom-control', // we assign this class name so that we can apply a style to it
		placeholder: '0.0000, 0.0000'
	}))

// Add the LayerSwitcher control here:
// var layerSwitcher = new LayerSwitcher({
    
//     // activationMode: 'mouseover',
//     // groupSelectStyle: 'children',
//     reverse: true

// });
var layerSwitcher = new LayerSwitcher2({
    collapsed: false,
    show_progress: true,
    extent: true,
    opacity: true
});

map.addControl(layerSwitcher);

// Additional basemaps
var esriWorldStreetMap = new Tile({
	title: 'ESRI World Street Map',
	type: 'base',
	visible: false,
	source: new XYZ({
		attributions:
			'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
			'rest/services/World_Street_Map/MapServer">ArcGIS</a>',
		url:
			'https://server.arcgisonline.com/ArcGIS/rest/services/' +
			'World_Street_Map/MapServer/tile/{z}/{y}/{x}',
	})
});

var esriWorldTerrain = new Tile({
	title: 'ESRI World Terrain',
	type: 'base',
	visible: false,
	source: new XYZ({
		attributions:
			'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
			'rest/services/World_Terrain_Base/MapServer">ArcGIS</a>',
		url:
			'https://server.arcgisonline.com/ArcGIS/rest/services/' +
			'World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
	})
});

basemapLayers.getLayers().extend([esriWorldStreetMap,esriWorldTerrain]);

// Add the popup code here:
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
var popup = new Overlay({
	element: container
}); 

map.addOverlay(popup);

closer.onclick = function () {
	popup.setPosition(undefined);
	closer.blur(); 
	return false;
};

// Add the singleclick event code here
map.on('singleclick', function (event) {
	var feature = map.forEachFeatureAtPixel(
		event.pixel, 
		function (feature, layer) {
			if(layer && bivariateLayers.getLayers().getArray().includes(layer)){
				return feature;
			}
		}
	);

	if (feature != null) {
		var pixel = event.pixel;
		var coord = map.getCoordinateFromPixel(pixel);
		popup.setPosition(coord);

		content.innerHTML =
        '<h4>'+feature.get('gaul2_name')+'</h4>' +
        '<p><strong>Population class median:</strong> ' + feature.get('pop_class_median') + '</p>' +
        '<p><strong>Pollution class maximum:</strong> ' + feature.get('pol_class_max') + '</p>';
            }
});

// add pointermove event
map.on('pointermove', function(event) {
	var pixel = map.getEventPixel(event.originalEvent);
	var hit = map.hasFeatureAtPixel(pixel);
	map.getTarget().style.cursor = hit ? 'pointer' : '';
});



// add legend

let allLayers = [
    ...amacLayers.getLayers().getArray(),
    ...bivariateLayers.getLayers().getArray()
];

async function updateLegend() {
    var legendHTMLString = '<ul>';
    
    function getLegendElement(title, color){
        return '<li>' + 
            '<span class="legend-color" style="background-color: ' + color + ' ">' + 
            '</span><span>' + 
            title +
            '</span></li>';
    }
    
    var legendContent = document.getElementById('legend-content');
    legendContent.innerHTML = ''

    for(let layer of allLayers){

        // skip non-visible layers
        if (!layer.getVisible()) continue;

        // ✅ CASO SPECIALE: layer bivariati (immagine legenda)
        if (bivariateLayers.getLayers().getArray().includes(layer)) {
            var layerTitle = layer.get('title');

            legendHTMLString +=
                '<li>' +
                    '<strong>' + layerTitle + '</strong><br>' +
                    '<img src="../images/legend_bivariate_5x5.png" class="legend-img">' +
                '</li>';

            continue; // ✅ IMPORTANTISSIMO → evita di entrare negli altri casi
        }

        if(layer.getSource() instanceof ImageWMS){
            var legendURLParams = {format: "application/json"};
            var legendUrl = layer.getSource().getLegendUrl(0, legendURLParams);
            await fetch(legendUrl).then(async (response) => {
                await response.json().then((data) => {
                    var layerTitle = layer.get('title');
                    var layerSymbolizer = data["Legend"][0]["rules"][0]["symbolizers"][0];

                    if("Polygon" in layerSymbolizer){
                        var layerColor = layerSymbolizer["Polygon"]["fill"];
                        if(layerColor != null){
                            legendHTMLString += getLegendElement(layerTitle, layerColor);
                        }
                    } else if("Line" in layerSymbolizer){
                        var layerColor = layerSymbolizer["Line"]["stroke"];
                        if(layerColor != null){
                            legendHTMLString += getLegendElement(layerTitle, layerColor);
                        }
                    } else if("Raster" in layerSymbolizer){
                        legendHTMLString += '<li><strong>' + layerTitle + '</strong></li>';
                        var entries = layerSymbolizer["Raster"]["colormap"]["entries"];
                        for(let entry of entries){
                            legendHTMLString += getLegendElement(entry["label"], entry["color"]);
                        }
                    }
                });
            });

        } else {
            var layerStyle = layer.getStyle();
            var layerColor = layerStyle.getFill().getColor();
            var layerTitle = layer.get('title');
            legendHTMLString += getLegendElement(layerTitle, layerColor);
        }
    }

    var legendContent = document.getElementById('legend-content');
    legendHTMLString += "</ul>";
    legendContent.innerHTML = legendHTMLString;
}

// first call
updateLegend();

// update legend each time the visibility of a layer changes
for(let amacLayer of amacLayers.getLayers().getArray()){
    amacLayer.on('change:visible', updateLegend);
}
for(let bivariateLayer of bivariateLayers.getLayers().getArray()){
    bivariateLayer.on('change:visible', updateLegend);
}

// single selection for layer groups
function enableSingleLayerSelection(layerGroup) {
  const layers = layerGroup.getLayers().getArray();

  layers.forEach(layer => {
    layer.on('change:visible', function () {
      if (layer.getVisible()) {
        layers.forEach(otherLayer => {
          if (otherLayer !== layer) {
            otherLayer.setVisible(false);
          }
        });
      }
    });
  });
}

enableSingleLayerSelection(amacLayers);
enableSingleLayerSelection(bivariateLayers);
enableSingleLayerSelection(basemapLayers);

// Add the layer groups to the map here, at the end of the script!
map.addLayer(basemapLayers);
map.addLayer(amacLayers);
map.addLayer(bivariateLayers);
