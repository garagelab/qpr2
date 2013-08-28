define( [ 
    'jquery'
    ,'underscore'
    ], 

function( $, _ ) 
{

'use strict';

return {

  process: function( opt )
  { 

    var arr = opt.list;
    var fn = opt.iterator;
    var cb = opt.callback;
    var ctx = opt.context;
    var chunks = opt.chunks || 10;

    var delay = 0;
    var cpy = arr.concat();

    setTimeout( function iteration() 
    { 

      var i = chunks + 0;
      while( i-- )
      {

        fn.apply( ctx, [ cpy.shift() ] );

        if ( cpy.length == 0 )
        {
          if ( cb ) cb( arr );
          return;
        }
      }

      setTimeout( iteration, delay );

    }
    , delay );
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
      coords2[i] = [ 
        coords[i][1], coords[i][0] 
      ];
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

};

});

