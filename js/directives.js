(function(){
"use strict";



var layers = ['water', 'landuse', 'roads', 'buildings'];

var createGradient = function(element, options, id){

    element = d3.select(element[0])
    
    var defs = d3.select("defs", element)
    if(!defs[0][0]){
        defs = element.append('defs')    
    }
    
    var grad = defs.select("#"+id)
    
    if(!grad[0][0]){
        grad = defs.append('linearGradient').attr("id", id)
    }
    
    var gradient = defs.select("#"+id)
        .attr("x1", options.x1 || "0%")
        .attr("x2", options.x2 || "100%")
        .attr("spreadMethod", "pad")
        .html('');

    gradient
        .append("svg:stop")
        .attr("offset", options.x1 || "0%")
        .attr("stop-color", options.color1)
        .attr("stop-opacity", 1);
    
    gradient
        .append("svg:stop")
        .attr("offset", options.x2 || "100%")
        .attr("stop-color", options.color2)
        .attr("stop-opacity", 1);

    return "gradient";
};

var applyStyle = function(style, sel){
    _.each(_.keys(style), function(k){
        sel.style(k, style[k])
    })
};

var applyAttrs = function(style, sel){
    _.each(_.keys(style), function(k){
        sel.attr(k, style[k])
    })
};


angular.module('wallmaps')


.factory('vectorData', ['$q', function ($q) {
    var svc = {};
    svc.cache = {};

    svc.getData = function(url){
        var deferred = $q.defer();
        if(svc.cache[url]){
            deferred.resolve(svc.cache[url]);
        } else {
            d3.json(url, function(error, data) {
                if(error){
                    deferred.reject(error);
                }
                svc.cache[url] = data;
                deferred.resolve(data)
            });   
        }

        return deferred.promise;
    }


    return svc;

    
}])


.directive('mapPreview', [function () {
    return {
        restrict: 'E',
        replace:true,
        scope : { theme : "=", layout : "=", center : "=", zoomfactor : "=", title : "=", subtitle : "=" },
        template : '<svg height="100%" width="100%"><g background></g><g map></g><g textual></g></svg>',
        link: function (scope, iElement, iAttrs) {
            scope.$watch('layout', function(nv){
                if(!nv){
                    return
                }

                iElement
                .attr("width", nv.doc.width)
                .attr("height", nv.doc.height)
            })
            
        }
    };
}])


.directive('background', [function () {
    return {
        restrict: 'A',
        link: function (scope, iElement, iAttrs) {
            var parentElement = iElement.parent()
            var svg = d3.select(parentElement[0]);

            var rect = d3.select(iElement[0]).append('rect')
                .attr("width", "100%")
                .attr("height", "100%")
                .style("fill", "none")

            scope.$watch('theme', function(nv){
                
                if(scope.theme.background){

                    if(scope.theme.background.gradient){
                      var gradient = createGradient(parentElement, scope.theme.background.gradient, "bkGradient");
                        rect.style('fill', "url(#bkGradient)")
                    };
                    if(scope.theme.background.background){
                        rect.style('fill', scope.theme.background.background)
                    };

                }

            }, true)
        }
    };
}])


.directive('textual', [function () {
    return {
        restrict: 'A',
        link: function (scope, iElement, iAttrs) {
            var s = iElement.parent()
            var svg = d3.select(s[0]);
            var container;

            
            var drawChart = function(){
                var subtitle = scope.subtitle || "Lat: " + scope.center.y + ", Lon: " +  scope.center.x

                var width = s.width();
                var height = s.height();
                if(container){
                    container.remove();
                }

                container = d3.select(s[0]).append('svg');

                if(scope.layout.text && scope.layout.text.margin){
                    var margin = scope.layout.text.margin;
                    width = width - (margin.left || 0) - (margin.right || 0);
                    height = height - (margin.top || 0) - (margin.bottom || 0);
                    
                    container
                    .attr("width", width)
                    .attr("height", height)
                    .attr("x", margin.left || 0)
                    .attr("y", margin.top || 0)
                    //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                }


                var rect = container
                    .append('rect')
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .style("fill", "none");

                var txt = container
                    .append("text")
                    .style("text-anchor", "middle")
                    .text(scope.title);

                if(scope.layout.text.title){
                    applyAttrs(scope.layout.text.title, txt);
                }

                if(scope.layout.text["title-style"]){
                    applyStyle(scope.layout.text["title-style"], txt);
                }

                if(scope.theme.text.title && scope.theme.text.title.style){
                    applyStyle(scope.theme.text.title.style, txt);
                }

                var subtxt = container
                    .append("text")
                    .style("text-anchor", "middle")
                    .text(subtitle);

                if(scope.layout.text.subtitle){
                    applyAttrs(scope.layout.text.subtitle, subtxt);
                }

                if(scope.layout.text["subtitle-style"]){
                    applyStyle(scope.layout.text["subtitle-style"], subtxt);
                }

                if(scope.theme.text.subtitle && scope.theme.text.subtitle.style){
                    applyStyle(scope.theme.text.subtitle.style, subtxt);
                }


                if(scope.theme.background){

                    if(scope.theme.text.gradient){
                      var gradient = createGradient(parentElement, scope.theme.text.gradient, "textGradient");
                        rect.style('fill', "url(#bkGradient)")
                    };
                    if(scope.theme.text.background){
                        rect.style('fill', scope.theme.text.background)
                    };
                }

                if(scope.theme.text && scope.theme.text.style){
                    applyStyle(scope.theme.text.style, rect);
                }

            }
            

           
            

            scope.$watch(function(){
                return { theme : scope.theme, layout:scope.layout, title:scope.title, zoomfactor : scope.zoomfactor}
            }, function(nv){
                if(!nv.theme || !nv.layout){return }
                drawChart();

            }, true)
        }
    };
}])




.directive('map', ['vectorData', '$q' ,function (vectorData, $q) {
    return {
        restrict: 'A',
        //template : '<rect width="100%" height="100%"></rect>',
        link: function (scope, iElement, iAttrs) {
            var svg = d3.select(iElement.parent()[0]);
            var s =iElement.parent();
            var projection, container;

            var drawChart = function(){
                if(container){
                    container.remove();
                }

                var width = s.width();
                var height = s.height();

                container = d3.select(s[0]).append('svg');
                var rect = container
                    .append('rect')
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .style("fill", "none")


                if(scope.theme.map){

                    if(scope.theme.map.gradient){
                      var gradient = createGradient(s, scope.theme.map.gradient, "mapGradient");
                        rect.style('fill', "url(#mapGradient)")
                    };
                    if(scope.theme.map.background){
                        rect.style('fill', scope.theme.map.background)
                    };

                }

                if(scope.layout.map && scope.layout.map.margin){
                    var margin = scope.layout.map.margin;
                    width = width - (margin.left || 0) - (margin.right || 0);
                    height = height - (margin.top || 0) - (margin.bottom || 0);
                    
                    container
                    .attr("width", width)
                    .attr("height", height)
                    .attr("x", margin.left || 0)
                    .attr("y", margin.top || 0)
                    //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                }

            
                container.empty();
                var promises = [];
                
                var tiler = d3.geo.tile()
                    .size([width, height]);

                projection = d3.geo.mercator()
                    .center([scope.center.x, scope.center.y])
                    .scale((scope.zoomfactor << 21) / 2 / Math.PI)
                    .translate([width / 2, height / 2]);

                var path = d3.geo.path()
                    .projection(projection);

                container.selectAll("g")
                    .data(tiler
                      .scale(projection.scale() * 2 * Math.PI)
                      .translate(projection([0, 0])))
                  .enter().append("g")
                    .each(function(d) {
                        //console.log(d)
                      var g = d3.select(this);
                      var url = "https://vector.mapzen.com/osm/all/" + d[2] + "/" + d[0] + "/" + d[1] + ".topojson?api_key=vector-tiles-LM25tq4";
                      var promise = vectorData.getData(url);
                      promises.push(promise);
                      
                      promise.then(function(data){
                         
                        _.each(layers, function(k){

                            if(!data.objects[k]){
                                return;
                            }
                            if(!data.objects[k].geometries || !data.objects[k].geometries.length){
                                return;
                            }

                            var json = topojson.feature(data, data.objects[k]);

                            var g2 = g.append("g")
                            .attr("class", k);

                            var addTxt = function(){
                                console.log(this)
                            }
                            //console.log(k, json[k])
                            var enterF = g2.selectAll("path")
                            .data(json.features.sort(function(a, b) { return a.properties.sort_key - b.properties.sort_key; }))
                            .enter();

                            
                            var setStyle = function(){
                                var clsp = this.attr("parent-class"); 
                                var cls = this.attr("class");
                                
                                if(scope.theme[clsp]){
                                    applyStyle(scope.theme[clsp], this);
                                }
                                if(scope.theme[cls]){
                                    applyStyle(scope.theme[cls], this);
                                }
                            }
                            var currentPath = enterF
                                .append("path")
                                .attr("class", function(d) { return d.properties.kind; })
                                .attr("parent-class", k)
                                .attr("d", path)
                                .call(setStyle)
                        });
                        
                        
                      });
                    });
                

                $q.all(promises)
                .finally(function(){
                    var rect2 = container
                    .append('rect')
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .style("fill", "none")

                    if(scope.theme.map && scope.theme.map.style){
                        applyStyle(scope.theme.map.style, rect2);
                      
                    }

                });



            };


            scope.$watch(
                function(){
                    return {
                        center : scope.center,
                        zoomfactor : scope.zoomfactor,
                        theme : scope.theme
                    }
                }, 
                function(nv){
                    console.log(1, nv)
                    if(!nv.theme){
                        console.log("exiting")
                        return
                    }
                    
                    drawChart();
                }, 
                true);
            






            
        }
    };
}])



.directive('wallmapMap', ['vectorData', function (vectorData) {
    return {
        restrict: 'A',
        scope : { center : "=", zoomfactor:"=", theme:"="},
        link: function (scope, iElement, iAttrs) {

            var width = iElement.width();
            var height = iElement.height();

            var projection;


            var drawChart = function(){

                var written  ={};

                iElement.empty();
                var tiler = d3.geo.tile()
                .size([width, height]);

                projection = d3.geo.mercator()
                    .center([scope.center.x, scope.center.y])
                    .scale((scope.zoomfactor << 21) / 2 / Math.PI)
                    .translate([width / 2, height / 2]);

                var path = d3.geo.path()
                    .projection(projection);

                var svg = d3.select(iElement[0]).append("svg")

                    .attr("width", width)
                    .attr("height", height);

                

                
                var rect = svg
                    .append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", width)
                    .attr("height", height)

                var container = svg.append("svg")
                    .attr("width", width)
                    .attr("height", height-78);

                if(scope.theme.map){

                    if(scope.theme.map.gradient){
                      var gradient = createGradient(svg, scope.theme.map.gradient, "mapGradient");
                        rect.style('fill', "url(#mapGradient)")
                    };

                    if(scope.theme.map.background){
                        rect.style('background', scope.theme.map.background)
                    };

                }
                

                    
                container.selectAll("g")
                    .data(tiler
                      .scale(projection.scale() * 2 * Math.PI)
                      .translate(projection([0, 0])))
                  .enter().append("g")
                    .each(function(d) {
                        console.log(d)
                      var g = d3.select(this);
                      //d3.json("http://" + ["a", "b", "c"][(d[0] * 31 + d[1]) % 3] + ".tile.openstreetmap.us/vectiles-highroad/" + d[2] + "/" + d[0] + "/" + d[1] + ".json", function(error, json) {
                      var url = "https://vector.mapzen.com/osm/all/" + d[2] + "/" + d[0] + "/" + d[1] + ".topojson?api_key=vector-tiles-LM25tq4";
                      vectorData.getData(url)
                      .then(function(data){
                         
                        _.each(layers, function(k){
                            if(!data.objects[k]){
                                return;
                            }

                            var json = topojson.feature(data, data.objects[k]);

                            var g2 = g.append("g")
                            .attr("class", k);

                            var addTxt = function(){
                                console.log(this)
                            }
                            //console.log(k, json[k])
                            var enterF = g2.selectAll("path")
                            .data(json.features.sort(function(a, b) { return a.properties.sort_key - b.properties.sort_key; }))
                            .enter();

                            
                            var setStyle = function(){
                                var clsp = this.attr("parent-class"); 
                                var cls = this.attr("class");
                                
                                if(scope.theme[clsp]){
                                    applyStyle(scope.theme[clsp], this);
                                }
                                if(scope.theme[cls]){
                                    applyStyle(scope.theme[cls], this);
                                }
                            }
                            var currentPath = enterF
                                .append("path")
                                .attr("class", function(d) { return d.properties.kind; })
                                .attr("parent-class", k)
                                .attr("d", path)
                                .call(setStyle)

                            
                            

                            if(k == 'roads' ){
                                var e = g2.append("defs")
                                .selectAll("path")
                                .data(json.features.sort(function(a, b) { return a.properties.sort_key - b.properties.sort_key; }))
                                    .enter();
                                
                                e
                                    .append("path")
                                    .attr("d", path)
                                    .attr("id", function(o){
                                        return o.properties.id;
                                    })

                                enterF
                                .append("text")
                                    .attr("class", "roadname")
                                  .append("textPath")
                                    .attr("xlink:href", function(o){
                                        return "#"+o.properties.id;
                                    })
                                    .text(function(d){
                                        var candidate = d.properties.name;
                                        if(!written[candidate]){
                                            //written[candidate] = true;
                                            return candidate;
                                        }
                                        return;
                                    });


                            }



                            
                        })
                        
                        
                      });
                    });


            }


            scope.$watch(
                function(){
                    return {
                        center : scope.center,
                        zoomfactor : scope.zoomfactor,
                        theme : scope.theme
                    }
                }, 
                function(nv){
                    if(!nv.theme){
                        return
                    }
                    console.log(1)
                    drawChart();
                }, 
                true);
            
        }
    };
}])


.directive('wallmapTitle', [function () {

    return {
        restrict: 'A',
        scope  : { theme :"=",title : "="},
        link: function (scope, iElement, iAttrs) {

            var width = iElement.width();
            var height = iElement.height();


            var drawChart = function(){
                console.log(100, scope.title)
                iElement.empty();
                var svg = d3.select(iElement[0]).append("svg")

                    .attr("width", width)
                    .attr("height", height);

                var rect = svg
                    .append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", width)
                    .attr("height", height)

                svg.append("text")
                .attr("x", width/2)
                .attr("y", height / 2)
                .attr("class", "titletext")
                .attr("text-anchor", "middle")
                .text(scope.title)

            }

            scope.$watch(
                function(){
                    return {
                        title : scope.title,
                        theme : scope.theme
                    }
                }, 
                function(nv){
                    if(!nv.theme){
                        return
                    }
                    drawChart();
                }, 
                true);
            
        }
    };
}])


    
})();