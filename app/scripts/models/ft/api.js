define( [ 
    'jquery'
    ,'underscore'
    ], 

function( $, _ ) 
{

'use strict';

//sql=SELECT report FROM 1uIgt8vsouqvnDg3TZUFZe4bkMqC1IiM8R006Muw WHERE name = 'Taller Almirante Brown' 

var api = {};

var apikey = 'AIzaSyDGFlbdQqjeLGeLVk_9stEtLOv9hSNN2Sw';

api.url = function( query )
{
  return [
    'https://www.googleapis.com/fusiontables/v1/query',
    '?sql=' + encodeURIComponent(query),
    '&key=' + apikey,
    '&callback=?'
  ].join('');
};

return api;

});

