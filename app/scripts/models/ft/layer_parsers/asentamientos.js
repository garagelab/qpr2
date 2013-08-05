define( [ 
    'jquery' 
    ,'underscore'
    ,'backbone'
    ,'models/qpr/feature'
    ], 

function( $, _, Backbone, Feature ) 
{

'use strict';

function Asentamientos( opt ) 
{
  this.opt = opt;

  this.db = [
    'BARRIO'
    //,'center'
    ,'Poligono'
  ];
}

Asentamientos.prototype.parse =
function( layer, data, sync_opt )
{
  //console.log('asentamientos.parse',arguments)

  var opt = this.opt;

  var coordarr
    ,polyarr
    ,geom
    ,name
    ,infowin
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

    infowin = name;
    descripcion = name;

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

    coordarr = layer
      .get_polygon_center( 
          polyarr );

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

  }
};

return Asentamientos;

});

