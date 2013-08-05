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

    ,canvaslayer: {
      exports: 'CanvasLayer'
    }

    ,tipsy: {
      deps: [
        'jquery'
        ]
    }

  },

  paths: {

    text: '../lib/text'
    ,jquery: '../bower_components/jquery/jquery'
    ,backbone: '../bower_components/backbone-amd/backbone'
    ,underscore: '../bower_components/underscore-amd/underscore'

    ,d3: '../bower_components/d3/d3'
    ,parseuri: '../lib/parseuri'
    ,chroma: '../lib/chroma.min'
    ,canvaslayer: '../lib/CanvasLayer'
    ,tipsy: '../lib/jquery.tipsy'
  }

});

require( [ 
    'app'
    ,'parseuri'
    ,'chroma'
    ,'canvaslayer'
    ,'d3'
    ,'tipsy'
    ], 

function( App ) 
{
  new App();
});

