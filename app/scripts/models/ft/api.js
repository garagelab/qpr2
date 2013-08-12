define( [ 
    'jquery'
    ,'underscore'
    ], 

function( $, _ ) 
{

'use strict';

//sql=SELECT report FROM 1uIgt8vsouqvnDg3TZUFZe4bkMqC1IiM8R006Muw WHERE name = 'Taller Almirante Brown' 

var apikey = 'AIzaSyDGFlbdQqjeLGeLVk_9stEtLOv9hSNN2Sw';

var FT_API = function( opt )
{
  this.options = opt;
};

FT_API.prototype.read = 
function( model, success, error )
{
  var opt = this.options;
  $.ajax({
    url: this.url( opt.ftid, opt.db ),
    dataType: 'jsonp',
    success: success
  });
};

/*
 * params Array
 */
FT_API.prototype.url = 
function( ftid, params )
{
  var query = [
    'SELECT ',
    params.join(','),
    //'*',
    ' FROM ',
    ftid
  ].join('');

  return [
    'https://www.googleapis.com/fusiontables/v1/query',
    '?sql=' + encodeURIComponent(query),
    '&key=' + apikey,
    '&callback=?'
  ].join('');
};

return FT_API;

});

