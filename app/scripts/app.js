define( [ 
    //libs
    'jquery'
    ,'underscore'
    ,'backbone'
    //models
    ,'models/ft/FT'
    ,'models/crowdmap/crowdmap'
    //views
    ,'views/gmaps/glayer_view'
    ,'views/gmaps/gmap_view'
    ,'views/gmaps/gcuenca_view'
    ,'views/ui/layer-control'
    ,'views/detalles/historia'
    //templates
    ,'text!tpl/ui/layer-controls.html'
    ,'text!tpl/ui/widgets.html'
    ], 

function( 
  $, _, Backbone, 
  FT, Crowdmap, 
  GLayerView, GMapView, GCuencaView,
  LayerControlView, HistoriaView,
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
    //,views: {}
  };

  var gmap, gcuenca;
  var cur_detalle_view;
 
  var model_factory = {
    ft: {}
    ,crowdmap: {}
  };

  var view_factory = {
    google: {}
  };

  model_factory.ft.make = function( name, opt )
  {
    //capitalize
    var pclass = name.charAt(0).toUpperCase() + name.slice(1);

    var parser = new FT.LayerParsers[pclass]({
      name: name
      ,icon: opt.icon
    });

    var model = new FT.Layer([], {
      name: name
      ,ftid: opt.ftid
      ,parser: parser
    });

    return model;
  }

  model_factory.crowdmap.make = function( name, opt )
  {
    var pclass = name.charAt(0).toUpperCase() + name.slice(1);

    var parser = new Crowdmap.LayerParsers[pclass]({
      name: name
      ,icon: opt.icon
    });

    var model = new Crowdmap.Layer([], {
      name: name
      ,parser: parser
    });

    return model;
  }

  view_factory.google.make = function( name, opt, model )
  {
    return new GLayerView({
      name: name,
      model: model,
      map: gmap.map(), 
      infowin: gmap.infowin(), 
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

  function init_layers( config ) 
  {  
    var layer, cfg, k, i = config.length;

    while( i-- )
    {
      cfg = config[i];
      k = cfg.name;
      layer = make_layer( cfg );
      //layers.views[k] = layer.view;
      layers.models[k] = layer.model;
      layers.models[k].fetch();
    }
    
  }

  function make_layer( opt )
  {
    var name = opt.name;

    // copy icon.url from view to model
    ( opt.model.icon || (opt.model.icon = opt.view.icon ) )
    //( opt.model.icon || (opt.model.icon = {
      //url: opt.view.icon.url
    //}) )

    var model = model_factory[opt.model.type]
      .make( name, opt.model );

    var view = view_factory[opt.view.type]
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
        'select:entidad',
        function( feature )
        {
          gmap.focus( feature );
          gmap.infowin().close();
          add_detalle( feature );
        });

    return {
      model: model
      ,view: view
    };
  }

  //TODO 
  //cachear detalle/historias
  //hacer collection y req al inicio
  //add detalle para otras entidades

  function add_detalle( feature )
  {
    if ( cur_detalle_view )
    {
      cur_detalle_view.close();
      cur_detalle_view = null;
    }

    var props = feature.get('properties');
    var id = feature.get('id');

    if ( props.type !== 'historias' )
      return;

    ui.$widgets.hide();

    var model = new FT.Historia([], {
      ftid: '1uIgt8vsouqvnDg3TZUFZe4bkMqC1IiM8R006Muw'
      ,feature: feature
      ,layers: layers.models
    });

    var view = new HistoriaView({
      model: model
      ,feature: feature
    }); 

    view.on('close', function()
    {
      view.off();
      ui.$widgets.show();
    });

    $('body').append( view.render().el );

    model.fetch();

    cur_detalle_view = view;

  }

  function init_ui( ui )
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
      gmap.origin(); 
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

  var ui = init_ui();

  var colores = make_colores();

  init_layers([
    {
      name: 'historias'
      ,model: {
        type: 'ft'
        ,ftid: '1ub97omGUE5TmYe_fsFaBRNKo2KysE_QMW8iRreg' 
      }
      ,view: {
        type: 'google'
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
        type: 'ft'
        ,ftid: '1iCgpDNL1LWwqnLvGyizaxlBol0jz2DH_lpR2ajw' 
      }
      ,view: {
        type: 'google'
        ,icon: {
          url: 'images/markers/industria.png'
        }
        ,color: colores.industrias
      }
    }

    ,{
      name: 'basurales'
      ,model: {
        type: 'ft'
        ,ftid: '1hffu-50r0VQKUh7GKpEShnqOzE9yic_NaD8ZQzE' 
      }
      ,view: {
        type: 'google'
        ,icon: {
          url: 'images/markers/basural.png'
        }
        ,color: colores.basurales
      }
    }

    ,{
      name: 'ecopuntos'
      ,model: {
        type: 'ft'
        ,ftid: '1-c4LH4aZ0U38z3EAj529xEgayza6C8zOdaqzJJA' 
      }
      ,view: {
        type: 'google'
        ,icon: {
          url: 'images/markers/ecopunto.png'
        }
        ,color: colores.ecopuntos
      }
    }

    ,{
      name: 'asentamientos'
      ,model: {
        type: 'ft'
        ,ftid: '1_fEVSZmIaCJzDQoOgTY7pIcjBLng1MFOoeeTtYY' 
      }
      ,view: {
        type: 'google'
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
      }
      ,view: {
        type: 'google'
        ,icon: {
          url: 'images/markers/alerta.png'
        }
        ,color: colores.alertas
      }
    }

  ]); 


  //XXX for debugging....

  //function make_gftl_layer( opt ) 
  //{

    //var ft = new google.maps.FusionTablesLayer({
      //query: {
        ////select: '\'address\'',
        //select: opt.db.join(','),
        //from: opt.ftid
      //}
    //});

    //var view = new Backbone.View({});
    //view.is_visible = function()
    //{
      //return !!ft.getMap();
    //}
    //view.toggle = function() 
    //{
      //if ( this.is_visible() )
        //this.hide();
      //else
        //this.show();
    //}
    //view.show = function()
    //{
      //ft.setMap( gmap.map() );
      //this.trigger(
        //'change:visibility', true);
    //}
    //view.hide = function()
    //{
      //ft.setMap( null );
      //this.trigger(
        //'change:visibility', false);
    //}

    //var ctrl = new LayerControlView({
      //name: opt.name,
      //el: '.layer.'+opt.name,
      //view: view
    //});

    ////view.show();

    //layers[ opt.name ] = {
      //model: ft,
      //view: view,
      //control: ctrl
    //};

    //return layers[ opt.name ];
  //}

}

return App;

});

