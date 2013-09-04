define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'chroma'
  ], 

/*
 * mapa layer:hex
 */

function( $, _, Backbone, chroma ) 
{

'use strict';

var LayerColors = function()
{

  this._colores = {

    "historias": "#20B2AA" 

    ,"alertas": "#5F9EA0" 
    ,"noticias": "#5F9EA0" 
    ,"acciones": "#5F9EA0" 
    ,"documentos": "#A9A9A9" 
    ,"normativas": "#A9A9A9" 

    ,"industrias": "#cc0000"  
    ,"basurales": "#f24000" 
    ,"asentamientos": "#FFA500" 
    ,"ecopuntos": "#3CB371" 
    ,"subcuencas": "#20B2AA" 

  };

  //,"industrias": "#B22222"  
  //,"basurales": "#FF8C00" 
  //,"basurales": "#FF4500" 
  //,"asentamientos": "#DAA520" 

  //var colores = {
    //historias: 
      //chroma.color( 240, 140, 0 ).hex()
  //};

  //// escala

  //var carr = [

    ////'historias'
    //'acciones'
    //,'alertas'
    //,'noticias'
    //,'documentos'
    //,'normativas'

    //,'industrias'
    //,'basurales'
    //,'ecopuntos'
    //,'asentamientos'
    //,'subcuencas'
  //];

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

  //return colores;

}

LayerColors.prototype.get = function( key )
{
  return this._colores[ key ];
}

LayerColors.prototype.add_css = function()
{
  var colores = this._colores;

  var _css = [ '<style type="text/css">' ];

  for ( var k in colores )
  {
    //var crgb = cscale(c).rgb().join(); 
    var crgb = chroma
      .color( colores[k] ).rgb().join();

    var sel = [
      '.infowin .'+k 
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
      ,'font-weight: bold;'
      ,'background-color:'
      ,'rgba( '+crgb+', 1.0 );'
      ,'}'
    ].join(''));

  }

  _css.push( '</style>' );
  $('head').append( _css.join('') );
}

return LayerColors;

});


