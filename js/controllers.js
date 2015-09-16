(function(){
"use strict";


var themes = {}


themes.aubergine = {
    
    background : {
        background : "#000"
    },
    map : {
        gradient : {
            color1 : "#AA076B",
            color2 : "#61045F",
            x1 : "10%",
            x2 : "90%"
        },
        style  : {
            //stroke : "#fff"    
        }
        
    },

    text : {
        style  : {
            stroke : "none",
            "font-size": "25px",
            "fill" : "#000",
            "fill-opacity" : 0.7
        },
        title : {
            style  : {
               stroke : "#000",
               fill : "#fff",
               "font-family" : "Arial"

            }    
        }
    },

    major_road  : { stroke: "#fff",  "stroke-width": "1px" },
    minor_road  : { stroke: "#ccc",  "stroke-width": "1px" },
    highway  : { stroke: "#fff",  "stroke-width": "1px" },
    buildings  : { fill: "yellow",  "stroke-width": "1px" },
    water  : { fill: "#000"}

};


themes.sunrise = {
    background : { background : "#000"},
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
            "font-size": "25px"
        },
        title : {
            style  : {
               stroke : "#000",
               fill : "#fff",
               "font-family" : "Impact"

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
    background : { background : "#000"},
    map : {
        xgradient : {
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
            "font-size": "45px",
            "fill" : "#000",
            "fill-opacity" : 0.7
        },
        title : {
            style  : {
               stroke : "#000",
               fill : "#fff",
               "font-family" : "Courier",
               "font-weight" : "bold",

            }    
        }
    },

    major_road  : { stroke: "crimson",  "stroke-width": "3px", },
    minor_road  : { stroke: "crimson",  "stroke-width": "2px" },
    highway  : { stroke: "#fff",  "stroke-width": "3px" },
    buildings  : { stroke: "white",  "stroke-width": "1px" },
    //water  : { fill: "#000"}
};




var places = {
    "Milano" : {
        x : 9.1904984,
        y : 45.4667971

    },

    "Paris" : {
        x : 2.3521334,
        y : 48.8565056
    },

    "New York" : {

        x : -74.005941,
        y : 40.712784
    },

    "London" : {
        y: 51.5073219,
        x: -0.1276474,
    },

    "Kathmandu" : {
        y: "27.7076762",
        x: "85.3148882"
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
    $scope.themeName = "sunrise";
    $scope.placeName = "Milano"

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
        $scope.title = nv;
    });

    

    $scope.layout = {
        doc : {
            width : 800,
            height : 800
        },
        map : {
            margin : { top : 20, left: 20, right : 20, bottom: 20}
        },
        text : {
            margin : { top : 720, left: 20, right : 20, bottom: 20},
            title : {
                x : 360,
                y : 40
            },
            "title-style" : {
                "font-size" : "2em"
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