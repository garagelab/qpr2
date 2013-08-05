define( [ 
    'jquery' 
    ,'underscore'
    ,'backbone'
    ,'models/qpr/feature'
    ],  

function( $, _, Backbone, Feature ) 
{

'use strict';

function Basurales( opt ) 
{
  this.opt = opt;

  this.db = [
    'name'
    ,'geometry'
  ];
}

Basurales.prototype.parse =
function( layer, data, sync_opt )
{
  //console.log( 'basurales.parse', arguments )

  var opt = this.opt;

  var name
    ,geom
    ,coordarr
    ,polyarr
    ,infowin
    ,descripcion;

  var rows = data.rows;
  var i = rows.length;

  var idx = {
    name: this.db.indexOf('name'),
    geom: this.db.indexOf('geometry')
  } 

  while( i-- )
  {
    name = rows[i][ idx.name ];
    geom = rows[i][ idx.geom ].geometry;

    infowin = name;
    descripcion = 'basural ' + name;

    switch ( geom.type )
    {
      case 'Point':

        coordarr = layer
          .reverse_point(
              geom.coordinates) 

        layer.add( new Feature({ 
          id: name
          ,properties: {
            type: opt.name
            ,infowin: infowin
            ,descripcion: descripcion
            ,icon: opt.icon
          }
          ,geometry: {
            type: 'Point'
            ,coordinates: coordarr 
          }
        }) );

        break;

      case 'Polygon':

        polyarr = layer
          .reverse_polygon(
              geom.coordinates[0] );

        layer.add( new Feature({ 
          id: name + _.uniqueId(' polygon ')
          ,properties: {
            type: opt.name
            ,infowin: infowin
            ,descripcion: descripcion
            ,icon: opt.icon
          }
          ,geometry: {
            type: 'Polygon'
            ,coordinates: polyarr
          }
        }) );

        break;

    }
  }
};

return Basurales;

});

