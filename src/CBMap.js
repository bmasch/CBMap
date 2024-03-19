function delayedCall(func,delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Call the specified function
        func();
        resolve('Function executed successfully');
      } catch (error) {
        reject('Function execution failed');
      }
    }, delay); // Delay in ms
  });
}

function waitForIt(func,target){
  return new Promise((resolve, reject) => {
      try {

        // Call the specified function
        let tries = 0
        while($(target).length == 0){
          //wait
          tries++;
        }
        console.log("wait over after " + tries);
        func();
        console.log("finished:" + new Date());
        resolve('Function executed successfully');
      } catch (error) {
        console.log(error)
        reject('Function execution failed');
      }
  });  
}


class ColumbiaBasinMap{
	constructor(options){

		if(options.map){
		  this.leafmap = options.map;
		  console.log('map in options');
		}
		this.target = options.target;
		this.center = options.center ? options.center : [45.9,-115];
		this.zoom = options.zoom ? options.zoom : 7.5;
		this.setBaseLayers();
		this.layerControl = L.control.layers(this.basemaps);
		this.overlays = {};
		if(this.leafmap){
  		this.layerControl.addTo(this.leafmap);
  		this.leafmap.addLayer(this.basemaps["OpenStreetMap_Mapnik"]);
  		L.control.scale({position: "bottomright"}).addTo(this.leafmap);		  
		}

	}
	
	getMap(){
		return this.leafmap;
	}
	
	initMap(){
	  if(!this.leafmap){
	    this.leafmap = new L.Map(this.target, {
			center: this.center, 
			zoom: 7.25, 
			});
	  }
		
		this.layerControl.addTo(this.leafmap);
		this.leafmap.addLayer(this.basemaps["OpenStreetMap_Mapnik"]);
		L.control.scale({position: "bottomright"}).addTo(this.leafmap);
	}
	
	addOverlay(layer,name,addToMap){
	  this.overlays[name] = layer;
	  layer.name = name;
		this.layerControl.addOverlay(layer.layer, name);
		if(addToMap)layer.layer.addTo(this.getMap());
	}
	
	addLegend(options){
		L.control.legend(options).addTo(this.getMap());
	}
	
	addSettings(options){
	  let _this = this;
	  let classname = "#" + this.target + " .leaflet-control-layers-overlays label";
	  let wait_target = "#" + this.target + " .leaflet-control-layers-overlays";
	  
	  delayedCall(function(){

  	  $(classname).attr('title', 'Right Click for Layer Settings');
  	
  		$(classname).on('contextmenu', function(event) {
          event.preventDefault(); // Prevents the default context menu from showing
          
          _this.loadSettingsPanel(_this.overlays[event.target.innerHTML.substring(1)])
  
  		  $('.leaflet-control-layers.leaflet-control').removeClass('leaflet-control-layers-expanded');	    
	  })

		
        return false; // Prevents the default handler from executing
    },500);
    
    /*
    
    
    waitForIt(function(){
  	  console.log('adding at: ' + new Date())
  	  //console.log($(classname))
  	  $(classname).attr('title', 'Right Click for Layer Settings');
  	
  		$(classname).on('contextmenu', function(event) {
          event.preventDefault(); // Prevents the default context menu from showing
          
          _this.loadSettingsPanel(_this.overlays[event.target.innerHTML.substring(1)])
  
  		  $('.leaflet-control-layers.leaflet-control').removeClass('leaflet-control-layers-expanded');	    
	    })
        return false; // Prevents the default handler from executing
    },wait_target);      
  */
	}
	
	loadSettingsPanel(layer){
/*
    Requires that buildSettingsHTML(id) is implemented in the CBMapLayer

*/
	  let topthis = this;

      let settingsPanel = L.Control.extend({
              options: {
                  position: 'topright'
              },
              onAdd: function (map) {
                  let _this = this;
                  var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-layers-settings-panel');
                  container.title = layer.name;
                  container.id = topthis.target + "_settings_panel";
                  L.DomEvent.disableClickPropagation(container);
                  var button = L.DomUtil.create('a', 'leaflet-control-button leaflet-control-layers-settings-panel-close', container);
                  button.title = "Close";
                  button.innerHTML = '<table width = "195"><tr><th align="center" style="text-align: center">' + layer.name +'</th><td align="right" width="10"><span style="cursor: pointer; font-size: 1.4em; color: grey;" class="glyphicon glyphicon-collapse-up"></span></td></tr></table>';
                  L.DomEvent.disableClickPropagation(button);
                  L.DomEvent.on(button, 'click', function(){
                      map.removeControl(_this);
                  });
                  
              	  let id1 = topthis.target + "_settings";
              	  let id2 = topthis.target + "_settings_panel";
              	  
              	  let tempDiv = d3.select("body")
              	    .append("div")
              	    .attr("id",id1)
              	    .style("margin-left", "10px")
              	    .style("margin-top", "10px")
              	  
              	  layer.buildSettingsHTML(id1)
              	    
              	  delayedCall(function(){
              	      let target = document.getElementById(id2);
              	      target.appendChild(document.getElementById(id1))
              	  },100)                  
                  
                  return container;
              },
              onRemove: function(map) {
              },
          });
          let added = new settingsPanel().addTo(this.getMap());
	}
	
	createSettingsHTML(layer){
	  let topthis = this;

	  let id1 = this.target + "_settings";
	  let id2 = this.target + "_settings_panel";
	  let tempDiv = d3.select("body")
	    .append("div")
	    .attr("id",id1)
	    .html("Testing")
	    
	    delayedCall(function(){
	      let target = document.getElementById(id2);
	      target.appendChild(document.getElementById(id1))
	    },100)
 
	}
	

	setBaseLayers(){
		var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		});

		var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
			maxZoom: 17,
			attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
		})	
			
		var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
		});

		var Esri_DeLorme = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Copyright: &copy;2012 DeLorme',
			minZoom: 1,
			maxZoom: 11
		});

		var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
		});

		var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
		});

		var OpenStreetMap_BlackAndWhite = L.tileLayer('https://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});

		var Esri_WorldTerrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
			maxZoom: 13
		});

		var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
			maxZoom: 16
		});

		var Esri_WorldPhysical = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
			maxZoom: 8
		});

		var Esri_WorldShadedRelief = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Source: Esri',
			maxZoom: 13
		});

		var Esri_NatGeoWorldMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
			maxZoom: 16
		});

		var USGS_Navigator = L.tileLayer('http://navigator.er.usgs.gov/tiles/tcr.cgi/{z}/{x}/{y}.png', {
			attribution: '<a href="http://www.doi.gov">U.S. Department of the Interior</a> | <a href="http://www.usgs.gov">U.S. Geological Survey</a> | <a href="http://www.usgs.gov/laws/policies_notices.html">Policies</a>',
			subdomains: 'abcd',
			minZoom: 0,
			maxZoom: 20
		});

		var USGS_USImagery = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
			maxZoom: 20,
			attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
		});

		var USGS_USTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
			maxZoom: 20,
			attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
		});

		var OpenFireMap = L.tileLayer('http://openfiremap.org/hytiles/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="http://www.openfiremap.org">OpenFireMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
		});


		var Weather_Layer = L.tileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
				layers: 'nexrad-n0r-900913',
				format: 'image/png',
				transparent: true,
				attribution: "Weather data © 2012 IEM Nexrad"
			});
			
		this.basemaps = {
			'OpenStreetMap_Mapnik': OpenStreetMap_Mapnik,
			'Open Street Map': OpenStreetMap_HOT,
			'Esri World Gray': Esri_WorldGrayCanvas,
			'Esri World Physical': Esri_WorldPhysical,
			'ESRI Topo Map': Esri_WorldTopoMap,
			'Esri DeLorme': Esri_DeLorme,
			'USGS_USImagery': USGS_USImagery,
			'ESRI Imagery': Esri_WorldImagery,
			'Open Topo Map': OpenTopoMap,
			'USGS_USTopo': USGS_USTopo
		};
	
	}
}

