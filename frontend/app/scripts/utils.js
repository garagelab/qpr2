define( [ 
    'jquery'
    ,'underscore'
    ,'g_point_in_polygon'
    ], 

function( $, _ ) 
{

'use strict';

return {

  // tiempo

  date_iso2arg: function( iso )
  {
    var _d = new Date( iso );
    return [
      _d.getUTCDate()
      ,'/'
      ,_d.getUTCMonth() + 1
      ,'/'
      ,_d.getUTCFullYear()
    ]
    .join('');
  } 

  // geo

  ,point_in_polygon: function( pt, poly )
  {
    var p = this.point_in_polygon._poly 
      || new google.maps.Polygon();
    p.setPaths( this.pts2latlng( poly ) );
    return p.containsLatLng( pt[0], pt[1] );
  }

  ,pts2latlng: function( arr ) 
  {
    return _.map( arr, function( pt )
    {
      return new google.maps.LatLng(
        pt[ 0 ], pt[ 1 ] );
    });
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

  // misc

  ,lerp2d: function( x, x1, x2, y1, y2 )
  {
    return (x-x1) / (x2-x1) * (y2-y1) + y1;
  }

  ,capitalize: function( str )
  {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  ,process: function( opt )
  { 

    var arr = opt.list;
    var fn = opt.iterator;
    var cb = opt.callback;
    var ctx = opt.context;
    var chunks = opt.chunks || 5;

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
          if ( _.isFunction( cb ) )
            cb.apply( ctx, [ arr ] );
          return;
        }
      }

      setTimeout( iteration, delay );

    }
    , delay );
  }

};

});

