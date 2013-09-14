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

    ,selectize: {
      deps: [ 'jquery','sifter','microplugin' ]
    }

  },

  paths: {

    text: '../lib/text'
    ,jquery: '../bower_components/jquery/jquery'
    ,backbone: '../bower_components/backbone-amd/backbone'
    ,underscore: '../bower_components/underscore-amd/underscore'

    ,markerclusterer: '../lib/markerclusterer_packed'
    ,infobox: '../lib/infobox_packed'
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

    ,sifter: '../bower_components/sifter/sifter'
    ,microplugin: '../bower_components/microplugin/src/microplugin'
    ,selectize: '../bower_components/selectize/dist/js/selectize'
  }

});

require( [ 
    'app'
    ,'views/ui/LayerColors'
    //,'user'
    //,'views/gmaps/gmap_view'
    ,'selectize'
    //,'architect'
    //,'qtip2'
    //,'tipsy'
    ], 

function( App, LayerColors ) //,User,GMapView) 
{

  //Architect.setupWorkersPath('lib/architect');

  var colores = new LayerColors().add_css();

  new App([

    {
      name: 'historias'
      ,model: {
        type: 'crowdmap' 
        ,url: 
        'https://qprmonitoreo.crowdmap.com'
      }
      //,model: {
        //type: 'fusiontables'
        //,ftid: '1ub97omGUE5TmYe_fsFaBRNKo2KysE_QMW8iRreg' 
      //}
      ,view: {
        icon: {
          url: 'images/markers/historia.png'
          ,height: 48
          ,background_size: 30
        }
        ,color: colores.get('historias')
        ,visible: true
        //,canvas_size: 0.01
      }
    }

    ,{
      name: 'industrias'
      ,model: {
        type: 'fusiontables'
        // industrias1 geolocalizada
        //,ftid: '1iCgpDNL1LWwqnLvGyizaxlBol0jz2DH_lpR2ajw' 
        // industrias2
        ,ftid: '1OM9zinDVTeLtWYSaWdcrdKbNeeY8gkUgqs3yqWU' 
      }
      ,view: {
        icon: {
          url: 'images/markers/industria.png'
        }
        ,color: colores.get('industrias')
        ,overlays: ['canvas_points']
        //,visible: true
        //,canvas_size: 0.0015
      }
    }

    ,{
      name: 'basurales'
      ,model: {
        type: 'fusiontables'
        // solo pts/polis
        ,ftid: '1hffu-50r0VQKUh7GKpEShnqOzE9yic_NaD8ZQzE' 
        // merge pts/polis + algo de data
        //,ftid: '1hYKp8ax6PGu_ejvxEMRRsGp7PV1DzN6cWMDk4O0' 
      }
      ,view: {
        icon: {
          url: 'images/markers/basural.png'
        }
        ,color: colores.get('basurales')
        //,visible: true
        //,canvas_size: 0.004
      }
    }

    ,{
      name: 'ecopuntos'
      ,model: {
        type: 'fusiontables'
        ,ftid: '1-c4LH4aZ0U38z3EAj529xEgayza6C8zOdaqzJJA' 
      }
      ,view: {
        icon: {
          url: 'images/markers/ecopunto.png'
        }
        ,color: colores.get('ecopuntos')
        ,overlays: ['canvas_points']
        //,visible: true
        //,canvas_size: 0.004
      }
    }

    ,{
      name: 'asentamientos'
      ,model: {
        type: 'fusiontables'
        ,ftid: '1_fEVSZmIaCJzDQoOgTY7pIcjBLng1MFOoeeTtYY' 
      }
      ,view: {
        icon: {
          url: 'images/markers/asentamiento.png'
        }
        ,color: colores.get('asentamientos')
        //,visible: true
      }
    }

    ,{
      name: 'alertas'
      ,model: {
        type: 'crowdmap' 
        ,url: 
        'https://quepasariachuelo.crowdmap.com'
      }
      ,view: {
        icon: {
          url: 'images/markers/alerta.png'
        }
        ,color: colores.get('alertas')
        //,visible: true
        //,canvas_size: 0.004
      }
    }

    ,{
      name: 'noticias'
      ,model: {
        type: 'crowdmap' 
        ,url: 
        'https://qprmonitoreo.crowdmap.com'
      }
      ,view: {
        icon: {
          url: 'images/markers/noticia.png'
        }
        ,color: colores.get('noticias')
        //,visible: true
      }
    }

    ,{
      name: 'acciones'
      ,model: {
        type: 'crowdmap' 
        ,url: 
        'https://qprmonitoreo.crowdmap.com'
      }
      ,view: {
        icon: {
          url: 'images/markers/accion.png'
        }
        ,color: colores.get('acciones')
        //,visible: true
      }
    }

    ,{
      name: 'respuestas'
      ,model: {
        type: 'crowdmap' 
        ,url: 
        'https://qprmonitoreo.crowdmap.com'
      }
      ,view: {
        icon: {
          url: 'images/markers/respuesta.png'
        }
        ,color: colores.get('respuestas')
        //,visible: true
      }
    }

    ,{
      name: 'documentos'
      ,model: {
        type: 'crowdmap' 
        ,url: 
        'https://qprmonitoreo.crowdmap.com'
      }
      ,view: {
        icon: {
          url: 'images/markers/documento.png'
        }
        ,color: colores.get('documentos')
        //,visible: true
      }
    }

    ,{
      name: 'normativas'
      ,model: {
        type: 'crowdmap' 
        ,url: 
        'https://qprmonitoreo.crowdmap.com'
      }
      ,view: {
        icon: {
          url: 'images/markers/normativa.png'
        }
        ,color: colores.get('normativas')
        //,visible: true
      }
    }

  ]);

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

