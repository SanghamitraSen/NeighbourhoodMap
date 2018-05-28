var map;
var infoWindow;
var bounds;
//locations to mark
var sushibars = [
    {
        title: "Sushizanmai",
        coordinates: {
            lat: 35.6657426,
            lng: 139.7706287
        }
    },
    {
        title: "Tsukiji Itadori Bekkan",
        coordinates: {
            lat: 35.6656121,
            lng: 139.7703561
        }
    },
    {
        title: "Daiwa Sushi",
        coordinates: {
            lat: 35.6636945,
            lng: 139.769549
        }
    },
    {
        title: "Sushi Dai",
        coordinates: {
            lat: 35.6636063,
            lng: 139.7696687
        }
    },
    {
        title: "Yamazaki",
        coordinates: {
            lat: 35.6647926,
            lng: 139.7700274
        }
    },
    {
        title: "Sushi Kuni",
        coordinates: {
            lat:35.6648321,
            lng:139.7707299
        }
    },
    {
        title: "Sushitomi",
        coordinates: {
            lat:35.6646473,
            lng:139.771554
        }
    },
    {
        title: "Motodane",
        coordinates: {
            lat:35.6647206,
            lng:139.7719199
        }
    },
    {
        title: "Iwasa Sushi",
        coordinates: {
            lat:35.663784,
            lng:139.770643
        }
    },
    {
        title: "Isonoya",
        coordinates: {
            lat:35.6635943,
            lng:139.7689784
        }
    }
];
//initializing map
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: {
        lat: 35.6654594,
        lng: 139.7707838
    },
        styles:[
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            }
        ]
    }
]
    });
    //creating information window
    infoWindow = new google.maps.InfoWindow();
    //applying boundaries for map
    bounds = new google.maps.LatLngBounds();
    //binding observables
    ko.applyBindings(new ViewModel());
}
//Model of Markers & location
var Markermodel = function(data) {
    var self = this;

    this.title = data.title;
    this.position = data.coordinates;
    this.street = "";
    this.city = "";

    this.visible = ko.observable(true);

    var clientID = "U0P45G4KV5KWDLX0FT2SSYBTBYIHRLU1QLRHCN1CMLLHEWD1";
    var clientSecret = "THAIXOGVFQLKMXUPTNWYW3QUOSOWNJOYB5VUEEOBTC3HGG35";

    /* get information through foursquare
    for infoWindow*/
    var fURL1 = "https://api.foursquare.com/v2/venues/search?ll=";
    var fURL2=this.position.lat+","+this.position.lng+"&client_id="+clientID;
    var fURL3="&client_secret="+clientSecret+"&v=20160118"+"&query="+this.title;
    var fURL=fURL1+fURL2+fURL3;
    $.getJSON(fURL).done(function(data) {
        var ajaxres = data.response.venues[0];
        self.street = ajaxres.location.formattedAddress[0];
        self.city = ajaxres.location.formattedAddress[1];
    }).fail(function() {
        alert("Foursquare error!");
    });

    // Create marker for each location & insert into array
    this.marker = new google.maps.Marker({
        position: this.position,
        title: this.title,
        animation: google.maps.Animation.DROP,
        icon: "imgs/sushi.png"
    });
    //Icon when marker hovered over
    this.marker.addListener("mouseover", function() {
        this.setIcon("imgs/japan.png");
    });
    //Icon when not hovering over marker
    this.marker.addListener("mouseout", function() {
        this.setIcon("imgs/sushi.png");

    });
    //for each list item or marker is clicked
    this.marker.addListener("click", function() {
        populateInfoWindow(this, self.street, self.city, infoWindow);
        bounceAnimate(this);
    });
    //filtering markers
    self.filterMarkers = ko.computed(function () {
        if(self.visible() === true) {
            self.marker.setMap(map);
            bounds.extend(self.marker.position);
            map.fitBounds(bounds);
        } else {
            self.marker.setMap(null);
        }
    });
    // display info when list item clicked
    this.displayInfo = function(location) {
      google.maps.event.trigger(self.marker, "click");
    };
};
// View Model
var ViewModel = function() {
    var self = this;
    this.isHidden = ko.observable(false);
    //Collapse icon function
    this.collapseClick = function () {
      this.isHidden(!this.isHidden());
    };
    this.sideList = ko.observableArray([]);

    // add location markers for each location
    sushibars.forEach(function(sushibar) {
        self.sideList.push( new Markermodel(sushibar));
    });
    this.searchWord = ko.observable("");

    // filtering list
    this.sushibarList = ko.computed(function() {
        var searchFilter = self.searchWord().toLowerCase();
        if (searchFilter) {
            return ko.utils.arrayFilter(self.sideList(), function(sushibar) {
                var name = sushibar.title.toLowerCase();
                if(name.includes(searchFilter)){
                sushibar.visible(true);
                return true;}
                else{
                    sushibar.visible(false);
                return false;
                }
            });
        }
        self.sideList().forEach(function(sushibar) {
            sushibar.visible(true);
        });
        return self.sideList();
    });
};

function populateInfoWindow(m, s, c, iw) {
    // if infowindow is not already opened on this marker.
    if (iw.m !== m) {
        iw.m = m;
        iw.addListener("closeclick", function() {
            iw.m = null;
        });
        //setting contents
        iw.setContent("<h2>"+m.title+"</h2>"+"<h4>"+s+"<br>"+c+"</h4>");
        iw.open(map, m);
    }
}
//function to add animation when marker clicked
function bounceAnimate(m) {
    m.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        m.setAnimation(null);
    }, 1000);
}
//alert message for google maps error
function mapsError() {
    alert("Google Maps Error!");
}

