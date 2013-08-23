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

function Asentamientos( opt ) 
{
  _.extend( this, Backbone.Events );

  this.utils = new LayerUtils();

  this.opt = opt;

  this.db = [
    'BARRIO'
    //,'center'
    ,'Poligono'
  ];
}

Asentamientos.prototype.parse =
function( data, sync_opt )
{
  //console.log('asentamientos.parse',arguments)

  var opt = this.opt;

  var coordarr
    ,polyarr
    ,geom
    ,name
    ,descripcion;

  var rows = data.rows;
  var i = rows.length;

  var idx = {
    name: this.db.indexOf('BARRIO'),
    //loc: this.db.indexOf('center'),
    geom: this.db.indexOf('Poligono')
  }

  while( i-- )
  {
    //coordarr = (rows[i][idx.loc]).split(' '); 
    geom = rows[i][ idx.geom ].geometry;
    name = rows[i][ idx.name ]; 

    //console.log(name,rows[i])

    if ( _.isEmpty(geom) 
        || geom.type !== 'Polygon' )
      continue;

    descripcion = 'asentamiento ' + name;

    polyarr = this.utils
      .reverse_polygon( 
          geom.coordinates[0] );

    this.trigger('add:feature', new Feature({ 
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

    coordarr = this.utils
      .get_polygon_center( 
          polyarr );

    this.trigger('add:feature', new Feature({ 
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

  }
};

return Asentamientos;

});

