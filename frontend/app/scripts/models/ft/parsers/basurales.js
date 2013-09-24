define( [ 
    'jquery' 
    ,'underscore'
    ,'backbone'
    ,'models/qpr/Feature'
    ,'utils'
    ],  

function( $, _, Backbone, Feature, utils ) 
{

'use strict';

function Basurales( opt ) 
{
  _.extend( this, Backbone.Events );

  this.opt = opt;

  this.db = function()
  {
    return _db;
  }

  this.filters = function() { return ''; }

  var _db = [
    'name'
    //description tiene el nombre del basural
    //en los poligonos (name en polis es area)
    ,'description'
    ,'geometry'

    ////direccion
    //,'direccion'
    //,'localidad_barrio'
    //,'municipio'

    ////extras
    //,'estado_actual'
    //,'CARACTERISTICAS'
    //,'clasificacion'
    //,'OBSERVACION'
  ];

}

Basurales.prototype.parse =
function( data, sync_opt )
{
  //console.log( 'basurales.parse', arguments )

  var opt = this.opt;

  var geom
    //,resumen
    ,descripcion
    ,coordarr
    ,polyarr;

  var d, db = this.db();

  var rows = data.rows;
  //var row, i = rows.length;

  //while( i-- )
  function parse( row )
  {
    //row = rows[i];

    d = _.object( db, row );

    if ( ! _.isObject( d.geometry ) )
    {
      console.warn( 'basural sin geometria', d.name, d.description );
      return;
    }

    geom = d.geometry.geometry;

    //resumen = _.filter([
        //,d.direccion
        //,d.localidad_barrio
        //,d.municipio
      //]
      //,function( str ) {
        //return !_.isEmpty( str.replace(/ /g,'') );
      //})
      //.join(', ');

    descripcion = [
      // TODO fecha hardcodeada
      '<div>'
      ,'Fuente: Coordinación Acumar: GIRS/CPPF – Fecha actualización: 03/05/2013'
      ,'</div>'
    ]
    .join('');

    switch ( geom.type )
    {
      case 'Point':

        coordarr = utils
          .reverse_point(
              geom.coordinates) 

        this.trigger('add:feature',new Feature({ 
          id: d.name
          ,properties: {
            id: d.name
            ,type: opt.name
            ,titulo: d.name
            //,resumen: resumen
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

        polyarr = utils
          .reverse_polygon(
              geom.coordinates[0] );

        var id = d.description + _.uniqueId('_polygon');
        this.trigger('add:feature',new Feature({ 
          id: id
          ,properties: {
            id: id
            ,type: opt.name
            ,titulo: d.description
            //,resumen: resumen
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

return Basurales;

});

