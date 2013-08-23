define( [ 
    'jquery'
    ,'underscore'
    ,'architect'
    ], 

function( $, _, Architect ) 
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

  Architect.jsonp( this.url(), success );

  //$.ajax({
    //url: this.url(),
    //dataType: 'jsonp',
    //success: success
  //});
};

/*
 * params Array
 */
FT_API.prototype.url = 
function()
{
  var sql = this.options.sql;

  return [
    'https://www.googleapis.com/fusiontables/v1/query'
    ,'?sql=' + encodeURIComponent( sql )
    ,'&key=' + apikey
    //,'&callback=?'
  ]
  .join('');

};

return FT_API;

});

