define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ], 

function( $, _, Backbone ) 
{

'use strict';

var Collection = Backbone.Collection.extend({

  initialize: function( models, opt ) 
  {
    this.opt = opt;
  }

  ,sync: function( method, model, sync_opt )
  {
    //console.log('Collection sync',arguments)

    var self = this;
    var opt = this.opt;

    var api = opt.api;
    var parser = opt.parser;

    //sync_opt || (sync_opt = {});

    function success( res ) 
    {
      parser.parse.apply(
        parser, [ res, sync_opt ] );

      //if ( sync_opt.success ) 
        //sync_opt.success( res );

      self.trigger('sync', self, res, sync_opt);
    }

    function error( res ) 
    {
      if ( sync_opt.error ) 
        sync_opt.error( res );
    }  

    switch ( method ) 
    {
      case 'read':
      return api.read(model, success, error);

      case 'create':
      return api.create(model,success,error);

      case 'update':
      return api.update(model,success,error);

      case 'patch':
      return api.patch(model,success,error);

      case 'delete':
      return api.destroy(model,success,error); 
    }
  } 

});

return Collection;

});

