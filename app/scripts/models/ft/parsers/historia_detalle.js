define( [ 
    'jquery' 
    ,'underscore'
    ,'backbone'
    ,'models/qpr/Feature'
    ,'models/qpr/FeatureHistoria'
    ,'utils'
    ], 

function( $, _, Backbone, 
  Feature, FeatureHistoria, utils ) 
{

'use strict';

function HistoriaDetalle( opt ) 
{
  _.extend( this, Backbone.Events );

  this.opt = opt;

  this.db = function()
  {
    return _db;
  }

  var _db = [
    'hid'
    ,'tipo'
    ,'link_id'
    ,'fecha'
  ];

}

HistoriaDetalle.prototype.parse =
function( data, sync_opt )
{
  var db = this.db();
  var layers = this.opt.layers;

  var format = d3.time.format("%Y-%m-%d");

  //console.log( 'historia parse', data,
      //'layers', layers);

  var j, idx;

  var link, layer_coll, link_feature, date;

  var rows = data.rows;

  // no llego ningun link para esta historia
  if ( ! rows )
  {
    console.warn('la historia con data', data, 'no tiene links');
    return;
  }

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

    //console.log( 'link', link );
    //console.log(
        //'\t layer model', 
        //layers[ link.tipo ] );

    layer_coll = layers[ link.tipo ].model;
    if ( ! layer_coll )
      continue;
      //return; 

    // un layer es una collection
    // de feature/models
    // => podemos hacer get() x id
    // del link model
    link_feature = layer_coll.get(link.link_id);

    //console.log( '\t feature', link_feature );

    if ( ! link_feature )
      continue;
      //return; 

    //this.trigger('add:feature', link_feature); 

    date = link.fecha;

    this.trigger('add:feature_historia',
        new FeatureHistoria({
          feature: link_feature
          ,date: {
            iso: format.parse(date).toISOString()
            ,src: date
          }
        }) ); 
  }

  //utils.process( rows, parse, null, this );
};

return HistoriaDetalle;

});