class NWStatesLayer{
	constructor(options){
	    this.leafmap = options.map;
      this.setData();
      this.layer = this.getLayer();
      
	}
	
	setData(){
	  this.geojson = {"type":"FeatureCollection","features":[
		{"type":"Feature","id":"16","properties":{"name":"ID"},"geometry":{"type":"Polygon","coordinates":[[[-116.04751,49.000239],[-116.04751,47.976051],[-115.724371,47.696727],[-115.718894,47.42288],[-115.527201,47.302388],[-115.324554,47.258572],[-115.302646,47.187372],[-114.930214,46.919002],[-114.886399,46.809463],[-114.623506,46.705401],[-114.612552,46.639678],[-114.322274,46.645155],[-114.464674,46.272723],[-114.492059,46.037214],[-114.387997,45.88386],[-114.568736,45.774321],[-114.497536,45.670259],[-114.546828,45.560721],[-114.333228,45.456659],[-114.086765,45.593582],[-113.98818,45.703121],[-113.807441,45.604536],[-113.834826,45.522382],[-113.736241,45.330689],[-113.571933,45.128042],[-113.45144,45.056842],[-113.456917,44.865149],[-113.341901,44.782995],[-113.133778,44.772041],[-113.002331,44.448902],[-112.887315,44.394132],[-112.783254,44.48724],[-112.471068,44.481763],[-112.241036,44.569394],[-112.104113,44.520102],[-111.868605,44.563917],[-111.819312,44.509148],[-111.616665,44.547487],[-111.386634,44.75561],[-111.227803,44.580348],[-111.047063,44.476286],[-111.047063,42.000709],[-112.164359,41.995232],[-114.04295,41.995232],[-117.027882,42.000709],[-117.027882,43.830007],[-116.896436,44.158624],[-116.97859,44.240778],[-117.170283,44.257209],[-117.241483,44.394132],[-117.038836,44.750133],[-116.934774,44.782995],[-116.830713,44.930872],[-116.847143,45.02398],[-116.732128,45.144473],[-116.671881,45.319735],[-116.463758,45.61549],[-116.545912,45.752413],[-116.78142,45.823614],[-116.918344,45.993399],[-116.92382,46.168661],[-117.055267,46.343923],[-117.038836,46.426077],[-117.044313,47.762451],[-117.033359,49.000239],[-116.04751,49.000239]]]}},
		{"type":"Feature","id":"41","properties":{"name":"OR"},"geometry":{"type":"Polygon","coordinates":[[[-123.211348,46.174138],[-123.11824,46.185092],[-122.904639,46.08103],[-122.811531,45.960537],[-122.762239,45.659305],[-122.247407,45.549767],[-121.809251,45.708598],[-121.535404,45.725029],[-121.217742,45.670259],[-121.18488,45.604536],[-120.637186,45.746937],[-120.505739,45.697644],[-120.209985,45.725029],[-119.963522,45.823614],[-119.525367,45.911245],[-119.125551,45.933153],[-118.988627,45.998876],[-116.918344,45.993399],[-116.78142,45.823614],[-116.545912,45.752413],[-116.463758,45.61549],[-116.671881,45.319735],[-116.732128,45.144473],[-116.847143,45.02398],[-116.830713,44.930872],[-116.934774,44.782995],[-117.038836,44.750133],[-117.241483,44.394132],[-117.170283,44.257209],[-116.97859,44.240778],[-116.896436,44.158624],[-117.027882,43.830007],[-117.027882,42.000709],[-118.698349,41.989755],[-120.001861,41.995232],[-121.037003,41.995232],[-122.378853,42.011663],[-123.233256,42.006186],[-124.213628,42.000709],[-124.356029,42.115725],[-124.432706,42.438865],[-124.416275,42.663419],[-124.553198,42.838681],[-124.454613,43.002989],[-124.383413,43.271359],[-124.235536,43.55616],[-124.169813,43.8081],[-124.060274,44.657025],[-124.076705,44.772041],[-123.97812,45.144473],[-123.939781,45.659305],[-123.994551,45.944106],[-123.945258,46.113892],[-123.545441,46.261769],[-123.370179,46.146753],[-123.211348,46.174138]]]}},
		{"type":"Feature","id":"53","properties":{"name":"WA"},"geometry":{"type":"MultiPolygon","coordinates":[[[[-117.033359,49.000239],[-117.044313,47.762451],[-117.038836,46.426077],[-117.055267,46.343923],[-116.92382,46.168661],[-116.918344,45.993399],[-118.988627,45.998876],[-119.125551,45.933153],[-119.525367,45.911245],[-119.963522,45.823614],[-120.209985,45.725029],[-120.505739,45.697644],[-120.637186,45.746937],[-121.18488,45.604536],[-121.217742,45.670259],[-121.535404,45.725029],[-121.809251,45.708598],[-122.247407,45.549767],[-122.762239,45.659305],[-122.811531,45.960537],[-122.904639,46.08103],[-123.11824,46.185092],[-123.211348,46.174138],[-123.370179,46.146753],[-123.545441,46.261769],[-123.72618,46.300108],[-123.874058,46.239861],[-124.065751,46.327492],[-124.027412,46.464416],[-123.895966,46.535616],[-124.098612,46.74374],[-124.235536,47.285957],[-124.31769,47.357157],[-124.427229,47.740543],[-124.624399,47.88842],[-124.706553,48.184175],[-124.597014,48.381345],[-124.394367,48.288237],[-123.983597,48.162267],[-123.704273,48.167744],[-123.424949,48.118452],[-123.162056,48.167744],[-123.036086,48.080113],[-122.800578,48.08559],[-122.636269,47.866512],[-122.515777,47.882943],[-122.493869,47.587189],[-122.422669,47.318818],[-122.324084,47.346203],[-122.422669,47.576235],[-122.395284,47.800789],[-122.230976,48.030821],[-122.362422,48.123929],[-122.373376,48.288237],[-122.471961,48.468976],[-122.422669,48.600422],[-122.488392,48.753777],[-122.647223,48.775685],[-122.795101,48.8907],[-122.756762,49.000],[-121.756762,49.000],[-120.756762,49.000],[-119.756762,49.000],[-118.756762,49.000],[-118.000000,49.000],[-117.033359,49.000239]]],[[[-122.718423,48.310145],[-122.586977,48.35396],[-122.608885,48.151313],[-122.767716,48.227991],[-122.718423,48.310145]]],[[[-123.025132,48.583992],[-122.915593,48.715438],[-122.767716,48.556607],[-122.811531,48.419683],[-123.041563,48.458022],[-123.025132,48.583992]]]]}}
		]};
	}
	
