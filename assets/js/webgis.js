//  GIS course - project (A.Y. 2025-2026)
//  Group 04
//  Authors: Susanna Colombo, Clara Wurtzer, Sara Bompieri
//  Web GIS page

// import all necessary modules
import { Map, View, Overlay } from 'ol';
import { Tile, Image, Group, Vector } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import { createStringXY } from 'ol/coordinate';
// sources
import { OSM, ImageWMS, XYZ, StadiaMaps } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { GeoJSON } from 'ol/format';
// map controls
import { ScaleLine, FullScreen, MousePosition, } from 'ol/control';
import 'ol-ext/dist/ol-ext.css';
import LayerSwitcher from 'ol-ext/control/LayerSwitcher';
// styles
import 'ol/ol.css';
import '../../assets/css/custom.css';
import { Style, Fill, Stroke, Circle} from 'ol/style';

// --------------------------------- BASE MAPS --------------------------------
// OpenStreetMap base map
let osm = new Tile({
    title: "Open Street Map",
    type: "base",
    visible: true,
    source: new OSM()
});
// Additional basemaps
// ESRI World Street Map
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
// ESRI World Terrain
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
// --------------------------------- AMAC MAPS --------------------------------
// Croatia NO2 AMAC map 2021-2023
let Croatia_no2_AMAC_2021_2023 = new Image({
    title: "NO2 AMAC map",
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


// --------------------------------- BIVARIATE MAPS --------------------------------
// define custom style
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
  })
};
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
    visible: true,
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

// Define layer groups
let basemapLayers = new Group({
	title: "Base Maps",
	layers:  [osm, esriWorldStreetMap, esriWorldTerrain],
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

// Map controls
// Scale line
map.addControl(new ScaleLine());

// Full screen
map.addControl(new FullScreen());

// Mouse position
map.addControl(
	new MousePosition({
		coordinateFormat: createStringXY(4),
		projection: 'EPSG:4326',
		className: 'custom-control', // we assign this class name so that we can apply a style to it
		placeholder: '0.0000, 0.0000'
	}))

// Layer switcher
var layerSwitcher = new LayerSwitcher({
    collapsed: false,
    show_progress: true,
    extent: true,
    opacity: true
});
map.addControl(layerSwitcher);

// Popups
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

// Singleclick event
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

// Pointermove event
map.on('pointermove', function(event) {
	var pixel = map.getEventPixel(event.originalEvent);
	var hit = map.hasFeatureAtPixel(pixel);
	map.getTarget().style.cursor = hit ? 'pointer' : '';
});

// Create and add legend
// array of the layers
let allLayers = [
    ...amacLayers.getLayers().getArray(),
    ...bivariateLayers.getLayers().getArray()
];

// function to generate legend for the different layer types/sources
let legendUpdateId = 0; // counter

async function updateLegend() {
    const currentId = ++legendUpdateId; // unique id for the legend call
    var legendHTMLString = '<ul>';

    // function that creates legend element
    function getLegendElement(title, color){
        return '<li>' + 
            '<span class="legend-color" style="background-color: ' + color + ' ">' + 
            '</span><span>' + 
            title +
            '</span></li>';
    }

    // iterate over the layers
    for(let layer of allLayers){

        // skip non-visible layers
        if (!layer.getVisible()) continue;

        // bivariate layers: image legend
        if (bivariateLayers.getLayers().getArray().includes(layer)) {

            // get layer title and build html string
            var layerTitle = layer.get('title');

            legendHTMLString +=
                '<li>' +
                    '<strong>' + layerTitle + '</strong><br>' +
                    '<img src="../images/legend_bivariate_5x5.png" class="legend-img">' +
                '</li>';

            continue;
        }

        // WMS layers: get legend from geoserver
        if(layer.getSource() instanceof ImageWMS){
            // generate url to get legend in json format
            var legendURLParams = {format: "application/json"};
            var legendUrl = layer.getSource().getLegendUrl(0, legendURLParams);
            
            // get the legend from Geoserver in json format
            await fetch(legendUrl).then(async (response) => {
                await response.json().then((data) => {
                    // extract title and symbols
                    var layerTitle = layer.get('title');
                    var layerSymbolizer = data["Legend"][0]["rules"][0]["symbolizers"][0];
                    console.log(data);
                    
                    // if the symbol is a polygon, get the fill color
                    if("Polygon" in layerSymbolizer){
                        var layerColor = layerSymbolizer["Polygon"]["fill"];
                        if(layerColor != null){
                            legendHTMLString += getLegendElement(layerTitle, layerColor);
                        }
                    // if the symbol is a line, get the stroke color
                    } else if("Line" in layerSymbolizer){
                        var layerColor = layerSymbolizer["Line"]["stroke"];
                        if(layerColor != null){
                            legendHTMLString += getLegendElement(layerTitle, layerColor);
                        }
                    // if the symbol is a raster (see console for structure)
                    } else if("Raster" in layerSymbolizer){
                        legendHTMLString += '<li><strong>' + layerTitle + '</strong></li>';
                        var entries = layerSymbolizer["Raster"]["colormap"]["entries"];
                        for(let entry of entries){
                            legendHTMLString += getLegendElement(entry["label"], entry["color"]);
                        }
                    }
                });
            // check if there has been a more recent call
            if (currentId !== legendUpdateId) return;
            });

        // other sources: build the legend manually
        } else {
            var layerStyle = layer.getStyle();
            var layerColor = layerStyle.getFill().getColor();
            var layerTitle = layer.get('title');
            legendHTMLString += getLegendElement(layerTitle, layerColor);
        }
    }
    // check again if this is the most recent call
    if (currentId !== legendUpdateId) return;
    // add legend content in the HTML
    var legendContent = document.getElementById('legend-content');
    legendHTMLString += "</ul>";
    legendContent.innerHTML = legendHTMLString;
}

// call the function
updateLegend();

// update legend each time the visibility of a layer changes
for(let layer of allLayers){
    layer.on('change:visible', updateLegend);
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

// add layer groups to the map
map.addLayer(basemapLayers);
map.addLayer(amacLayers);
map.addLayer(bivariateLayers);
