define( [ 
    //libs
    'jquery'
    ,'underscore'
    ,'backbone'
    //models
    ,'models/qpr/Layer'
    ,'models/ft/FT'
    ,'models/crowdmap/crowdmap'
    //views
    ,'views/gmaps/glayer_view'
    ,'views/gmaps/gmap_view'
    ,'views/gmaps/gcuenca_view'
    ,'views/ui/LayerControlView'
    ,'views/detalles/HistoriaView'
    ,'views/detalles/FeatureView'
    //templates
    ,'text!tpl/ui/layer_controls.html'
    ,'text!tpl/ui/widgets.html'
    ], 

function( 
  $, _, Backbone, 

  Layer,
  FT, Crowdmap, 

  GLayerView, GMapView, GCuencaView,
  LayerControlView, 
  HistoriaView, FeatureView,

  tpl_layer_controls, tpl_widgets
  ) 
{

'use strict';

var App = function() 
{ 
  //TODO remove this hack for testing

  var hash = parseUri(location.href).anchorKey;

  var Router = Backbone.Router.extend({

    routes: {
      "markers/:type": "markers"
    },

    markers: function( marker_t ) 
    {
    }

  });

  var router = new Router();

  Backbone.history.start(); 


  var layers = {
    models: {}
    ,views: {}
  };

  var gmap, gcuenca;
  var cur_detalle_view;
 
  var layer_factory = 
  {
    model: {
      fusiontables: {}
      ,crowdmap: {}
    }
    ,view: {
      gfeatureslayer: {}
    }
  };

  layer_factory.model.fusiontables.make = 
  function( name, opt )
  {
    //capitalize name
    var parserclass = name.charAt(0).toUpperCase() + name.slice(1);

    var parser = new FT.LayerParsers
      [parserclass]({
        name: name
        ,icon: opt.icon
      });

    var api = new FT.API({
      ftid: opt.ftid
      ,db: parser.db
    });

    var model = new Layer([], {
      name: name
      ,api: api
      ,parser: parser
    });

    return model;
  }

  layer_factory.model.crowdmap.make = 
  function( name, opt )
  {
    //capitalize name
    var parserclass = name.charAt(0).toUpperCase() + name.slice(1);

    var parser = new Crowdmap.LayerParsers
      [parserclass]({
        name: name
        ,icon: opt.icon
      });

    var api = new Crowdmap.API({
      url: opt.url 
      ,db: parser.db
    });

    var model = new Layer([], {
      name: name
      ,api: api
      ,parser: parser
    });

    return model;
  }

  layer_factory.view.gfeatureslayer.make = 
  function( name, opt, model )
  {
    return new GLayerView({
      name: name,
      model: model,
      map: gmap.map(), 
      color: opt.color,
      visible: opt.visible,
      icon: opt.icon
    }); 
  } 

  function make_colores()
  {
    var colores = {};
    var carr = [
      'historias'
      ,'industrias'
      ,'basurales'
      ,'ecopuntos'
      ,'asentamientos'
      ,'alertas'
      ,'noticias'
      ,'acciones'
    ];

    var cscale = chroma
      .scale('Set1')
      //.scale('Accent')
      //.scale('Dark2')
      .domain([ 0, carr.length ]);

    //var colores = {
      //historias: cscale(0)
      //,industrias: cscale(1)
      //,basurales: cscale(2)
      //,ecopuntos: cscale(3)
      //,asentamientos: cscale(4)
      //,alertas: cscale(5)
      //,noticias: cscale(6)
      //,acciones: cscale(7)
    //};

    var c, ckey, crgb;
    for ( c = 0; c < carr.length; c++ )
    {
      ckey = carr[c];
      colores[ckey] = cscale(c).hex();
      crgb = cscale(c).rgb().join(); 

      //var sel = '.sidebar .layer.'+ckey;
      //$(sel).css(
          //'background-color', 
          //'rgba( '+crgb+', 0.6 );' );

      //console.log(
          //sel,crgb,
          //$(sel).css('background-color'),
          //$(sel)
          //)

      //$(sel+':hover').css(
          //'background-color', 
          //'rgba( '+crgb+', 0.8 );' );

      //$(sel+'.visible').css(
          //'background-color', 
          //'rgba( '+crgb+', 1.0 );' );
    }

    return colores;
  }

  function make_features_layers( map, config ) 
  {  
    var layer, cfg, k, i = config.length;

    while( i-- )
    {
      cfg = config[i];
      k = cfg.name;
      layer = make_layer( cfg, map );
      layers.views[k] = layer.view;
      layers.models[k] = layer.model;
      layers.models[k].fetch();
    }
  }

  function make_layer( opt, map )
  {
    var name = opt.name;

    // copy icon.url from view to model
    ( opt.model.icon || (opt.model.icon = opt.view.icon ) )
    //( opt.model.icon || (opt.model.icon = {
      //url: opt.view.icon.url
    //}) )

    var model = layer_factory.model
      [opt.model.type]
        .make( name, opt.model );

    var view = layer_factory.view
      [opt.view.type]
        .make( name, opt.view, model );

    var ctrl = new LayerControlView({
      name: name
      ,el: '.layer-controls .layer.'+name
      ,visible: opt.view.visible
    });

    ctrl.on(
        'change:visibility',
        function( v )
        {
          view.visible( v );
        }); 

    view.on(
        'select:feature',
        function( feature )
        {
          map.focus( feature );
          add_detalle( feature, map );
        });

    return {
      model: model
      ,view: view
    };
  }

  //TODO 
  //cachear detalle/historias
  //hacer collection y req queue al inicio
  //add detalle de features

  function add_detalle( feature, map )
  {
    if ( cur_detalle_view )
    {
      cur_detalle_view.close();
      cur_detalle_view = null;
    }

    ui.$widgets.hide();

    var props = feature.get('properties');
    var id = feature.get('id');

    // detalle feature

    if ( props.type !== 'historias' )
    {
      var fview = new FeatureView({
        feature: feature
      });

      fview.on('close', function()
      {
        fview.off();
        ui.$widgets.show();
      });

      $('body').append( fview.render().el );

      cur_detalle_view = fview;

      return;
    }

    // detalle historia

    var model = new FT.Historia([], {
      ftid: 
      '1uIgt8vsouqvnDg3TZUFZe4bkMqC1IiM8R006Muw'
      ,feature: feature
      ,layers: layers.models
    });

    var hview = new HistoriaView({
      model: model
      ,feature: feature
    }); 

    hview.on('close', function()
    {
      hview.off();
      ui.$widgets.show();
    });

    hview.on('select:feature', function(feature)
    {
      var props = feature.get('properties');
      layers.views[props.type].infowin(feature);
      map.focus( feature );
    });

    $('body').append( hview.render().el );

    model.fetch();

    cur_detalle_view = hview;

  }

  function init_ui( ui, map )
  {
    (ui || (ui = {}))

    ui.$layers = $('.layers');
    ui.$widgets = $('.widgets');

    ui.$layers.append( 
        _.template( tpl_layer_controls ) );

    ui.$widgets.append( 
        _.template( tpl_widgets ) );

    ui.$origin = $('.goto-origin');

    ui.$origin.click( function(e)
    {
      map.origin(); 
    });

    ui.$enviar_alerta = $('.enviar-alerta');
    ui.$enviar_alerta.click( function(e)
    {
      window.open('https://quepasariachuelo.crowdmap.com/reports/submit', '_blank');  
    });

    return ui;
  }

  // go! 

  gmap = new GMapView({
    el: document.getElementById("map")
  }); 

  gcuenca = new GCuencaView({
    map: gmap.map()
  });
  gcuenca.render();

  var ui = init_ui( {}, gmap );

  var colores = make_colores();

  make_gsubcuencas_layer( gmap );

  make_features_layers( gmap, [
    {
      name: 'historias'
      ,model: {
        type: 'fusiontables'
        ,ftid: '1ub97omGUE5TmYe_fsFaBRNKo2KysE_QMW8iRreg' 
      }
      ,view: {
        type: 'gfeatureslayer'
        ,icon: {
          url: 'images/markers/historia.png'
          ,height: 48
        }
        ,color: colores.historias
        ,visible: true
      }
    }

    ,{
      name: 'industrias'
      ,model: {
        type: 'fusiontables'
        ,ftid: '1iCgpDNL1LWwqnLvGyizaxlBol0jz2DH_lpR2ajw' 
      }
      ,view: {
        type: 'gfeatureslayer'
        ,icon: {
          url: 'images/markers/industria.png'
        }
        ,color: colores.industrias
      }
    }

    ,{
      name: 'basurales'
      ,model: {
        type: 'fusiontables'
        ,ftid: '1hffu-50r0VQKUh7GKpEShnqOzE9yic_NaD8ZQzE' 
      }
      ,view: {
        type: 'gfeatureslayer'
        ,icon: {
          url: 'images/markers/basural.png'
        }
        ,color: colores.basurales
      }
    }

    ,{
      name: 'ecopuntos'
      ,model: {
        type: 'fusiontables'
        ,ftid: '1-c4LH4aZ0U38z3EAj529xEgayza6C8zOdaqzJJA' 
      }
      ,view: {
        type: 'gfeatureslayer'
        ,icon: {
          url: 'images/markers/ecopunto.png'
        }
        ,color: colores.ecopuntos
      }
    }

    ,{
      name: 'asentamientos'
      ,model: {
        type: 'fusiontables'
        ,ftid: '1_fEVSZmIaCJzDQoOgTY7pIcjBLng1MFOoeeTtYY' 
      }
      ,view: {
        type: 'gfeatureslayer'
        ,icon: {
          url: 'images/markers/asentamiento.png'
        }
        ,color: colores.asentamientos
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
        type: 'gfeatureslayer'
        ,icon: {
          url: 'images/markers/alerta.png'
        }
        ,color: colores.alertas
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
        type: 'gfeatureslayer'
        ,icon: {
          url: 'images/markers/noticia.png'
        }
        ,color: colores.noticias
      }
    }

  ]); 


  function make_gsubcuencas_layer( gmap ) 
  {
    var name = 'subcuencas';

    var layer = 
      new google.maps.FusionTablesLayer({

      query: {
        select: 'geometry'
        ,from: '1BSNFzXOaGd6wog43nNkZRqBdJ_ai-SkCkB2R2qs'
      }

      ,styles: [{
        polygonOptions: {
          fillColor: '#ffffff'
          ,fillOpacity: 0.01
          //,strokeColor: "#aaaaaa"
          ,strokeColor: "#000000"
          ,strokeOpacity: 0.3
          ,strokeWeight: 1    
        }
      }]
    });

    var ctrl = new LayerControlView({
      name: name
      ,el: '.layer-controls .layer.'+name
      ,visible: false
    });

    ctrl.on(
        'change:visibility',
        function( v )
        {
          if ( v ) layer.setMap( gmap.map() );
          else layer.setMap( null );
        });
  }

}

return App;

});