	getMap(){
	  return this.leafmap;
	}
	
	getLayer(){
		var states = L.geoJSON(this.geojson, {
			color: 'gray',
			weight: 2,
			opacity: 0.7,
			fillOpacity: 0,
			});	
		return states;
	}	
	
}

class DamLayer{
		constructor(options){
		  this.leafmap = options.map;
      this.setData();
		  this.layer = this.getLayer();
	}
	
	setData(){
				this.data = 
			[
			  {
				"name": "Bonneville",
				"operator": "USACE Portland District",
				"latitude": 45.644569,
				"longitude": -121.940884,
				"nameplate": 1050,
				"overload": 1184,
				"km": 234
			  },
			  {
				"name": "Chief Joseph",
				"operator": "USACE Seattle District",
				"latitude": 47.995221,
				"longitude": -119.641926,
				"nameplate": 2069,
				"overload": 2614,
				"km": 877
			  },
			  {
				"name": "Dworshak",
				"operator": "USACE Walla Walla District",
				"latitude": 46.515492,
				"longitude": -116.295797,
				"nameplate": 400,
				"overload": 460,
				"km": ""
			  },
			  {
				"name": "Grand Coulee",
				"operator": "Bureau of Reclamation",
				"latitude": 47.956914,
				"longitude": -118.982241,
				"nameplate": 6465,
				"overload": "",
				"km": ""
			  },
			  {
				"name": "Ice Harbor",
				"operator": "USACE Walla Walla District",
				"latitude": 46.248669,
				"longitude": -118.879895,
				"nameplate": 603,
				"overload": 693,
				"km": 538
			  },
			  {
				"name": "John Day",
				"operator": "USACE Portland District",
				"latitude": 45.714265,
				"longitude": -120.691976,
				"nameplate": 2160,
				"overload": 2485,
				"km": 351
			  },
			  {
				"name": "Little Goose",
				"operator": "USACE Walla Walla District",
				"latitude": 46.585452,
				"longitude": -118.027285,
				"nameplate": 810,
				"overload": 932,
				"km": 635
			  },
			  {
				"name": "Lower Granite",
				"operator": "USACE Walla Walla District",
				"latitude": 46.661806,
				"longitude": -117.42777,
				"nameplate": 810,
				"overload": 932,
				"km": 695
			  },
			  {
				"name": "Lower Monumental",
				"operator": "USACE Walla Walla District",
				"latitude": 46.563186,
				"longitude": -118.538905,
				"nameplate": 810,
				"overload": 930,
				"km": 589
			  },
			  {
				"name": "McNary",
				"operator": "USACE Walla Walla District",
				"latitude": 45.933805,
				"longitude": -119.298113,
				"nameplate": 980,
				"overload": 1127,
				"km": 470
			  },
			  {
				"name": "The Dalles",
				"operator": "USACE Portland District",
				"latitude": 45.61391,
				"longitude": -121.133753,
				"nameplate": 1779.8,
				"overload": 2038,
				"km": 308
			  },
			  {
				"name": "Brownlee",
				"operator": "Idaho Power Company",
				"latitude": 44.837686,
				"longitude": -116.900333,
				"nameplate": 585.4,
				"overload": "",
				"km": ""
			  },
			  {
				"name": "Hells Canyon",
				"operator": "Idaho Power Company",
				"latitude": 45.243673,
				"longitude": -116.700408,
				"nameplate": 391.5,
				"overload": 450,
				"km": ""
			  },
			  {
				"name": "Oxbow",
				"operator": "Idaho Power Company",
				"latitude": 44.970644,
				"longitude": -116.835519,
				"nameplate": 190,
				"overload": 220,
				"km": ""
			  },
			  {
				"name": "Pelton Dam",
				"operator": "",
				"latitude": 44.69419,
				"longitude": -121.23096,
				"nameplate": "",
				"overload": "",
				"km": ""
			  },	
			  {
				"name": "Priest Rapids",
				"operator": "Grant County PUD",
				"latitude": 46.645048,
				"longitude": -119.910469,
				"nameplate": 955.6,
				"overload": "",
				"km": 639
			  },
			  {
				"name": "Rock Island",
				"operator": "Chelan County PUD",
				"latitude": 47.342956,
				"longitude": -120.094386,
				"nameplate": 622.5,
				"overload": 660,
				"km": 730
			  },
			  {
				"name": "Rocky Reach",
				"operator": "Chelan County PUD",
				"latitude": 47.532302,
				"longitude": -120.298342,
				"nameplate": 1287,
				"overload": "",
				"km": 763
			  },
			  {
				"name": "Roza Diversion Dam",
				"operator": "",
				"latitude": 46.74906376,
				"longitude": -120.4657655,
				"nameplate": "",
				"overload": "",
				"km": 745
			  },  
			  {
				"name": "Tumwater",
				"operator": "",
				"latitude": 47.61699792,
				"longitude": -120.7229479,
				"nameplate": "",
				"overload": "",
				"km": 798
			  },  
			  {
				"name": "Wanapum",
				"operator": "Grant County PUD",
				"latitude": 46.876149,
				"longitude": -119.97288,
				"nameplate": 1038,
				"overload": "",
				"km": 669
			  },
			  {
				"name": "Wells",
				"operator": "Douglas County PUD",
				"latitude": 47.947336,
				"longitude": -119.864649,
				"nameplate": 840,
				"overload": "",
				"km": 830
			  },
			  {
				"name": "Zosel",
				"operator": "",
				"latitude": 48.93349902,
				"longitude": -119.4198115,
				"nameplate": "",
				"overload": "",
				"km": 990
			  }  
		];  
	}
	
  	getMap(){
  	  return this.leafmap;
  	}
  	
  	getLayer(){
  	  console.log("getting dam data")
  		var damlayer = L.featureGroup();
  		this.data.forEach(function(d){
  			var damname = (" " + d.name).replace(/ /g, '&nbsp;');
  			
  			var damIcon = L.divIcon({
  				className: "damicon",
  				html: '<i style="background: black"></i> ' + damname
  			});
  			//var marker = L.marker([d.latitude, d.longitude], {icon: damIcon}).bindPopup(d.name);
  			var marker = L.marker(new L.LatLng(d.latitude, d.longitude), {icon: damIcon });
  			damlayer.addLayer(marker);
  		});
  
  		return damlayer;	
  	}
}

