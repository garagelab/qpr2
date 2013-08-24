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
  var db = this.db;
  var layers_models = this.opt.layers_models;

  //console.log( 'historia parse', data,
      //'layers_models', layers_models);
  
  var j, idx;

  var link, layer_model, link_feature;

  var _data = [];

  var rows = data.rows;
  var row, i = rows.length;

  while( i-- )
  //function parse( row )
  {
    row = rows[i];

    j = db.length;
    link = {};
    while( j-- ) 
    {
      idx = db.indexOf( db[j] );
      link[ db[j] ] = row[ idx ];
    }
    _data.push( link );

    //console.log( 'link', link );
    //console.log(
        //'\t layer model', 
        //layers_models[ link.tipo ] );

    layer_model = layers_models[ link.tipo ]; 
    if ( ! layer_model )
      continue;
      //return; 

    // un layer es una collection
    // de feature/models
    // => podemos hacer get() x id
    // del link model
    link_feature = layer_model.get(link.link_id);

    //console.log( '\t feature', link_feature );

    if ( ! link_feature )
      continue;
      //return; 

    this.trigger('add:feature', link_feature); 
  }

  //utils.process( rows, parse, null, this );
};

return HistoriaDetalle;

});

