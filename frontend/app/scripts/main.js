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
  var marker_size = 36;
  var icon_size = 24;

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
          ,width: 48
          ,background_size: 30
        }
        ,marker: {
          url: 'images/markers/historia_c.png'
          ,height: 48
          ,width: 48
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
          ,width: icon_size
          ,height: icon_size
        }
        ,marker: {
          url: 'images/markers/industria_c.png'
          ,height: marker_size
          ,width: marker_size
        }
        ,color: colores.get('industrias')
        //,overlays: ['canvas_points']
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
          ,width: icon_size
          ,height: icon_size
        }
        ,marker: {
          url: 'images/markers/basural_c.png'
          ,height: marker_size
          ,width: marker_size
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
          ,width: icon_size
          ,height: icon_size
        }
        ,marker: {
          url: 'images/markers/ecopunto_c.png'
          ,height: marker_size
          ,width: marker_size
        }
        ,color: colores.get('ecopuntos')
        //,overlays: ['canvas_points']
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
          ,width: icon_size
          ,height: icon_size
        }
        ,marker: {
          url: 'images/markers/asentamiento_c.png'
          ,height: marker_size
          ,width: marker_size
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
          ,width: icon_size
          ,height: icon_size
        }
        ,marker: {
          url: 'images/markers/alerta_c.png'
          ,height: marker_size
          ,width: marker_size
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
          ,width: icon_size
          ,height: icon_size
        }
        ,marker: {
          url: 'images/markers/noticia_c.png'
          ,height: marker_size
          ,width: marker_size
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
          ,width: icon_size
          ,height: icon_size
        }
        ,marker: {
          url: 'images/markers/accion_c.png'
          ,height: marker_size
          ,width: marker_size
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
          ,width: icon_size
          ,height: icon_size
        }
        ,marker: {
          url: 'images/markers/respuesta_c.png'
          ,height: marker_size
          ,width: marker_size
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
          ,width: icon_size
          ,height: icon_size
        }
        ,marker: {
          url: 'images/markers/documento_c.png'
          ,height: marker_size
          ,width: marker_size
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
          ,width: icon_size
          ,height: icon_size
        }
        ,marker: {
          url: 'images/markers/normativa_c.png'
          ,height: marker_size
          ,width: marker_size
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

