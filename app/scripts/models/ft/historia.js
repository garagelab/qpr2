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

function( $, _, Backbone, Feature, api ) 
{

'use strict';

var Historia_FT = Backbone.Collection.extend({ 

  model: Feature 
  
  ,initialize: function( models, opt ) 
  {
    this.opt = opt;

    this.db = [
      'hid'
      ,'tipo'
      ,'fuente'
      ,'link_id'
      ,'url'
    ];
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

  ,sync: function( method, model, sync_opt )
  {
    var self = this;

    var db = this.db;
    var ftid = this.opt.ftid;
    var hid = this.opt.feature.get('id');

    sync_opt || (sync_opt = {});

    function success( res ) 
    {
      //if ( sync_opt.success ) 
        //sync_opt.success( res );
      self.parse.apply(
        self, [ res, sync_opt ] );
    }

    function error( res ) 
    {
      if ( sync_opt.error ) 
        sync_opt.error( res );
    } 

    var query = [
      'SELECT '
      ,db.join(',')
      ,' FROM '
      ,ftid
      ,' WHERE '
      ,'hid'
      ,' = '
      ,'\''+hid+'\''
    ].join('');

    switch ( method ) 
    {
      case 'read':

      $.ajax({
        url: api.url( query ),
        dataType: 'jsonp',
        success: success 
      });

      //return this.read(model,success,error);

      //case 'create':
      //return this.create(model,success,error);

      //case 'update':
      //return this.update(model,success,error);

      //case 'patch':
      //return this.patch(model,success,error);

      //case 'delete':
      //return this.destroy(model,success,error); 
    }
  }

});

return Historia_FT;

});

