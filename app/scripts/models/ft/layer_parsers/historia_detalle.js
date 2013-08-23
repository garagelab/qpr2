define( [ 
    'jquery' 
    ,'underscore'
    ,'backbone'
    ,'models/qpr/feature'
    ], 

function( $, _, Backbone, Feature ) 
{

'use strict';

function HistoriaDetalle( opt ) 
{
  _.extend( this, Backbone.Events );

  this.opt = opt;

  this.db = [
    'hid'
    ,'tipo'
    ,'fuente'
    ,'link_id'
    ,'url'
  ];

}

HistoriaDetalle.prototype.parse =
function( data, sync_opt )
{
  //console.log( 'historia parse', data );

  var db = this.db;
  var layers = this.opt.layers;
  
  var rows = data.rows;
  var i = rows.length;

  var j, idx;

  var link, layer, link_model;

  var _data = [];

  while( i-- )
  {
    j = db.length;
    link = {};
    while( j-- ) 
    {
      idx = db.indexOf( db[j] );
      link[ db[j] ] = rows[i][ idx ];
    }
    _data.push( link );

    //console.log( 'link', link );
    //console.log(
        //'\t collection', 
        //layers[ link.tipo ] );

    layer = layers[ link.tipo ]; 
    if ( ! layer )
      continue;

    // un layer es una collection
    // de feature/models
    // => podemos hacer get() x id
    // del link model
    link_model = layer.get( link.link_id );

    //console.log( '\t model', link_model );

    if ( ! link_model )
      continue;

    this.trigger( 'add:feature', link_model ); 
  }
};

return HistoriaDetalle;

});

