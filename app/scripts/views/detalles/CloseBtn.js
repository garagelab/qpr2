define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'d3'
  ], 

function( $, _, Backbone, d3 ) 
{

'use strict';

var CloseBtn = function(){}

CloseBtn.prototype.appendTo = 
function( $close, csize )
{

  var close = d3
    .select( $close[0] )
    .append( 'svg' )
    .append( 'g' )
    .attr( 'style', 
      'stroke: rgba(0,0,0, 0.5);'+
      'stroke-linecap: "round";'+
      'stroke-width: 1.2;' 
      );

  close.append( 'line' )
    .attr( 'x1', 0 )
    .attr( 'y1', 0 )
    .attr( 'x2', csize )
    .attr( 'y2', csize );

  close.append( 'line' )
    .attr( 'x1', csize )
    .attr( 'y1', 0 )
    .attr( 'x2', 0 )
    .attr( 'y2', csize );
}

return CloseBtn;

});

