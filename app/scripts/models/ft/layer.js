define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'models/qpr/feature'
    ,'models/ft/api'
    ], 

/*
 * Layer = Feature Collection
 */

function( $, _, Backbone, Feature, api ) 
{

'use strict';

var Layer_FT = Backbone.Collection.extend({

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

      var query = [
        'SELECT ',
        parser.db.join(','),
        //'*',
        ' FROM ',
        opt.ftid
      ].join('');

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

return Layer_FT;

});

