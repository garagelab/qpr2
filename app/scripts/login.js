define( [ 
    'jquery'
    ,'underscore'
    ], 

/*
 * google account login
 */

function( $, _ ) 
{

'use strict';

var client_id = '879340663479';
//var apikey = 'AIzaSyDWbN3y4LWBSFpVbgk8oFH5oYm0N-RjhK0'; 

var scopes = [
  'https://www.googleapis.com/auth/fusiontables'
  ,'https://www.googleapis.com/auth/plus.me'
];

var Login = function()
{

  var $el = $('#login');
  var $bt = $el.find('button');

  this.init = function()
  {
    auth( true ); 

    //gapi.client.setApiKey( apikey );
    //gapi.load( 'auth', function()
    //{
      //auth( true ); 
    //});
  }

  this.logged = function()
  {
    return !!gapi.auth.getToken();
  }

  function auth( immediate )
  {
    gapi.auth.authorize({
      client_id: client_id
      ,scope: scopes
      ,immediate: immediate
    }
    , auth_callback );
  }

  function auth_callback( res ) 
  {

    if ( res && !res.error ) 
    {
      $bt.hide();
      get_user_data();
    } 

    else 
    {
      $bt.show();
      $bt.on( 'click', function()
      {
        auth( false );
      });
    }
  } 

  function get_user_data()
  {
    var tk = gapi.auth.getToken(); 

    var req = gapi.client.request({
      'path': '/plus/v1/people/me'
      //,'headers': {
        //'Authorization': 
          //'Bearer ' + tk.access_token
      //}
    });

    req.execute( function( res ) 
    {
      $el.append('<img'+
        ' src="' + res.image.url +'"' +
        ' width="24"' +
        '></img>'
      );
    });

    //gapi.client.load('plus', 'v1', function() 
    //{
      //console.log( 'plus api loaded' ); 

      //var req = gapi.client.plus.people.get({
        //'userId': 'me'
      //});

      //req.execute( function( res ) 
      //{
        //console.log('--plus callbak', res);
      //});
    //}); 
  }

}

return Login;

});