class RiverVectorLayer{
    constructor(options) {
		if (!options.map) {

			return null;
		}
		this.map = options.map;
		options.url = options.url ? options.url : "ColumbiaBasinCombined/{z}/{x}/{y}.pbf";
		this.baseurl = 'https://www.onefishtwofish.net/tileserver/tileserver.php?/index.json?/'
		this.url = this.baseurl + options.url;
		this.currentStyle = "";
		this.setData();//sets up lookup
		this.initStyles();	
		this.setStyle("styleRiverBlue");
		this.initLayer();
		this.legend_id = options.legend_id ? options.legend_id : null;
    }
    
    
  buildSettingsHTML(target_id){
      let topthis = this;
      
    	let panel = d3.select("#" + target_id);
    	let layerID = this.layer._leaflet_id;
    	let riverstyle_options_id = 'riverstyle_options' + layerID;
    	let html = ''
    	html += '<table cellpadding="3">';
    	html += '<tr><th align="left" class="dropdown_text">River Color</th></tr>';
    	html += '<tr><td align="left" colspan="2">'
    	html += '<select id="' + riverstyle_options_id + '" class="dropdown_text">';
			html += '<option value="styleRiverBlue" id="styleRiverBlue">Default Blue</option>';
			html += '<option value="styleRiverTemp" id="styleRiverTemp">Mean Aug Temp C</option>';
			html += '<option value="styleRiverTemp2011" id="styleRiverTemp2011">Aug Temp Rating</option>';
			html += '<option value="styleRiverTemp2040" id="styleRiverTemp2040">2040 Temp Rating</option>';
			html += '<option value="styleRiverElevation" id="styleRiverElevation">Elevation</option>';
			html += '<option value="styleRiverCanopy" id="styleRiverCanopy">Canopy</option>';
			html += '<option value="styleRiverVelocity" id="styleRiverVelocity">Stream Velocity</option>';
			html += '<option value="styleRiverSlope" id="styleRiverSlope">Stream Slope</option>';
			html += '<option value="styleRiverPrecip" id="styleRiverPrecip">Precipitation</option>';
			html += '</select>';
    	html += '</td></tr></table>'
    	
	    panel.append("div")
	    .html(html)
	    

	    $('#'+riverstyle_options_id).on('change', function() {

        topthis.updateStyle(this.value);
        topthis.map
	    })

	 
  }
  
    setData(){
		let _this = this;
		this.getData = function(d){return null}
		d3.csv("NorWestAttrs.csv", function(error, data) {	
			data.forEach(function(d){
				d.ELEV = +d.ELEV;
				d.CANOPY = +d.CANOPY;
				d.SLOPE = +d.SLOPE;
				d.PRECIP = +d.PRECIP
				d.CUMDRAINAG = +d.CUMDRAINAG
				d.S1_93_11 = +d.S1_93_11
				d.S30_2040D = +d.S30_2040D;
				d.MEANAUGCAT = d.S1_93_11 < 9 ? "sub-optimal low" : (d.S1_93_11 < 17 ? "optimal" : (d.S1_93_11 < 19 ? "sub-optimal high" : "lethal"))
				d.MEANAUGCAT2040 = d.S30_2040D < 9 ? "sub-optimal low" : (d.S30_2040D < 17 ? "optimal" : (d.S30_2040D < 19 ? "sub-optimal high" : "lethal"))
			})
			_this.datamap = d3.map(data, d => d.COMID)
			_this.getData = function(d){return _this.datamap.get(d)};
		})
	}
	
	setStyle(stylename){
		this.currentStyle = this.styles[stylename]
		this.styleName = stylename;
	}
	
	initLayer(){
		var RiverOptions = {
			rendererFactory: L.canvas.tile,
			attribution: 'National Hydrology Data Set',
			vectorTileLayerStyles: this.currentStyle.style,
		};
		
		this.layer = L.vectorGrid.protobuf(this.url,RiverOptions)
	}
	
	doLegend(){
		var style_annotation = {
			"styleRiverBlue": {text:"Line widths reflect NHD2 STREAMORDER (Strahler)"},
			"styleRiverTemp": {text:"NorWest Scenario 1, Historical composite scenario representing 19 year average August mean stream temperatures for 1993-2011. Degrees C."},
			"styleRiverTemp2011": {text:"NorWest Scenario 1, Historical composite scenario representing 19 year average August mean stream temperatures for 1993-2011. Categorized as:<table><tr><th>< 9C</th<td>sub-optimal low</td></tr><tr><th>9C-17C</th<td>optimal</td></tr><tr><th>17C-19C</th<td>sub-optimal high</td></tr><tr><th>> 19C</th></th<td>lethal</td></tr></table>"},
			"styleRiverTemp2040": {text:"NorWest Scenario 30, Future scenario based on global climate model ensemble averages that represent the A1B warming trajectory for 2040s (2030-2059). Future stream deltas within a processing unit were based on similar projected changes in August air temperature and stream discharge, but also accounted for differential warming of streams by using historical temperatures to scale temperature increases so that cold streams warm less than warm streams. Categorized as:<table border='1'><tr><th>< 9C</th><td>sub-optimal low</td></tr><tr><th>9C-17C</th><td>optimal</td></tr><tr><th>17C-19C</th><td>sub-optimal high</td></tr><tr><th>> 19C</th><td>lethal</td></tr></table>"},
			"styleRiverTemp2080": {text:"NorWest Scenario 32, Future scenario based on global climate model ensemble averages that represent the A1B warming trajectory for 2080s (2070-2099). Future stream deltas within a processing unit were based on similar projected changes in August air temperature and stream discharge, but also accounted for differential warming of streams by using historical temperatures to scale temperature increases so that cold streams warm less than warm streams. Categorized as:<table border='1'><tr><th>< 9C</th><td>sub-optimal low</td></tr><tr><th>9C-17C</th><td>optimal</td></tr><tr><th>17C-19C</th><td>sub-optimal high</td></tr><tr><th>> 19C</th><td>lethal</td></tr></table>"},
			"styleRiverElevation": {text:"Elevation in meters, from NorWest"},
			"styleRiverCanopy": {text:"Percent canopy for each 1 km stream segment, from NorWest"},
			"styleRiverVelocity": {text:"Stream velocity in units of m/sec, computed from NHDv2 attributes LENGTHKM/TOTMA."},
			"styleRiverSlope": {text:"Slope (rise/run) for each NHDPlus stream reach, from NorWest"},
			"styleRiverPrecip": {text:"NHDPlus precipitation measure (mm)"}
		}

		var addStyleAnnotations = function(){
			var opts = d3.select("#riverstyle_options").selectAll("option")
				opts[0].forEach(function(d){
					d3.select("#" + d.id)
						.on("mouseover", function() {
						tipdiv.transition()        
							.duration(20)      
							.style("opacity", 1);      
						tipdiv.html(style_annotation[d.id])	
							.style("left", (d3.event.pageX + 5) + "px")     
							.style("top", (d3.event.pageY +10) + "px");
						})                  
						.on("mouseout", function() {       
						tipdiv.transition()        
							.duration(20)      
							.style("opacity", 0);
						});	
				})

		}	
		let _this = this;
		let style = this.currentStyle
		var legend = d3.select("#" + this.legend_id);
		legend.selectAll("svg").remove();
		if(style.legend){
			var height = (style.legend.data.length)*17;
			var width = style.legend.width;
			var svg = legend.append("svg")
				.attr("height", height)
				.attr("width", width)
			
			svg.append("rect")
				.attr("x",0)
				.attr("y",0)
				.attr("height", height)
				.attr("width", width)
				.style("fill","white")
				
			svg	
				.selectAll(".riverlegend")
				.data(style.legend.data)
				.enter()
				.append("g")
				.attr("class","riverlegend")
				.attr("transform",function(d,i){
					return "translate(0," + (i*17+3) + ")"
				})
			svg	
				.selectAll(".riverlegend")
				.append("line")
				.attr("x1",5).attr("y1",5).attr("x2",30).attr("y2",5)
				.style("stroke",function(d){return d.value})
				.style("stroke-width",4)			
			svg	
				.selectAll(".riverlegend")
				.append("text")
				.attr("transform","translate(35,10)")
				.text(function(d){return d.label})
				.style("font-size",14)
				
			svg
				.on("mouseover", function() {
				tipdiv.transition()        
					.duration(20)      
					.style("opacity", 1);      
				tipdiv.html(style_annotation[_this.styleName].text)
					.style("width",500)
					.style("left", (d3.event.pageX + 5) + "px")     
					.style("top", (d3.event.pageY +10) + "px");
				})                  
				.on("mouseout", function() {       
				tipdiv.transition()        
					.duration(20)      
					.style("opacity", 0);
				});		
			}	
	}
	
