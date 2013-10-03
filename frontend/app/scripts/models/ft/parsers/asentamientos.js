define( [ 
    'jquery' 
    ,'underscore'
    ,'backbone'
    ,'lang','config','utils'
    ,'models/qpr/Feature'
    ], 

function( $, _, Backbone, 
  lang, config, utils, Feature ) 
{

'use strict';

function Asentamientos( opt ) 
{
  _.extend( this, Backbone.Events );

  this.opt = opt;

  this.db = function()
  {
    return _.values( this._db );
  }

  this.filters = function() { return ''; }

  this._db = {
    barrio: 'BARRIO'
    ,geom: 'Poligono'
    ,partido: 'PARTIDO'
    ,localidad: 'LOCALIDAD'
    ,flias: '\'NRO DE FLIAS\''
    ,inicio: '\'AÑO DE CONFORMACIÓN DEL BARRIO\''
    ,otra_denominacion: '\'OTRA DENOMINACIÓN\''
    //,red_cloacal: '\'RED CLOACAL\''
  };

}

Asentamientos.prototype.parse =
function( data, sync_opt )
{
  //console.log('asentamientos.parse',arguments)

  var opt = this.opt;

  var d, _db = _.keys( this._db );

  var resumen
    ,descripcion
    ,locacion
    ,coordarr
    ,polyarr
    ,geom;

  var rows = data.rows;
  //var row, i = rows.length;

  //while( i-- )
  function parse( row )
  {
    //row = rows[i];

    d = _.object( _db, row );

    geom = d.geom.geometry;

    //console.log(name,row)

    if ( _.isEmpty( geom )
        || geom.type !== 'Polygon' )
      //continue;
      return;

    polyarr = utils
      .reverse_polygon( 
          geom.coordinates[0] );

    coordarr = utils
      .get_polygon_center( 
          polyarr );

    // checkear que el feature este
    // dentro del poly en cuestion
    if ( ! utils.point_in_polygon( 
          coordarr, config.polygon ) )
      return;

    resumen = [
      ,lang('asentamientos_cant_flias')
      ,d.flias
      ,', '
      ,lang('asentamientos_anio')
      ,d.inicio
    ]
    .join('');

    descripcion = [

      '<div>'
      ,lang('asentamientos_cant_flias')
      ,d.flias
      ,'</div>'

      ,'<div>'
      ,lang('asentamientos_anio')
      ,d.inicio
      ,'</div>'

      ,'<div>'
      ,lang('asentamientos_otra_denom')
      ,d.otra_denominacion
      ,'</div>'

      ,'<div>'
      ,lang('asentamientos_fecha_relev')
      ,'</div>'

      //,'<div>'
      //,lang('asentamientos_red_cloacal')
      //,d.red_cloacal
      //,'</div>'

    ]
    .join('');

    locacion = d.localidad + ', ' + d.partido; 

    var id = d.barrio + _.uniqueId('_polygon');

    this.trigger('add:feature', new Feature({ 
      id: id
      ,properties: {
        id: id
        ,type: opt.name
        ,titulo: d.barrio
        ,resumen: resumen
        ,descripcion: descripcion
        ,icon: opt.icon
        ,locacion: locacion
      }
      ,geometry: {
        type: 'Polygon'
        ,coordinates: polyarr
      }
    }) ); 

    this.trigger('add:feature', new Feature({ 
      id: d.barrio
      ,properties: {
        id: d.barrio
        ,type: opt.name
        ,titulo: d.barrio
        ,resumen: resumen
        ,descripcion: descripcion
        ,icon: opt.icon
        ,locacion: locacion
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
    ,callback: function()
    {
      this.trigger( 'complete' );
    }
  });

};

return Asentamientos;

});

