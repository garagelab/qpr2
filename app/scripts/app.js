define( [ 
    //libs
    'jquery'
    ,'underscore'
    ,'backbone'
    //models
    ,'models/qpr/Layer'
    ,'models/ft/FT'
    ,'models/crowdmap/crowdmap'
    //overlays
    //,'views/gmaps/glayer_view'
    ,'views/gmaps/gfeatures_view'
    ,'views/gmaps/ginfowins_view'
    ,'views/gmaps/gclusterer_view'
    ,'views/gmaps/gcanvaslayer_view'
    //views
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

  //GLayerView, 
  GFeaturesView, 
  GInfowinsView, 
  GClustererView, 
  GCanvasLayerView, 

  GMapView, GCuencaView,
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

  var mapview, gcuenca;
  var cur_detalle_view;
 
  var layer_factory = 
  {
    model: {
      fusiontables: {}
      ,crowdmap: {}
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
      //ftid: opt.ftid
      //,db: parser.db
      sql: [
        'SELECT '
        ,parser.db.join(',')
        //,'*'
        ,' FROM '
        ,opt.ftid
      ].join('') 
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

  function make_colores()
  {

    // mapa layer:hex

    var colores = {
      historias: 
        chroma.color( 240, 140, 0 ).hex()
    };

    // escala

    var carr = [

      //'historias'
      'acciones'
      ,'respuestas'
      ,'alertas'
      ,'noticias'
      ,'documentos'
      ,'normativas'

      ,'industrias'
      ,'basurales'
      ,'ecopuntos'
      ,'asentamientos'
      ,'subcuencas'
    ];

    //chroma.brewer.RdYlBu
    var cscale = chroma
      .scale('RdYlBu')
      //.scale('Set1')
      //.scale('Accent')
      //.scale('Dark2')
      .domain([ 0, carr.length-1 ]); 

    for ( var c = 0; c < carr.length; c++ )
    {
      colores[ carr[c] ] = cscale(c).hex();
    } 

    return colores;
  }

  function set_layer_controls_colors( colores )
  {
    var _css = [ '<style type="text/css">' ];

    for ( var k in colores )
    {
      //var crgb = cscale(c).rgb().join(); 
      var crgb = chroma
        .color( colores[k] ).rgb().join();

      var sel = '.layer.'+k;

      _css.push( [
        sel
        ,'{'
        ,'background-color:'
        ,'rgba( '+crgb+', 0.8 );'
        ,'}'
      ].join(''));

      _css.push( [
        sel+':hover'
        ,'{'
        ,'background-color:'
        ,'rgba( '+crgb+', 0.6 );'
        ,'}'
      ].join(''));

      _css.push( [
        sel+'.visible'
        ,'{'
        ,'font-weight: bold;'
        ,'background-color:'
        ,'rgba( '+crgb+', 1.0 );'
        ,'}'
      ].join(''));

    }

    _css.push( '</style>' );
    $('head').append( _css.join('') );
  }

  function make_layers( mapview, config ) 
  {  
    var layer, cfg, k, i = config.length;

    while( i-- )
    {
      cfg = config[i];
      k = cfg.name;
      layer = make_layer( cfg, mapview );
      layers.views[k] = layer.view;
      layers.models[k] = layer.model;
      layers.models[k].fetch();
    }
  }

  function make_layer( opt, mapview )
  {
    var name = opt.name;

    // copy ref icon.url from view to model
    ( opt.model.icon || (opt.model.icon = opt.view.icon ) )
    //( opt.model.icon || (opt.model.icon = {
      //url: opt.view.icon.url
    //}) )

    var model = layer_factory.model
      [opt.model.type]
        .make( name, opt.model );


    // views / overlays

    var features_view = new GFeaturesView({
      name: name
      ,model: model
      ,map: mapview.map()
      ,color: opt.view.color
      ,visible: opt.view.visible
      ,icon: opt.view.icon
    });

    var infowins_view = new GInfowinsView({
      name: name
      ,model: model
      ,map: mapview.map()
    });

    var clusterer_view = new GClustererView({
      name: name
      ,model: model
      ,map: mapview.map()
      ,visible: opt.view.visible
      ,icon: opt.view.icon
    });

    var canvas_view = new GCanvasLayerView({
      name: name
      ,model: model
      ,map: mapview.map()
      ,color: opt.view.color
      ,visible: opt.view.visible
      ,scale: false
      ,size: 20
      //,clusterer: clusterer_view.clusterer
    });

    //return new GLayerView({
      //name: name
      //,model: model
      //,map: mapview.map()
      //,color: opt.view.color
      //,visible: opt.view.visible
      //,icon: opt.view.icon
    //}); 

    //var view = layer_factory.view
      //[ opt.view.overlays[0] ]
        //.make( name, opt.view, model );

    var overlays = {
      features: features_view
      ,clusterer: clusterer_view 
      ,infowins: infowins_view
      ,canvas: canvas_view
    };  

    clusterer_view.listenTo( 
        features_view,  
        'added:marker',
        clusterer_view.marker_added, 
        clusterer_view );

    infowins_view.listenTo( 
        features_view,  
        'select:feature',
        infowins_view.infowin, 
        infowins_view );

    infowins_view.on(
      'select:feature',
      function( feature )
      {
        mapview.focus( feature );
        add_detalle( feature, mapview );
      });

    clusterer_view.on( 
      'update', 
      function( clusterer )
      {
        var latlngs = [];
        _.each( clusterer.getClusters(),
          function( cluster )
          {
            latlngs.push( cluster.getCenter() );
          });
        canvas_view.update_points( latlngs );
      });

    
    // ui control

    var ctrl = new LayerControlView({
      name: name
      ,el: '.layer-controls .layer.'+name
      ,visible: opt.view.visible
    });

    ctrl.on(
      'change:visibility',
      function( v )
      {
        var k;
        for ( k in overlays )
          overlays[k].visible( v );
      });


    return {
      model: model
      ,view: { overlays: overlays }
    };
  }

  //TODO 
  //cachear detalle/historias
  //hacer collection y req queue al inicio

  function add_detalle( feature, mapview )
  {
    if ( cur_detalle_view )
    {
      cur_detalle_view.close();
      cur_detalle_view = null;
    }

    ui.$widgets.hide();

    var props = feature.get('properties');

    var det;

    if ( props.type === 'historias' )
    {
      det = make_detalle_historia(
          feature, mapview );
    }
    else
    {
      det = make_detalle_feature( feature );
    }

    cur_detalle_view = det.view;
  }

  function make_detalle_historia( 
      feature, mapview )
  {

    var hid = feature.get('id');

    var ftid = 
    '1uIgt8vsouqvnDg3TZUFZe4bkMqC1IiM8R006Muw';

    var parser = new FT.LayerParsers
      .HistoriaDetalle({
        name: hid
        ,layers: layers.models
      });

    var api = new FT.API({
      sql: [
        'SELECT '
        ,parser.db.join(',')
        ,' FROM '
        ,ftid
        ,' WHERE '
        ,'hid'
        ,' = '
        ,'\''+hid+'\''
      ].join('') 
    });

    var model = new Layer([], {
      name: hid
      ,api: api
      ,parser: parser
    });

    //var model = new FT.Historia([], {
    //ftid: 
    //'1uIgt8vsouqvnDg3TZUFZe4bkMqC1IiM8R006Muw'
    //,feature: feature
    //,layers: layers.models
    //});

    var hview = new HistoriaView({
      model: model
      ,feature: feature
    }); 

    hview.on('close', function()
    {
      hview.off();
      ui.$widgets.show();
      cur_detalle_view = null;
    });

    hview.on('select:feature', function(feature)
    {
      mapview.focus( feature );
      layers.views
        [ feature.get('properties').type ]
          .overlays.infowins
          .infowin( feature );
    });

    $('body').append( hview.render().el );

    model.fetch();

    return {
      model: model
      ,view: hview
    }
  }

  function make_detalle_feature( feature )
  {

    var fview = new FeatureView({
      feature: feature
    });

    fview.on('close', function()
    {
      fview.off();
      ui.$widgets.show();
      cur_detalle_view = null;
    });

    $('body').append( fview.render().el );

    return {
      model: null
      ,view: fview
    }
  }

  function init_ui( ui, mapview )
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
      mapview.origin(); 
    });

    //TODO q feo......
    ui.$enviar_alerta_frame = 
      $('#enviar-alerta-frame-container');
    ui.$enviar_alerta_frame.css({
      'width': '1000px'
      ,'height': '100%'
      ,'background-color': 'rgba(0,0,0,0.5)'
      ,'position': 'absolute' 
      ,'left': '200px' 
    });
    //ui.$enviar_alerta_frame.hide();
    ui.$enviar_alerta_frame.css(
        'visibility','hidden');
    ui.$enviar_alerta = $('.enviar-alerta');

    ui.$enviar_alerta.click( function(e)
    {
      //window.open('https://quepasariachuelo.crowdmap.com/reports/submit', '_blank');  

      if ( ui.$enviar_alerta_frame
        .css('visibility') === 'hidden' )
        //.css('display') === 'none' )
      {
        ui.$enviar_alerta_frame.append("<iframe id='enviar-alerta-frame' src='//quepasariachuelo.crowdmap.com/reports/submit' width='1000px' height='100%' frameborder='0' style='border:none; overflow-x:hiden; overflow-y:auto;'></iframe>");
        //ui.$enviar_alerta_frame.show();
        ui.$enviar_alerta_frame.css(
            'visibility','visible');
        ui.$widgets.hide();
      }

      else
      {
        ui.$enviar_alerta_frame.empty();
        //ui.$enviar_alerta_frame.hide();
        ui.$enviar_alerta_frame.css(
            'visibility','hidden');
        if ( ! cur_detalle_view )
          ui.$widgets.show();
      }
    });

    return ui;
  }

  // go! 

  mapview = new GMapView({
    el: document.getElementById("map")
  }); 

  gcuenca = new GCuencaView({
    map: mapview.map()
  });
  gcuenca.render();

  var ui = init_ui( {}, mapview );

  var colores = make_colores();
  set_layer_controls_colors( colores );

  make_gsubcuencas_layer( mapview );

  make_layers( mapview, [

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
        icon: {
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
        icon: {
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
        icon: {
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
        icon: {
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
        icon: {
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
        icon: {
          url: 'images/markers/noticia.png'
        }
        ,color: colores.noticias
      }
    }

  ]); 


  function make_gsubcuencas_layer( mapview ) 
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
          if ( v ) 
            layer.setMap( mapview.map() );
          else 
            layer.setMap( null );
        });
  }

}

return App;

});