	updateStyle(stylename){
		this.currentStyle = this.styles[stylename];
		this.layer.options.vectorTileLayerStyles = this.currentStyle.style;
		if(this.map.getMap()){
			this.layer.removeFrom(this.map.getMap())
			this.layer.addTo(this.map.getMap())	
			this.map.addSettings()
		}
		this.styleName = stylename;
		if(this.legend_id)this.doLegend();
	}

	initStyles(){
		let _this = this;
		let buildStyle = function(fxn){
			var stylelayers = [
						"ColumbiaBasinUnblockedStrahler1geojson",
						"ColumbiaBasinUnblockedStrahler2geojson",
						"ColumbiaBasinUnblockedStrahler3geojson",
						"ColumbiaBasinUnblockedStrahler45geojson",
						"ColumbiaBasinUnblockedStrahler68geojson"
			];
			var style = {}
			stylelayers.forEach(function(d){
				style[d] = fxn;
			})
			return style;
		}
		
		let getStrahlerWeight = function(properties,zoom){
			var weight;
			switch(properties.STRAHLER) {
				case 9:
					weight = 4;
					break;	
				case 8:
					weight = zoom < 9 ? 3 : 4;
					break;
				case 7:
					weight = zoom < 9 ? 2 : 3;
					break;
				case 6:
					weight = zoom < 9 ? 2 : 3;
					break;
				case 5:
					weight = zoom < 9 ? 1 : 2;
					break;
				case 4:
					weight = zoom < 9 ? 1 : 2;
					break;					
				default:
				weight = 1;
			}
			return weight;
		}
		let getAttrs = function(properties){
			return _this.getData(properties.COMID.toString());
		}
		var tempColor = d3.scale.threshold().domain([8,10,12,14,16,18,20]).range(["#0040ff","#0080ff","#00ffff","#40ff00","#ffff00","#ffbf00","#ff8000","#ff0000"]);
		
		var RiverTempScale = {"sub-optimal low": "blue","optimal": "green","sub-optimal high": "orange","lethal": "red"}
		

		let styles = {
			styleRiverBlue: {
					fxn: function(properties,zoom){
						var color = "blue";
						var style = {
							weight: getStrahlerWeight(properties,zoom),
							color: color,
							opacity: .6
									}
						return style;			
					}
			},
			styleRiverTemp: {
				fxn: function(properties,zoom){
					var color = "gray";
					var tempColor = d3.scale.threshold().domain([8,10,12,14,16,18,20]).range(["#0040ff","#0080ff","#00ffff","#40ff00","#ffff00","#ffbf00","#ff8000","#ff0000"]);
					if(getAttrs(properties)){ 
						color = tempColor(getAttrs(properties)["S1_93_11"])
					}	
					var style = {
						weight: getStrahlerWeight(properties,zoom)+1,
						color: color,
						opacity: 1
								}
					return style;			
				},
				legend: {
					type: "line",
					width: 80,
					data: [
						{label: "< 8", value: tempColor.range()[0]},
						{label: "8-10", value: tempColor.range()[1]},
						{label: "10-12", value: tempColor.range()[2]},
						{label: "12-14", value: tempColor.range()[3]},
						{label: "14-16", value: tempColor.range()[4]},
						{label: "16-18", value: tempColor.range()[5]},
						{label: "18-20", value: tempColor.range()[6]},
						{label: "> 20", value: tempColor.range()[7]}
					]
				}
			},
			styleRiverTemp2011: {
				fxn: function(properties,zoom){
					var color = "gray";
					if(getAttrs(properties)) color = RiverTempScale[getAttrs(properties).MEANAUGCAT]
					var style = {
						weight: getStrahlerWeight(properties,zoom)+1,
						color: color,
						opacity: 1
								}
					return style;			
				},
				legend: {
					type: "line",
					width: 150,
					data: [
						{label: "sub-optimal low", value: RiverTempScale["sub-optimal low"]},
						{label: "optimal", value: RiverTempScale["optimal"]},
						{label: "sub-optimal high", value: RiverTempScale["sub-optimal high"]},
						{label: "lethal", value: RiverTempScale["lethal"]}
					]
				}	
			},
			styleRiverTemp2040:{
				fxn: function(properties,zoom){
					var color = "gray";
					if(getAttrs(properties)) color = RiverTempScale[getAttrs(properties).MEANAUGCAT2040]
					var style = {
						weight: getStrahlerWeight(properties,zoom)+1,
						color: color,
						opacity: 1
								}
					return style;			
				},
				legend: {
					type: "line",
					width: 150,
					data: [
						{label: "sub-optimal low", value: RiverTempScale["sub-optimal low"]},
						{label: "optimal", value: RiverTempScale["optimal"]},
						{label: "sub-optimal high", value: RiverTempScale["sub-optimal high"]},
						{label: "lethal", value: RiverTempScale["lethal"]}
					]
				}	
			},			
			styleRiverElevation: {
				fxn: function(properties,zoom){
					var color = "gray";
					var elevationColor = d3.scale.threshold().domain([500,1000,1500,2000,2500]).range(colorbrewer["Blues"][6]);
					if(getAttrs(properties)) color = elevationColor(getAttrs(properties)["ELEV"])
					var style = {
						weight: getStrahlerWeight(properties,zoom)+1,
						color: color,
						opacity: 1
								}
					return style;			
				},
				legend: {
					type: "line",
					width: 110,
					data: [
						{label: "0-500", value: colorbrewer["Blues"][6][0]},
						{label: "500-1000", value: colorbrewer["Blues"][6][1]},
						{label: "1000-1500", value: colorbrewer["Blues"][6][2]},
						{label: "1500-2000", value: colorbrewer["Blues"][6][3]},
						{label: "2000-2500", value: colorbrewer["Blues"][6][4]},
						{label: "Over 2500", value: colorbrewer["Blues"][6][5]}
					]
				}	
			},		
			styleRiverCanopy: {
				fxn: function(properties,zoom){
					var color = "gray";
					var canopyColor = d3.scale.threshold().domain([20,40,60,80,90]).range(colorbrewer["Greens"][6]);
					if(getAttrs(properties)) color = canopyColor(getAttrs(properties).CANOPY)
					var style = {
						weight: getStrahlerWeight(properties,zoom)+1,
						color: color,
						opacity: 1
								}
					return style;			
				},
				legend: {
					type: "line",
					width: 80,
					data: [
						{label: "0-20", value: colorbrewer["Greens"][6][0]},
						{label: "20-40", value: colorbrewer["Greens"][6][1]},
						{label: "40-60", value: colorbrewer["Greens"][6][2]},
						{label: "60-80", value: colorbrewer["Greens"][6][3]},
						{label: "80-90", value: colorbrewer["Greens"][6][4]},
						{label: "> 90", value: colorbrewer["Greens"][6][5]}
					]
				}	
			},		
			styleRiverPrecip:{
				fxn: function(properties,zoom){
				var color = "gray";
				var precipColor = d3.scale.threshold().domain([500,1000,1500,2000]).range(colorbrewer["Blues"][5]);
				if(getAttrs(properties)) color = precipColor(getAttrs(properties).PRECIP)
				var style = {
					weight: getStrahlerWeight(properties,zoom),
					color: color,
					opacity: .8
							}
				return style;			
				},
				legend: {
					type: "line",
					width: 110,
					data: [
						{label: "0-500", value: colorbrewer["Blues"][5][0]},
						{label: "500-1000", value: colorbrewer["Blues"][5][1]},
						{label: "1000-1500", value: colorbrewer["Blues"][5][2]},
						{label: "1500-2000", value: colorbrewer["Blues"][5][3]},
						{label: "Over 2000", value: colorbrewer["Blues"][5][4]},
					]
				}	
			},
			styleRiverSlope: {
				fxn: function(properties,zoom){
					var color = "gray";
					var slopeColor = d3.scale.threshold().domain([.1,.2,.3,.4,.5,.6]).range(colorbrewer["YlOrRd"][7]);
					if(getAttrs(properties)) color = slopeColor(getAttrs(properties).SLOPE)
					var style = {
						weight: getStrahlerWeight(properties,zoom)+1,
						color: color,
						opacity: 1
								}
					return style;			
				},
				legend: {
					type: "line",
					width: 80,
					data: [
						{label: "0-.1", value: colorbrewer["YlOrRd"][7][0]},
						{label: ".1-.2", value: colorbrewer["YlOrRd"][7][1]},
						{label: ".2-.3", value: colorbrewer["YlOrRd"][7][2]},
						{label: ".3-.4", value: colorbrewer["YlOrRd"][7][3]},
						{label: ".4-.5", value: colorbrewer["YlOrRd"][7][4]},
						{label: ".5-.6", value: colorbrewer["YlOrRd"][7][5]},
						{label: ">.6", value: colorbrewer["YlOrRd"][7][6]}
					]
				}	
			},
			styleRiverVelocity: {
				fxn: function(properties,zoom){
					var color = "gray";
					var velocityColor = d3.scale.threshold().domain([.4,.8,1.2,1.4,1.6]).range(colorbrewer["YlOrRd"][6]);
					if(+properties.TOTMA > 0){
						color = velocityColor(.012* +(properties.LENGTHKM)/(properties.TOTMA))
					}
					var style = {
						weight: getStrahlerWeight(properties,zoom)+1,
						color: color,
						opacity: 1
								}
					return style;			
				},
				legend: {
					type: "line",
					width: 80,
					data: [
						{label: "0-.4", value: colorbrewer["YlOrRd"][6][0]},
						{label: ".4-.8", value: colorbrewer["YlOrRd"][6][1]},
						{label: ".8-1.2", value: colorbrewer["YlOrRd"][6][2]},
						{label: "1.2-1.4", value: colorbrewer["YlOrRd"][6][3]},
						{label: "1.4-1.6", value: colorbrewer["YlOrRd"][6][4]},
						{label: "> 1.6", value: colorbrewer["YlOrRd"][6][5]}
					]
				}	
			}			
		
		}
		this.styles = {}
		Object.keys(styles).forEach(function(d){
			_this.styles[d] = {
				style: buildStyle(styles[d].fxn),
				legend: styles[d].legend
			}
		});
	}
}

