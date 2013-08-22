
/*
 * DEPRECADO
 */

define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'models/qpr/feature'
    ,'models/ft/api'
    ], 

/*
 * Historia = Feature Collection
 */

function( $, _, Backbone, Feature, API ) 
{

'use strict';

var Historia_FT = Backbone.Collection.extend({ 

  model: Feature  

  ,initialize: function( models, opt ) 
  {
    this.opt = opt;
    var hid = this.opt.feature.get('id');

    this.db = [
      'hid'
      ,'tipo'
      ,'fuente'
      ,'link_id'
      ,'url'
    ]; 

    var sql = [
      'SELECT '
      ,this.db.join(',')
      ,' FROM '
      ,opt.ftid
      ,' WHERE '
      ,'hid'
      ,' = '
      ,'\''+hid+'\''
    ].join('')

    this.url = [
      'https://www.googleapis.com/fusiontables/v1/query'
      ,'?sql=' + encodeURIComponent( sql )
      ,'&key=' + apikey
      ,'&callback=?'
    ].join(''); 

  }

  ,parse: function( data )
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

      this.add( link_model );
    }

  }

  //,sync: function( method, model, sync_opt )
  //{
    //var self = this;

    //var db = this.db;
    //var ftid = this.opt.ftid;
    //var hid = this.opt.feature.get('id');

    //sync_opt || (sync_opt = {});

    //function success( res ) 
    //{
      //self.parse.apply(
        //self, [ res, sync_opt ] );
      ////if ( sync_opt.success ) 
        ////sync_opt.success( res );
    //}

    //function error( res ) 
    //{
      //if ( sync_opt.error ) 
        //sync_opt.error( res );
    //} 

    //var api = new API({
      //sql: [
        //'SELECT '
        //,db.join(',')
        //,' FROM '
        //,ftid
        //,' WHERE '
        //,'hid'
        //,' = '
        //,'\''+hid+'\''
      //].join('') 
    //});

    //switch ( method ) 
    //{
      //case 'read':
      //return api.read(model,success,error);
    //}
  //}

});

return Historia_FT;

});

