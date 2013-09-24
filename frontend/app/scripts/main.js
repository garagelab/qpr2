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

    ,leaflet: {
      exports: 'L'
    }

    ,leaflet_google: {
      deps: [ 'leaflet' ]
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

    ,selectize: {
      deps: [ 'jquery','sifter','microplugin' ]
    }

  },

  paths: {

    text: '../lib/text'
    ,jquery: '../bower_components/jquery/jquery'
    ,backbone: '../bower_components/backbone-amd/backbone'
    ,underscore: '../bower_components/underscore-amd/underscore'

    ,markerclusterer: '../lib/gmaps/markerclusterer_packed'
    ,g_point_in_polygon: '../lib/gmaps/maps.google.polygon.containsLatLng'
    ,canvaslayer: '../lib/gmaps/CanvasLayer'
    //,infobox: '../lib/gmaps/infobox_packed'
    //,leaflet: '../lib/leaflet/leaflet'
    //,leaflet_google: '../lib/leaflet/Google'

    ,d3: '../bower_components/d3/d3'
    ,parseuri: '../lib/parseuri'
    ,chroma: '../lib/chroma.min'
    //,architect: '../lib/architect/architect.min'

    ,'eventEmitter/EventEmitter': '../lib/eventemitter'
    ,'eventie/eventie': '../lib/eventie'
    ,imagesloaded: '../lib/imagesloaded'
    ,qtip2: '../lib/jquery.qtip.min'
    ,tipsy: '../lib/jquery.tipsy'

    ,spin: '../bower_components/spin.js/spin'

    ,sifter: '../bower_components/sifter/sifter'
    ,microplugin: '../bower_components/microplugin/src/microplugin'
    ,selectize: '../bower_components/selectize/dist/js/selectize'
  }

});

require( [ 
    'app'
    ,'selectize'
    //,'architect'
    //,'qtip2'
    //,'tipsy'
    ], 

function( App ) 
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