class PopulationVectorLayer{
    constructor(options) {
		if (!options.map) {

			return null;
		}
		this.map = options.map;
		options.url = options.url ? options.url : "AllPopulations/{z}/{x}/{y}.pbf";
		this.baseurl = 'https://www.onefishtwofish.net/tileserver/tileserver.php?/index.json?/'
		this.url = this.baseurl + options.url;
		this.pop_bordercolor = "#ffffff";
		this.pop_color = "orange";
		this.pop_opacity = 0.5;
		this.z_index = 300;
		this.currentStyle = "";
		this.initStyles();	
		this.setStyle(options.style);
		this.initLayer();
		//this.legend_id = options.legend_id ? options.legend_id : null;
    }
    
    
    initLayer(){
      let topthis = this;
      let styles = {};
      styles["AllPopulationsgeojson"] = this.currentStyle.fxn
  		var PopulationOptions = {
  			rendererFactory: L.canvas.tile,
  			attribution: 'NOAA',
  			vectorTileLayerStyles: styles
  		}
  		this.layer = L.vectorGrid.protobuf(this.url,PopulationOptions)
  		  .bindTooltip('', { sticky: true })
  		  .on('add',(e)=>{
  		    if(!topthis.poplabelgroup)topthis.poplabelgroup = L.featureGroup()
          topthis.poplabelgroup.addTo(topthis.map.getMap());
        })
        .on('remove',(e)=>{
          topthis.map.getMap().removeLayer(topthis.poplabelgroup);
        });
  		
	
    	this.layer.on('mouseover', e => {
    		L.DomEvent.stopPropagation(e)
    		const attributes = e.layer.properties
    		var popid = attributes.CA_POPID
    		var pop = params.pops[popid];
    		var popname = popid + "- NA";
    		if(pop)popname = popid + " - " + pop.POPULATIONNAME.split(" - ")[0];
    		var html = popname + '</br>';		
    		poplayer.setTooltipContent(html,{ sticky:true }
    		)
    	})
    	
    	this.layer.on('click', e => {
    		L.DomEvent.stopPropagation(e)
    		const attributes = e.layer.properties
    		var popid = attributes.CA_POPID
    		var pop = params.pops[popid];
    		var popname = "NA";
    		if(pop){
    			if(pop)popname = pop.POPULATIONNAME.split(" - ")[0];
    			//topthis.addPopLabel(popid,popname,{Latitude: e.latlng.lat, Longitude: e.latlng.lng })
    		}
    	})	
	  }
	  
	  reload(){
	    this.map.getMap().removeLayer(this.layer);
	    this.layer.addTo(this.map.getMap());
	    this.map.addSettings();
	  }
	  

