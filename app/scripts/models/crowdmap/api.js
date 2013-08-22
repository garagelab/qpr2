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
  $.ajax({
    url: this.url(),
    dataType: 'jsonp',
    success: success
  });
};

Crowdmap_API.prototype.url = function()
{
  var base_url = this.options.url;
  var query = this.options.db;

  return [
    //'https://quepasariachuelo.crowdmap.com/api'
    base_url
    ,'/api?'
    ,$.param( query )
    ,'&resp=jsonp'
    ,'&callback=?'
  ]
  .join('');

  //var q = [
  //'https://quepasariachuelo.crowdmap.com/api'
  //,'?', $.param( query )
  //]
  //.join('');

  //return [
  //'http://nodejs-chparsons.rhcloud.com/jsonp'
  //,'?url=' + encodeURIComponent( q )
  //,'&callback=?'
  //]
  //.join('');

};

return Crowdmap_API;

});

