/*var data = [
  {"year": 1990,    "debt": 25.4},
  {"year": 1991,    "debt": 27.4},
  {"year": 1992,    "debt": 29.4},
  {"year": 1993,    "debt": 31.4},
  {"year": 1994,    "debt": 33.4},
  {"year": 1995,    "debt": 31.4},
  {"year": 1996,    "debt": 29.4},
  {"year": 1997,    "debt": 31.4},
  {"year": 1998,    "debt": 30.4},
  {"year": 1999,    "debt": 31.4},
  {"year": 2000,    "debt": 31.4},
  {"year": 2001,    "debt": 31.4},
  {"year": 2002,    "debt": 32.6},
  {"year": 2003,    "debt": 34.5},
  {"year": 2004,    "debt": 35.5},
  {"year": 2005,    "debt": 35.6},
  {"year": 2006,    "debt": 35.3},
  {"year": 2007,    "debt": 35.2},
  {"year": 2008,    "debt": 39.3},
  {"year": 2009,    "debt": 52.3},
  {"year": 2010,    "debt": 60.9},
  {"year": 2011,    "debt": 65.9},
  {"year": 2012,    "debt": 70.4},
  {"year": 2013,    "debt": 72.6},
  {"year": 2014,    "debt": 74.4},
  {"year": 2015,    "debt": 73.6},
]
*/
//Para cargar JSON en javascript necesita correr en servidor web
/*
$.getJSON("url", function(json) {
  console.log(json); // this will show the info it in firebug console
});

var request = new XMLHttpRequest();
request.open(url, false);
request.send(null)
var my_JSON_object = JSON.parse(request.responseText);
*/


var ƒ = d3.f
var inicio=1997
var ultimoVisible=2002

function grafica(div, dataGraficar){
  console.log(div);console.log(dataGraficar);
  var sel = d3.select(div).html('')
  var c = d3.conventions({
    parentSel: sel, 
    totalWidth: sel.node().offsetWidth, 
    height: 400, 
    margin: {left: 50, right: 50, top: 30, bottom: 30}
  })
  
  c.svg.append('rect').at({width: c.width, height: c.height, opacity: 0})
  
  c.x.domain([inicio, 2018])
  c.y.domain([0, 100])
  
  c.xAxis.ticks(4).tickFormat(ƒ())
  c.yAxis.ticks(5).tickFormat(d => d + '%')
  
  var area = d3.area().x(ƒ('year', c.x)).y0(ƒ('debt', c.y)).y1(c.height)
  var line = d3.area().x(ƒ('year', c.x)).y(ƒ('debt', c.y))
  
  var clipRect = c.svg
    .append('clipPath#clip')
    .append('rect')
    .at({width: c.x(ultimoVisible) - 2, height: c.height})
  
  var correctSel = c.svg.append('g').attr('clip-path', 'url(#clip)')
  
  correctSel.append('path.area').at({d: area(dataGraficar)})
  correctSel.append('path.line').at({d: line(dataGraficar)})
  yourDataSel = c.svg.append('path.your-line')
  
  c.drawAxis()
  
  yourData = dataGraficar
    .map(function(d){ return {year: d.year, debt: d.debt, defined: 0} })
    .filter(function(d){
      if (d.year == ultimoVisible) d.defined = true
      return d.year >= ultimoVisible
    })
  
  var completed = false
  
  var drag = d3.drag()
    .on('drag', function(){
      var pos = d3.mouse(this)
      var year = clamp(inicio, 2018, c.x.invert(pos[0]))
      var debt = clamp(0, c.y.domain()[1], c.y.invert(pos[1]))
  
      yourData.forEach(function(d){
        if (Math.abs(d.year - year) < .5){
          d.debt = debt
          d.defined = true
        }
      })
  
      yourDataSel.at({d: line.defined(ƒ('defined'))(yourData)})
  
      if (!completed && d3.mean(yourData, ƒ('defined')) == 1){
        completed = true
        clipRect.transition().duration(1000).attr('width', c.x(2018))
      }
    })
  
  c.svg.call(drag)
  
  
  
  function clamp(a, b, c){ return Math.max(a, Math.min(b, c)) }
}

