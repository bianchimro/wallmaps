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


angular.module('wallmaps')

.controller('MainCtrl', ['$scope', function ($scope) {
    console.log("hello from main controller");

    /*
    $scope.center = {
        x : 9.669781,
        y : 45.698371
    };
    */
    $scope.center = {
        x : -74.005941,
        y : 40.712784, 
    };
    
    
    $scope.zoomfactor = 1;
    $scope.themeName = "sunrise";

    $scope.$watch('themeName', function(nv){
        if(!nv){
            return;
        }
        $scope.theme = themes[nv];
    });

    $scope.title= "New York City";

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
                x : 400,
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
                x : 400,
                y : 40
            },
            "title-style" : {
                "font-size" : "2em"
            }    
        }

    };



    
}])

    
})();