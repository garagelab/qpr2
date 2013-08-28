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

  this.db = function()
  {
    return _.values( _db );
  }

  var _db = {
    name: 'BARRIO'
    ,geom: 'Poligono'
    //,loc: 'center' 
  };

  this.dbi = {};
  var i = 0;
  for ( var k in _db )
    this.dbi[k] = i++;

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
  //var row, i = rows.length;

  //while( i-- )
  function parse( row )
  {
    //row = rows[i];

    //coordarr=(row[this.dbi.loc]).split(' '); 
    geom = row[ this.dbi.geom ].geometry;
    name = row[ this.dbi.name ]; 

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

  utils.process( {
    list: rows
    ,iterator: parse
    ,context: this
  });

};

return Asentamientos;

});