    buildSettingsHTML(target_id){
      let topthis = this;
      
    	let panel = d3.select("#" + target_id);
    	let layerID = this.layer._leaflet_id;

    	let pop_options_id = 'riverstyle_options' + layerID;
    	let fillcolorchoice_id = "fillcolor" + layerID;
    	let bordercolorchoice_id = "bordercolor" + layerID
    	let opacity_slider_id = "fillopacity" + layerID
    	let zindex_id = "zindex" + layerID
    	
    	let html = ''
    	html += '<table cellpadding="3">';
    	html += '	<tr><th align="left" class="dropdown_text">Fill Color</th><td><input id="';
    	html += fillcolorchoice_id;
    	html += '"></input></td></tr>';
    	html += '	<tr><th align="left" class="dropdown_text">Border Color</th><td><input id="';
    	html += bordercolorchoice_id;
    	html += '"></input></td></tr>';
    	html += '<tr><th align="left" class="dropdown_text">Fill Opacity</th></tr>';
    	html += '<tr><td align="left" colspan="2"><div id="'
    	html += opacity_slider_id
      html += '"/>'
    	html += '<tr><th align="left" class="dropdown_text">Z Index</th></tr>';
    	html += '<tr><td align="left" colspan="2"><div id="'
    	html += zindex_id
    	html += '"/>';
    	//html += '" type = "range" min ="1" max="1000" step ="10" value ="' + topthis.z_index + '"/></tr>';    	
    	html += '</td></tr></table>'
    	
	    panel.append("div")
	    .html(html)
	    
	   $("#"+fillcolorchoice_id).spectrum({
        color: topthis.pop_color,
      	hide: function(tinycolor) {
      		topthis.pop_color = "#" + tinycolor.toHex();
     		  topthis.reload();
      	}
      });
      
	   $("#"+bordercolorchoice_id).spectrum({
        color: topthis.pop_bordercolor,
      	hide: function(tinycolor) {
      		topthis.pop_bordercolor = "#" + tinycolor.toHex();
      		topthis.reload();
      	}
      });
      
      $("#" + opacity_slider_id).slider({
        min:1,
        max:100,
        value:topthis.pop_opacity*100,
        change: function( event, ui ) {
          topthis.pop_opacity = (+ui.value)/100;
          topthis.reload();
        }
      })
      
      $("#" + zindex_id).slider({
        min:1,
        max:1000,
        value:topthis.z_index,
        change: function( event, ui ) {
          topthis.z_index = +ui.value
        	topthis.layer.setZIndex(topthis.z_index);
        }
      })      
      
      
 /*     
      $("#" + opacity_slider_id).on("input", function(){
      	topthis.pop_opacity = (+this.value)/100;
        topthis.reload();
      }) 
     

      
      $("#" + zindex_id).on("input", function(){
        topthis.z_index = +this.value
      	topthis.layer.setZIndex(topthis.z_index);
      }) 
*/      
	 
  }	  
    
    
  setStyle(stylename){
		this.currentStyle = this.popstyles[stylename]
		this.styleName = stylename;
	}  
    
	initStyles(){
		let _this = this;
		

		this.popstyles = {}
		  
      this.popstyles.styleChinook = {
      		fxn: function(properties,zoom){
      			var opacity = properties.NMFS_COMMO == "Chinook" ? .8 : 0
      			opacity =  properties.LISTING_ST == "Threatened" | properties.LISTING_ST == "Endangered" ? opacity : 0;
      			opacity =  properties.POPSTATUS == "Extant" | properties.POPSTATUS == "Reintroduction" ? opacity : 0;
      			opacity =  properties.CA_POPID == "1" | properties.CA_POPID == "6" ? 0 : opacity;
      			var style = {
      						color: _this.pop_bordercolor,
      						opacity: opacity,
      						fillOpacity: opacity == 0 ? 0 : _this.pop_opacity,
      						fillColor: _this.pop_color,
      						weight: 2,
      						fill: opacity == 0 ? false : true
      						}
      			return style;			
      		},
      		label: "Chinook Populations"
      }
      
      this.popstyles.styleSteelhead = {
      		fxn: function(properties,zoom){
      			var opacity = properties.NMFS_COMMO == "Steelhead" ? .8 : 0
      			opacity =  properties.LISTING_ST == "Threatened" | properties.LISTING_ST == "Endangered" ? opacity : 0;
      			opacity =  properties.POPSTATUS == "Extant" | properties.POPSTATUS == "Reintroduction" ? opacity : 0;
      			var style = {
      						color: _this.pop_bordercolor,
      						opacity: opacity,
      						fillOpacity: opacity == 0 ? 0 : _this.pop_opacity,
      						fillColor: _this.pop_color,
      						weight: 2,
      						fill: opacity == 0 ? false : true
      						}
      			return style;			
      		},
      		label: "Steelhead Populations"
      }
      
      this.popstyles.styleSockeye = {
      		fxn: function(properties,zoom){
      			var opacity = properties.NMFS_COMMO == "Sockeye" ? .8 : 0
      			opacity =  properties.LISTING_ST == "Threatened" | properties.LISTING_ST == "Endangered" ? opacity : 0;
      			opacity =  properties.POPSTATUS == "Extant" | properties.POPSTATUS == "Reintroduction" ? opacity : 0;
      			var style = {
      						color: _this.pop_bordercolor,
      						opacity: opacity,
      						fillOpacity: opacity == 0 ? 0 : _this.pop_opacity,
      						fillColor: _this.pop_color,
      						weight: 2,
      						fill: opacity == 0 ? false : true
      						}
      			return style;			
      		},
      		label: "Sockeye Populations"
      }
		}
		
		addPopLabel(id,label){
		    let topthis = this;
    		var lat = this.population.centroids[id].Lat;
    		var lon = this.population.centroids[id].Lon
    		var html, words;
    		html = "<table class='poplabeltable'><tr><td align='left' class='poplabel'>" + label + "</td></tr></table>"				
    		var divIcon = L.divIcon({ 
    		html: html,
    		className: "LABEL" + id,
    		draggable: true
    		})
    		
    		let leaflet_map = this.map.getMap()
    		
    		var marker = L.marker(new L.LatLng(lat, lon), {icon: divIcon })
    		
    		
    		
    		this.poplabelgroup.addLayer(marker);
    		    // Disable dragging when user's cursor enters the element
    		  marker.addEventListener('mouseover', function () {
    			leaflet_map.dragging.disable();
    			marker.dragging.enable();
    		});
    		
    		marker.on('dragend', function(e) {
      		var id = this.options.icon.options.className.substring(5);
      		var centroid = topthis.population.centroids[id];
      		coord = marker.getLatLng();
      		centroid.Lat = [coord.lng];	
      		centroid.Lon = [coord.lat];		
		    });

        // Re-enable dragging when user's cursor leaves the element
    		marker.addEventListener('mouseout', function () {
    			leaflet_map.dragging.enable();
    		});
    		d3.selectAll(".poplabeltable").style("color",topthis.population.labelcolor)
    		d3.selectAll(".poplabeltable td").style("font-size",topthis.population.labelsize)
}
}

class PTAGIS_SiteLayer{
  constructor(options){
    this.URL = options.URL;
    this.site_type = options.site_type ? options.site_type : "Interrogation";
    this.leafmap = options.leafmap;
    this.pointOptions = {
              radius: options.radius ? options.radius : 3,
              radius_multiplier: 1,
              stroke: options.stroke ? options.stroke : false,
              fill: options.fill ? options.fill : true,
              fillColor: options.fillColor ? options.fillColor : "red",
              color: options.color ? options.color : "black",
              weight: options.weight ? options.weight : 1,
              opacity: options.opacity ? options.opacity : 1,
              fillOpacity: options.fillOpacity ? options.fillOpacity : 1
            }
    this.siteLocations = {
      BO4: {latitude: 45.6489237265269, longitude: -121.935232635178},
      BO3: {latitude: 45.6498428127936, longitude: -121.937278428877},
      BONAFF: {latitude: 45.649854062752, longitude: -121.936535700906},
      JO1: {latitude: 45.7115251654741, longitude: -120.688823898527},
      JO2: {latitude: 45.719187564132, longitude: -120.696770554023}
    }
    
    this.addLayer()
  }
  
