/*global require*/
'use strict';

require.config({

  shim: {

    underscore: {
      exports: '_'
    }

    ,backbone: {
      deps: [
        'underscore',
        'jquery'
      ],
      exports: 'Backbone'
    }

    ,d3: {
      exports: 'd3'
    }

    ,parseuri: {
      exports: 'parseUri'
    }

    ,chroma: {
      exports: 'chroma'
    }

    //,markerclusterer: {
      //exports: 'MarkerClusterer'
    //}

    //,canvaslayer: {
      //exports: 'CanvasLayer'
    //}

    //,architect: {
      //exports: 'Architect'
    //}

    ,tipsy: {
      deps: [ 'jquery' ]
    }

    ,qtip2: {
      deps: [ 'jquery','imagesloaded' ]
    }
    ,imagesloaded: {
      deps: [ 
        'jquery'
        ,'eventEmitter/EventEmitter'
        ,'eventie/eventie' 
      ]
    }

  },

  paths: {

    text: '../lib/text'
    ,jquery: '../bower_components/jquery/jquery'
    ,backbone: '../bower_components/backbone-amd/backbone'
    ,underscore: '../bower_components/underscore-amd/underscore'

    ,markerclusterer: '../lib/markerclusterer_packed'
    ,d3: '../bower_components/d3/d3'
    ,parseuri: '../lib/parseuri'
    ,chroma: '../lib/chroma.min'
    ,canvaslayer: '../lib/CanvasLayer'
    //,architect: '../lib/architect/architect.min'

    ,'eventEmitter/EventEmitter': '../lib/eventemitter'
    ,'eventie/eventie': '../lib/eventie'
    ,imagesloaded: '../lib/imagesloaded'
    ,qtip2: '../lib/jquery.qtip.min'
    ,tipsy: '../lib/jquery.tipsy'
    //,spin: '../bower_components/spin.js/spin'
  }

});

require( [ 
    'app'
    ,'user'
    ,'views/gmaps/gmap_view'
    //,'architect'
    //,'qtip2'
    //,'tipsy'
    ], 

function( App, User, GMapView ) 
{

  //Architect.setupWorkersPath('lib/architect');

  new App();

  //(function next( seq )
  //{
    //console.log('next',seq)
    //if ( seq.length > 0 )
      //seq.shift()( function() 
      //{ 
        //next( seq ); 
      //});
  //})
  //([
    //GMapView.load_api
    //,User.load_api
    //, function()
    //{
      //new App();
    //}
  //]);

  //$.getJSON( 'config.json', 
    //function( config ) {
      //new App( config );
    //});

});

