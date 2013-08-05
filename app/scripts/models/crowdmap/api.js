define( [ 
    'jquery'
    ,'underscore'
    ], 

function( $, _ ) 
{

'use strict';

//'http://nodejs-chparsons.rhcloud.com/jsonp?url='+encodeURIComponent('https://quepasariachuelo.crowdmap.com/api?task=incidents'

var api = {};

api.url = function( params )
{

  return [
    'https://quepasariachuelo.crowdmap.com/api?'
    ,$.param( params )
    ,'&resp=jsonp'
    ,'&callback=?'
  ]
  .join('');

  //var q = [
    //'https://quepasariachuelo.crowdmap.com/api'
    //,'?', $.param( params )
  //]
  //.join('');

  //return [
    //'http://nodejs-chparsons.rhcloud.com/jsonp'
    //,'?url=' + encodeURIComponent( q )
    //,'&callback=?'
  //]
  //.join('');

};

return api;

});

