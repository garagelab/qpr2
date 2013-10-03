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

function Ecopuntos( opt ) 
{
  _.extend( this, Backbone.Events );

  this.opt = opt;

  this.db = function()
  {
    return _.values( _db );
  }

  this.filters = function() { return ''; }

  var _db = {
    name: 'name'
    ,geom: 'geometry'
    ,descripcion: 'description'
    ,estado: 'estado_mayo_2013'
  };

  this.dbi = {};
  var i = 0;
  for ( var k in _db )
    this.dbi[k] = i++;

}

Ecopuntos.prototype.parse =
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
  //var row, i = rows.length;

  //while( i-- )
  function parse( row )
  {
    //row = rows[i];

    name = row[ this.dbi.name ];
    geom = row[ this.dbi.geom ].geometry;

    descripcion = 
      row[ this.dbi.estado ] + ' ' +
      row[ this.dbi.descripcion ];

    switch ( geom.type )
    {
      case 'Point':

        coordarr = utils
          .reverse_point(
              geom.coordinates) 

        this.trigger('add:feature',new Feature({ 
          id: name
          ,properties: {
            id: name
            ,type: opt.name
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

        polyarr = utils
          .reverse_polygon(
              geom.coordinates[0] );

        var id = name + _.uniqueId(' polygon ');
        this.trigger('add:feature',new Feature({ 
          id: id
          ,properties: {
            id: id
            ,type: opt.name
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

return Ecopuntos;

});

