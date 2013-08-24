define( [ 
    'jquery' 
    ,'underscore'
    ,'backbone'
    ,'models/qpr/feature'
    ,'utils'
    ], 

function( $, _, Backbone, Feature, utils ) 
{

'use strict';

function Asentamientos( opt ) 
{
  _.extend( this, Backbone.Events );

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

  var idx = {
    name: this.db.indexOf('BARRIO'),
    //loc: this.db.indexOf('center'),
    geom: this.db.indexOf('Poligono')
  }

  var rows = data.rows;
  //var row, i = rows.length;

  //while( i-- )
  function parse( row )
  {
    //row = rows[i];

    //coordarr = (row[idx.loc]).split(' '); 
    geom = row[ idx.geom ].geometry;
    name = row[ idx.name ]; 

    //console.log(name,row)

    if ( _.isEmpty(geom) 
        || geom.type !== 'Polygon' )
      //continue;
      return;

    descripcion = 'asentamiento ' + name;

    polyarr = utils
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

    coordarr = utils
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

  utils.process( rows, parse, null, this );

};

return Asentamientos;

});

