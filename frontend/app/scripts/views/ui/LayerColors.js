define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'chroma'
  ], 

function( $, _, Backbone, chroma ) 
{

'use strict';

var LayerColors = function()
{

  ////chroma.brewer.RdYlBu
  //var cscale = chroma
    //.scale('RdYlBu')
    ////.scale('Set1')
    ////.scale('Accent')
    ////.scale('Dark2')
    //.domain([ 0, carr.length-1 ]); 

  //for ( var c = 0; c < carr.length; c++ )
  //{
    //colores[ carr[c] ] = cscale(c).hex();
  //} 

}

LayerColors.prototype.add_css = function(layers)
{
  var _css = [ '<style type="text/css">' ];

  _.each( layers, function( layer )
  {
    var k = layer.name;
    //var crgb = cscale(c).rgb().join(); 
    var crgb = chroma
      .color( layer.view.color ).rgb().join();

    var sel = [
      '.layer-color.'+k 
      ,'.layer.'+k 
    ]
    .join(',');

    _css.push( [
      sel
      ,'{'
      ,'background-color:'
      ,'rgba( '+crgb+', 0.8 );'
      ,'}'
    ].join(''));

    _css.push( [
      sel+':hover'
      ,'{'
      ,'background-color:'
      ,'rgba( '+crgb+', 0.6 );'
      ,'}'
    ].join(''));

    _css.push( [
      sel+'.visible'
      ,'{'
      ,'background-color:'
      ,'rgba( '+crgb+', 1.0 );'
      ,'}'
    ].join(''));

  });

  _css.push( '</style>' );
  $('head').append( _css.join('') );

  return this;
}

return LayerColors;

});


