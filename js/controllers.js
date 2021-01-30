(function(){
"use strict";


var themes = {}


themes.aubergine = {
    
    background : {
        background : "#fff"
    },
    map : {
        gradient : {
            color1 : "#AA076B",
            color2 : "#61045F",
            x1 : "10%",
            x2 : "90%"
        },
        style  : {
            stroke : "#000",
            "stroke-width" : 2    
        }
        
    },

    text : {
        style  : {
            stroke : "none",
            "fill" : "#000",
            "fill-opacity" : 0.7
        },
        title : {
            style  : {
               stroke : "#fff",
               fill : "#fff",
               "font-family" : "Verdana",
                "font-size": "20px",
            }    
        },
        subtitle : {
            style  : {
               stroke : "#ccc",
               fill : "#fff",
               "font-family" : "Verdana",
               "font-size": "14px",
            }    
        }
    },

    major_road  : { stroke: "#fff",  "stroke-width": "1px" },
    minor_road  : { stroke: "#222",  "stroke-width": "1" },
    highway  : { stroke: "#fff",  "stroke-width": "1px" },
    buildings  : { fill: "yellow",  "stroke-width": "2" },
    water  : { fill: "#000"}

};


themes.sunrise = {
    background : { background : "#fff"},
    map : {
        gradient : {
            color1 : "#FF512F",
            color2 : "#F09819",
            x1 : "10%",
            x2 : "90%"
        },

        style  : {
            stroke : "#fff",
            "stroke-width" : 2

        }
    },

    text : {
        style  : {
            stroke : "none",
            
            "fill" : "#FF512F",
            "fill-opacity" : 0.7
        },
        title : {
            style  : {
               stroke : "#000",
               "font-size": "35px",
               fill : "#fff",
               "font-family" : "Impact"

            }    
        },
        subtitle : {
            style  : {
               fill : "black",
               stroke : "#fff",
               "font-family" : "Impact",
               "font-size": "16px",
            }    
        }
    },

    major_road  : { stroke: "#444",  "stroke-width": "1px" },
    minor_road  : { stroke: "#444",  "stroke-width": "1px" },
    highway  : { stroke: "#444",  "stroke-width": "1px" },
    buildings  : { stroke: "white",  "stroke-width": "1px" },
    water  : { fill: "#000"}
};

themes.ruperstrian = {
    background : { background : "#fff"},
    map : {
        background :  "#000",
        xgradient : {
            color1 : "#FF512F",
            color2 : "#F09819",
            x1 : "10%",
            x2 : "90%"
        },

        style  : {
            stroke : "#000",
            "stroke-width" : 2
        }
    },

    text : {
        style  : {
            stroke : "none",
            //"font-size": "1",
            "fill" : "#000",
            "fill-opacity" : 0.7
        },
        title : {
            style  : {
               stroke : "#000",
               fill : "#fff",
               "font-family" : "Courier",
               "font-weight" : "bold",
               "font-size": "24px",
            }    
        },
        subtitle : {
            style  : {
               fill : "#ccc",
               "font-family" : "Courier",
               "font-weight" : "bold",
               "font-size": "14px",
            }    
        }
    },

    major_road  : { stroke: "crimson",  "stroke-width": "3px", },
    minor_road  : { stroke: "red",  "stroke-width": "2px" },
    highway  : { stroke: "crimson",  "stroke-width": "3px" },
    buildings  : { stroke: "#fff",  "stroke-width": "1px" },
    //water  : { fill: "#000"}
};




var places = {
    "Firenze" : {
        y: 43.7698712,
        x: 11.2555757,
        title : "Firenze, Italia"
    },

    "Milano" : {
        x : 9.1904984,
        y : 45.4667971,
        title : "Milano, Italia."
    },

    "Paris" : {
        x : 2.3521334,
        y : 48.8565056,
        title : "Paris, France."
    },

    "New York" : {
        x : -74.005941,
        y : 40.712784,
        title : "New York City, USA."
    },

    "London" : {
        y: 51.5073219,
        x: -0.1276474,
        title : "London, England."
    },

    "Kathmandu" : {
        y: "27.7076762",
        x: "85.3148882",
        title : "Kathmandu, Nepal."
    },

    "Venezia": {
        y: 45.4371908,
        x: 12.3345899,
        title : "Venezia, Italia"
    }
}


angular.module('wallmaps')

.controller('MainCtrl', ['$scope', function ($scope) {
    console.log("hello from main controller");

    /*
    $scope.center = {
        x : 9.669781,
        y : 45.698371
    };
    
    $scope.center = {
        x : -74.005941,
        y : 40.712784, 
    };

    */
    
    $scope.places = places;
    $scope.zoomfactor = 2;
    $scope.themeName = "ruperstrian";
    $scope.placeName = "Milano";

    $scope.exportSvg = function(){

        var svg = document.getElementById("svg");
        console.dir(svg)
        //get svg source.
        //var serializer = new XMLSerializer();
        //var source = serializer.serializeToString(svg);
        //console.log(2, source)
        return

        //add name spaces.
        if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        //add xml declaration
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

        //convert svg source to URI data scheme.
        //var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

        //set url value to a element's href attribute.
        //document.getElementById("link").href = url;
        console.log(100, source)
    }

    $scope.$watch('themeName', function(nv){
        if(!nv){
            return;
        }
        $scope.theme = themes[nv];
    });

    $scope.$watch('placeName', function(nv){
        if(!nv){
            return;
        }
        $scope.center = places[nv];
        $scope.title = places[nv].title || nv;
    });

    

    $scope.layout = {
        doc : {
            width : 600,
            height : 900
        },
        map : {
            margin : { top : 40, left: 40, right : 40, bottom: 40}
        },
        text : {
            margin : { top : 780, left: 41, right : 41, bottom: 41},
            title : {
                x : 259,
                y : 35
            },
            "title-style" : {
                "font-size" : "4"
            },
            subtitle : {
                x : 259,
                y : 55
            },
            "subtitle-style" : {
                "font-size" : "2"
            }        
        }

    };

    $scope.layout2 = {
        doc : {
            width : 800,
            height : 800
        },
        map : {
            margin : { top : 20, left: 20, right : 20, bottom: 100}
        },
        text : {
            margin : { top : 720, left: 20, right : 20, bottom: 20},
            title : {
                x : 380,
                y : 40
            },
            "title-style" : {
                "font-size" : "2em"
            }    
        }

    };



    
}])

    
})();