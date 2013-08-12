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
  var opt = this.options;
  $.ajax({
    url: this.url( opt.url, opt.db ),
    dataType: 'jsonp',
    success: success
  });
};

/*
 * params Object
 */
Crowdmap_API.prototype.url = 
function( base_url, params )
{
  return [
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

};

return Crowdmap_API;

});

