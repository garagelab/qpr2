define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'models/qpr/feature'
    ], 

/*
 * Layer = Feature Collection
 */

function( $, _, Backbone, Feature ) 
{

'use strict';

var Layer = Backbone.Collection.extend({

  model: Feature

  ,initialize: function( models, opt ) 
  {
    this.opt = opt;
    //var self = this;
    //this.url = opt.api.url();
    //this.parse = function( data, sync_opt )
    //{
      //opt.parser.parse( data, sync_opt );
    //}
    //opt.parser.on( 'add:feature', function(f)
    //{
      //self.add( f );
    //});
  }

  ,sync: function( method, model, sync_opt )
  {
    var self = this;
    var opt = this.opt;

    var api = opt.api;
    var parser = opt.parser;

    //console.log(this.opt.name,'sync',arguments)

    sync_opt || (sync_opt = {});

    function success( res ) 
    {
      parser.parse.apply(
        parser, [ self, res, sync_opt ] );
      //if ( sync_opt.success ) 
        //sync_opt.success( res );
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

  ,reverse_point: function( coords )
  {
    return [ coords[1], coords[0] ];
  }

  ,reverse_polygon: function( coords )
  {
    var i = coords.length;
    var coords2 = [];
    while( i-- )
      coords2[i] = [ coords[i][1],coords[i][0] ];
    return coords2;
  }

  ,get_polygon_center: function( coords )
  {
    var len = coords.length;
    var i = len;
    var avg = [ 0,0 ];

    while( i-- )
    {
      avg[0] += coords[i][0];
      avg[1] += coords[i][1];
    }

    avg[0] /= len;
    avg[1] /= len;

    return avg;

    //var bounds=new google.maps.LatLngBounds();
    //var i = coords.length;
    //while( i-- )
      //bounds.extend(
        //new google.maps.LatLng(
          //coords[i][0], coords[i][1] ) );
    //var ctr = bounds.getCenter();
    //return [ ctr.lat(), ctr.lng() ];
  }

});

return Layer;

});

