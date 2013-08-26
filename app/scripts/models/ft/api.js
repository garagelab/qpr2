define( [ 
    'jquery'
    ,'underscore'
    ], 

function( $, _ ) 
{

'use strict';

var apikey = 'AIzaSyDGFlbdQqjeLGeLVk_9stEtLOv9hSNN2Sw';

var FT_API = function( opt )
{
  this.options = opt;
};

FT_API.prototype.create = 
function( model, success, error )
{

  console.log( 'ft create' ); 

  var ftid = '1uIgt8vsouqvnDg3TZUFZe4bkMqC1IiM8R006Muw';

  var data = {
    hid: "'4'"
    ,tipo: "'industrias'"
    ,link_id: "'1002553'"
  };

  var keys = [], vals = [];
  for ( var k in data )
  {
    keys.push( k );
    vals.push( data[k] );
  }

  gapi.client.request({
    path: '/fusiontables/v1/query'
    ,method: 'POST'
    ,params: {
      sql: [
        'INSERT INTO '
        ,ftid
        ,' (' + keys.join(',') + ') '
        ,'VALUES'
        ,' (' + vals.join(',') + ')'
      ]
      .join('')
    }
    //,headers: {
      //'Authorization': 
        //'Bearer ' + tk.access_token
    //}
    ,callback: function( res ) 
    {
      console.log( 'ft create res', res ); 
    }
  });

};

FT_API.prototype.read = 
function( model, success, error )
{

  var sql = this.options.read.params.sql;

  var url = [
    'https://www.googleapis.com/fusiontables/v1/query'
    ,'?sql=' + encodeURIComponent( sql )
    ,'&key=' + apikey
    ,'&callback=?'
  ]
  .join('');

  $.ajax({
    url: url,
    dataType: 'jsonp',
    success: success
  });

  //Architect.jsonp( url, success );
}; 

return FT_API;

});