  buildSettingsHTML(target_id){
      let topthis = this;
    	let panel = d3.select("#" + target_id);
    	let layerID = this.layer._leaflet_id;
    	let size_slider_id = 'size_slider' + layerID;
    	let colorchoice_id = 'colorchoice' + layerID;
    	let fillcolorchoice_id = 'fillcolorchoice' + layerID;
    	let fill_id = 'fill' + layerID;

    	let border_id = 'border' + layerID;
    	let html = ''
    	html += '<table cellpadding="3">';
    	html += '<tr><th align="left" class="dropdown_text">Circle Radius</th></tr>';
    	html += '<tr><td align="left" colspan="2"><input id="'
    	html += size_slider_id
    	html += '" type = "range" min ="1" max="10" step ="1" value ="1"/></tr>';
    	html += '	<tr><th align="left" class="dropdown_text">Fill</th><td><input id="'
    	html += fill_id
    	html += '" type="checkbox"></input></td></tr>';    	
    	html += '	<tr><th align="left" class="dropdown_text">Fill Color</th><td><input id="'
    	html += fillcolorchoice_id
    	html += '"></input></td></tr>';
    	html += '	<tr><th align="left" class="dropdown_text">Border</th><td><input id="'
    	html += border_id
    	html += '" type="checkbox"></input></td></tr>';     	
    	html += '	<tr><th align="left" class="dropdown_text">Border Color</th><td><input id="'
    	html += colorchoice_id
    	html += '"></input></td></tr>';    	
    	html += '</td></tr></table>'
    	
	    panel.append("div")
	    .html(html)
	    
	   $("#"+border_id).prop('checked', topthis.pointOptions.stroke ? true : false); 
	    
	   $("#"+border_id).change(function() {
        if(this.checked) {
            topthis.pointOptions.stroke = true;
        }
        else{
          topthis.pointOptions.stroke = false;
        }
    	  topthis.layer.eachLayer(function (marker) {
    	    marker.setStyle({stroke: topthis.pointOptions.stroke});
        });        
     });
     
     $("#"+fill_id).prop('checked', topthis.pointOptions.fill ? true : false);
     
	   $("#"+fill_id).change(function() {
        if(this.checked) {
            topthis.pointOptions.fill = true;
        }
        else{
          topthis.pointOptions.fill = false;
        }
    	  topthis.layer.eachLayer(function (marker) {
    	    marker.setStyle({fill: topthis.pointOptions.fill});
        });        
     });     

	    
	   $("#"+fillcolorchoice_id).spectrum({
        color: topthis.pointOptions.fillColor,
      	hide: function(tinycolor) {
      		topthis.pointOptions.fillColor = "#" + tinycolor.toHex();
      	  topthis.layer.eachLayer(function (marker) {
      	    marker.setStyle({fillColor: topthis.pointOptions.fillColor});
          });      		
      	}
      });
      
	   $("#"+colorchoice_id).spectrum({
        color: topthis.pointOptions.color,
      	hide: function(tinycolor) {
      		topthis.pointOptions.color = "#" + tinycolor.toHex();
      	  topthis.layer.eachLayer(function (marker) {
      	    marker.setStyle({color: topthis.pointOptions.color});
          });      		

      	}
      });      
      
      $("#" + size_slider_id).on("input", function(){
      	topthis.pointOptions.radius_multiplier = +this.value;
      	topthis.layer.eachLayer(function (marker) {
            marker.setRadius(topthis.pointOptions.radius*topthis.pointOptions.radius_multiplier);
          });
      	
      })
  }
  
  getSiteInfo(d){
    if(this.site_type == "Interrogation"){
      return {
        code: d["Interrogation Site Code"],
        name: d["Interrogation Site Name"],
        type: d["Site Type Name"],
        rkm: d["Interrogation Site Location RKM"],
        latitude: +d["Interrogation Site Location Latitude"],
        longitude: +d["Interrogation Site Location Longitude"],
        active: d["Int Site Active"]==1 ? true : false
      }
    }
    
    else{
      return {
        code: d["MRR Site Info Code"],
        name: d["MRR Site Info Name"],
        type: d["MRR Site Type Name"],
        rkm: d["MRR Site Info RKM Mask"],
        latitude: +d["MRR Site Latitude Value"],
        longitude: +d["MRR Site Longitude Value"],
        active: true
      }      
    }
  }
  
  getPopup(d){
    let html = "";
    html += "<table cellspacing=5><tr><th>Code</th><td>";
    html += d.code;
    html += "</td></tr><tr><th>Name</th><td>";
    html += d.name;
    html += "</td></tr><tr><th>Type</th><td>";  
    html += d.type;    
    html += "</td></tr><tr><th>RKM</th><td>";  
    html += d.rkm;
    html += "</td></tr></table>";
    return html
  }
  
  setMarkerRadius() {
    let zoom = this.leafmap.getMap().getZoom();
    let zoomlevels = [1,1,1,1,1.5,2,2,3,3.5,4,4.5,5,5.5,6,6,6,6,6,6,6,6,6,6,6,6,6]
    let radius = zoomlevels[zoom]*this.pointOptions.radius_multiplier;
    this.pointOptions.radius = radius;
  }
  
  buildLayer(data){
    let _this = this;
    this.setMarkerRadius();
    let layer = L.featureGroup()
  		data.forEach(function(_d){
  		  let d = _this.getSiteInfo(_d);
  			var marker = L.circleMarker(new L.LatLng(d.latitude, d.longitude), _this.pointOptions).bindPopup(_this.getPopup(d)).bindTooltip(d.code);
  			if(d.active)layer.addLayer(marker);
  		});
  		this.layer = layer;
  }
  
  modifyLocations(){
    let _this = this;
    this.data.forEach(function(d){
      if(_this.site_type == "Interrogation"){
        let newcoords = _this.siteLocations[d["Interrogation Site Code"]];
        if(newcoords){
          d["Interrogation Site Location Latitude"] = newcoords.latitude;
          d["Interrogation Site Location Longitude"] = newcoords.longitude;
        }        
      }
      else{
        let newcoords = _this.siteLocations[d["MRR Site Info Code"]];
        if(newcoords){
          d["MRR Site Latitude Value"] = newcoords.latitude;
          d["MRR Site Longitude Value"] = newcoords.longitude;
        }          
      }
        
    })
  }
  
  addLayer(){
    let _this = this;
    this.layer = L.featureGroup();
    d3.csv(this.URL, function(error, data) {
  		_this.data = data;
  		_this.modifyLocations(); // corrects a few locations
  		_this.buildLayer(data);
  		_this.leafmap.addOverlay(_this,_this.site_type,false)
  		_this.leafmap.getMap().on('zoomend', function() {
  		    _this.setMarkerRadius();
          _this.layer.eachLayer(function (marker) {
            marker.setRadius(_this.pointOptions.radius);
          });
      });
    })
  }
}


class CircleMarkerLayer{
  constructor(options){
    
  }
  
  addLayer(){
    let topthis = this;
    this.layer = L.featureGroup();
    d3.csv(this.URL, function(error, data) {
  		topthis.data = data;
  		topthis.buildLayer(data);
  		topthis.leafmap.addOverlay(topthis,topthis.site_type,false)
  		topthis.leafmap.getMap().on('zoomend', function() {
  		    _this.setMarkerRadius();
          _this.layer.eachLayer(function (marker) {
            marker.setRadius(_this.pointOptions.radius);
          });
      });
    })
  }  
  
}


    
    


