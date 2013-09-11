define( [ 
    'jquery'
    ,'underscore'
    ], 

function( $, _ ) 
{

'use strict';

//'http://nodejs-chparsons.rhcloud.com/jsonp?url='+encodeURIComponent('https://quepasariachuelo.crowdmap.com/api?task=incidents'

var Crowdmap_API = function( opt )
{
  this.options = opt;
};

Crowdmap_API.prototype.read = 
function( model, success, error )
{

  var base_url = this.options.url;
  var params = this.options.read.params;

  var url = [
  //'https://quepasariachuelo.crowdmap.com/api'
    base_url
    ,'/api?'
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

  $.ajax({
    url: url,
    dataType: 'jsonp',
    success: success
  });

  //Architect.jsonp( url, success );
};

return Crowdmap_API;

});

