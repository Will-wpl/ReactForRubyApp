import loadGoogleMapsAPI from 'load-google-maps-api';

class LumiMap {
  constructor(element, options) {

    domReady(function() {
      // assign element
      if (element instanceof HTMLElement && element.nodeType && element.nodeType === 1) {
        this.element = element;
      } else if (typeof element === 'string' && (document.getElementById(element) || document.querySelector(element))) {
        this.element = document.getElementById(element) || document.querySelector(element);
      }
      else {
        throw "Invalid Element Error. Please pass in a DOM element, id string, or querySelector string into LumiMap";
      }

      if (this.element) {
        this.options = Object.assign({}, LumiMap.options, options);
        this.options.mapOptions = Object.assign({}, LumiMap.options.mapOptions, options.mapOptions);
        this._init();
      }
    }.bind(this));
  }

  _init() {
    LumiMap.loader = LumiMap.loader || loadGoogleMapsAPI( this.options.apiOptions );
    LumiMap.loader.then(googleMaps => {
      this.GoogleMaps = this.GoogleMaps || googleMaps;
      this._setupMap();
      if (this.options.markers && this.options.markers.length > 0) {
        this._placeMarkers();
      }
    }).catch((err) => {
      console.error(err)
    });

  }

  _setupMap() {
    // create map
    this.mapObject = new this.GoogleMaps.Map(this.element, this.options.mapOptions);

    var overlay = new this.GoogleMaps.OverlayView();
    window.overlay = overlay;
    overlay.draw = function() {
      this.getPanes().markerLayer.id = 'lumimap-markers';
    }
    overlay.setMap(this.mapObject);
  }

  _placeMarkers() {
    // place points on map
    this.options.markers.forEach(function(point) {

      var marker = new this.GoogleMaps.Marker({
        position: {lat: point.lat, lng: point.lng},
        map: this.mapObject,
        title: point.label,
        label: {
          text: point.label,
          color: '#fff',
          fontWeight: '100',
          fontSize: '14px'
        },
        icon: this._generateCircleIcon(point),
        optimized: false
      });
    }, this);
  }

  _generateCircleIcon(point) {
    let size = point.size || 10; // default circle size (diameter) in px
    let pathString;
    pathString = `M-${size/2},-5a${size/2},${size/2} 0 1,0 ${size},0a${size/2},${size/2} 0 1,0 -${size},0`;

    return {
      path: pathString,
      fillColor: point.color,
      fillOpacity: 1,
      scale: 1,
      strokeWeight: 5,
      strokeColor: 'transparent',
      labelOrigin: new this.GoogleMaps.Point(0, size*2)
    }
  }

}

LumiMap.options = {
  mapOptions: {
    zoom: 12,
    disableDefaultUI: true,
    // streetViewControl: false,
    // mapTypeControl: false,
    // zoomControl: false,
    // fullscreenControl: false,
    // draggable: false,
    // scaleControl: false,
    // scrollwheel: false,
    center: {lat: 1.2750796, lng: 103.8390163}, // singapore
    gestureHandling: 'cooperative',
    styles: [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#152230"
          },
          {
            "visibility": "on"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#c2d4da"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#242f3e"
          }
        ]
      },
      {
        "featureType": "administrative.country",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "stylers": [
          {
            "color": "#48586c"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "administrative.locality",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.neighborhood",
        "stylers": [
          {
            "color": "#89a4ad"
          }
        ]
      },
      {
        "featureType": "administrative.neighborhood",
        "elementType": "labels",
        "stylers": [
          {
            "color": "#5c7283"
          },
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#061b34"
          }
        ]
      },
      {
        "featureType": "poi",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#d59563"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#263c3f"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#6b9a76"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#38414e"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9ca5b3"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#20344c"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#4e5f74"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#243754"
          },
          {
            "weight": 1
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#99a6ab"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#99a6ab"
          },
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.local",
        "stylers": [
          {
            "color": "#233756"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#233b56"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#2f3948"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#99a6ab"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#040f1f"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#515c6d"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#17263c"
          }
        ]
      }
    ]
  }
};

export default LumiMap;
