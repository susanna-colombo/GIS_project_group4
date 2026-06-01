/*  GIS course - project (A.Y. 2025-2026)
	Group 04
	Web GIS page
*/

// import all necessary modules
import 'ol/ol.css';
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
    title: "NO2 AMAC map (2021-2023)",
    /* type not specified allows for multiple selection*/
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gisgeoserver_04:Croatia_no2_2021_2023_AMAC_map' }
    }),
    visible: true,
	opacity: 0.8
});

// Croatia PM10 AMAC map 2021-2023
let Croatia_pm10_AMAC_2021_2023 = new Image({
    title: "PM10 AMAC map (2021-2023)",
    /* type not specified allows for multiple selection*/
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gisgeoserver_04:Croatia_pm10_2021_2023_AMAC_map' }
    }),
    visible: false,
	opacity: 0.8
});

// Croatia PM2.5 AMAC map 2021-2023
let Croatia_pm2p5_AMAC_2021_2023 = new Image({
    title: "PM2.5 AMAC map (2021-2023)",
    /* type not specified allows for multiple selection*/
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gisgeoserver_04:Croatia_pm2p5_2021_2023_AMAC_map' }
    }),
    visible: false,
	opacity: 0.8
});

// Add the layer groups code here:
let basemapLayers = new Group({
	title: "Base Maps",
	layers:  [osm]
});

let AMAClayers = new Group({
	title: 'AMAC Layers',
	layers: [
		Croatia_pm10_AMAC_2021_2023,
		Croatia_pm2p5_AMAC_2021_2023,
		Croatia_no2_AMAC_2021_2023	
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
var layerSwitcher = new LayerSwitcher({});
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

// var esriLightGrayBase = new Tile({
// 	title: 'ESRI Light Gray Base',
// 	type: 'base',
// 	visible: false,
// 	source: new XYZ({
// 		attributions:
// 			'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
// 			'rest/services/Canvas/World_Light_Gray_Base/MapServer">ArcGIS</a>',
// 		url:
// 			'https://server.arcgisonline.com/ArcGIS/rest/services/' +
// 			'Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
// 	})
// });

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

// // Add the popup code here:
// var container = document.getElementById('popup');
// var content = document.getElementById('popup-content');
// var closer = document.getElementById('popup-closer');
// var popup = new Overlay({
// 	element: container
// }); 

// map.addOverlay(popup);

// closer.onclick = function () {
// 	popup.setPosition(undefined);
// 	closer.blur(); 
// 	return false;
// };

// // Add the singleclick event code here
// map.on('singleclick', function (event) {
// 	var feature = map.forEachFeatureAtPixel(
// 		event.pixel, 
// 		function (feature, layer) {
// 			if(layer == staticGeoJSONLayer){
// 				return feature;
// 			}
// 		}
// 	);

// 	if (feature != null) {
// 		var pixel = event.pixel;
// 		var coord = map.getCoordinateFromPixel(pixel);
// 		popup.setPosition(coord);

// 		content.innerHTML =
// 			'<h5>Administrative Level 2</h5><br>' +
// 			'<span>' +
// 			feature.get('name_2') + ', ' +
// 			feature.get('name_1')
// 			'</span>';
// 	}
// });

// // Add the pointermove event code here:
// map.on('pointermove', function(event) {
// 	var pixel = map.getEventPixel(event.originalEvent);
// 	var hit = map.hasFeatureAtPixel(pixel);
// 	map.getTarget().style.cursor = hit ? 'pointer' : '';
// });

async function updateLegend() {
    var legendHTMLString = '<ul>';
    
    function getLegendElement(title, color){
        return '<li>' + 
            '<span class="legend-color" style="background-color: ' + color + ' ">' + 
            '</span><span>' + 
            title +
            '</span></li>';
    }

    for(let AMAClayer of AMAClayers.getLayers().getArray()){
        // Salta i layer non visibili
        if(!AMAClayer.getVisible()) continue;

        if(AMAClayer.getSource() instanceof ImageWMS){
            var legendURLParams = {format: "application/json"};
            var legendUrl = AMAClayer.getSource().getLegendUrl(0, legendURLParams);
            await fetch(legendUrl).then(async (response) => {
                await response.json().then((data) => {
                    var layerTitle = AMAClayer.get('title');
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
            var layerStyle = AMAClayer.getStyle();
            var layerColor = layerStyle.getFill().getColor();
            var layerTitle = AMAClayer.get('title');
            legendHTMLString += getLegendElement(layerTitle, layerColor);
        }
    }

    var legendContent = document.getElementById('legend-content');
    legendHTMLString += "</ul>";
    legendContent.innerHTML = legendHTMLString;
}

// Chiamata iniziale
updateLegend();

// Aggiorna la legenda ogni volta che cambia la visibilità di un layer
for(let AMAClayer of AMAClayers.getLayers().getArray()){
    AMAClayer.on('change:visible', updateLegend);
}

// Add the layer groups to the map here, at the end of the script!
map.addLayer(basemapLayers);
map.addLayer(AMAClayers);
