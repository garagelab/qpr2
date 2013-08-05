define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'models/qpr/feature'
    ,'models/crowdmap/api'
    ], 

/*
 * Layer = Feature Collection
 */

function( $, _, Backbone, Feature, api ) 
{

'use strict';

var Layer_Crowdmap = Backbone.Collection.extend({

  model: Feature

  ,initialize: function( models, opt ) 
  {
    this.opt = opt;
  }

  ,sync: function( method, model, sync_opt )
  {
    var self = this;
    var opt = this.opt;
    var parser = opt.parser;

    //console.log(this.opt.name,'sync',arguments)

    sync_opt || (sync_opt = {});

    function success( res ) 
    {
      //if ( sync_opt.success ) 
        //sync_opt.success( res );
      parser.parse.apply(
        parser, [ self, res, sync_opt ] );
    }

    function error( res ) 
    {
      if ( sync_opt.error ) 
        sync_opt.error( res );
    }  

    switch ( method ) 
    {
      case 'read':

      $.ajax({
        url: api.url( parser.db ),
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

return Layer_Crowdmap;

});

