define( [ 
    'jquery' 
    ,'underscore'
    ,'backbone'
    ,'models/qpr/feature'
    ,'models/qpr/layer_utils'
    ],  

function( $, _, Backbone, Feature, LayerUtils ) 
{

'use strict';

function Basurales( opt ) 
{
  _.extend( this, Backbone.Events );

  this.utils = new LayerUtils();

  this.opt = opt;

  this.db = [
    'name'
    ,'geometry'
  ];
}

Basurales.prototype.parse =
function( data, sync_opt )
{
  //console.log( 'basurales.parse', arguments )

  var opt = this.opt;

  var name
    ,geom
    ,coordarr
    ,polyarr
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

    descripcion = 'basural ' + name;

    switch ( geom.type )
    {
      case 'Point':

        coordarr = this.utils
          .reverse_point(
              geom.coordinates) 

        this.trigger('add:feature',new Feature({ 
          id: name
          ,properties: {
            type: opt.name
            ,titulo: name
            ,resumen: descripcion
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

        polyarr = this.utils
          .reverse_polygon(
              geom.coordinates[0] );

        this.trigger('add:feature',new Feature({ 
          id: name + _.uniqueId(' polygon ')
          ,properties: {
            type: opt.name
            ,titulo: name
            ,resumen: descripcion
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

