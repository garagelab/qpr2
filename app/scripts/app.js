define( [ 
    //libs
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'login'
    //models
    ,'models/qpr/Layer'
    ,'models/ft/FT'
    ,'models/crowdmap/crowdmap'
    //overlays
    //,'views/gmaps/glayer_view'
    //,'views/gmaps/gfeatures_view'
    ,'views/gmaps/gmarkers_view'
    ,'views/gmaps/gpolygons_view'
    ,'views/gmaps/ginfowins_view'
    ,'views/gmaps/gclusterer_view'
    ,'views/gmaps/gcanvaslayer_view'
    //views
    ,'views/gmaps/gmap_view'
    ,'views/gmaps/gcuenca_view'
    ,'views/ui/LayerControlView'
    ,'views/ui/LayerColors'
    ,'views/FeatureABMview'
    //controllers
    ,'controllers/HistoriaDetalleCtrler'
    ,'controllers/FeatureDetalleCtrler'
    //templates
    ,'text!tpl/ui/layer_controls.html'
    ,'text!tpl/ui/widgets.html'
    ], 

function( 
  $, _, Backbone

  ,Login
  ,Layer
  ,FT
  ,Crowdmap

  //,GLayerView
  //,GFeaturesView
  ,GMarkersView
  ,GPolygonsView 
  ,GInfowinsView 
  ,GClustererView 
  ,GCanvasLayerView 

  ,GMapView
  ,GCuencaView

  ,LayerControlView 
  ,LayerColors
  ,FeatureABMview

  ,HistoriaDetalleCtrler
  ,FeatureDetalleCtrler

  ,tpl_layer_controls
  ,tpl_widgets
  ) 
{

'use strict';

var App = function( config ) 
{ 
  //var hash = parseUri(location.href).anchorKey;

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


  var login;
  var layers = {};
  var mapview, gcuenca;
  var cur_detalle;

  window.layers = layers;
  window.login = login;
 
  var layer_factory = 
  {
    model: {
      fusiontables: {}
      ,crowdmap: {}
    }
    ,overlays: {}
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
      read: {
        params: {
          sql: [
            'SELECT '
            ,parser.db().join(',')
            //,'*'
            ,' FROM '
            ,opt.ftid
          ].join('') 
        }
      }
    });
    window.apift = api;

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
      ,read: {
        params: parser.db()
      }
    });

    var model = new Layer([], {
      name: name
      ,api: api
      ,parser: parser
    });

    return model;
  } 

  layer_factory.overlays.make = 
  function( name, opt, model )
  { 

    var ol = {

    // default overlays

    markers: new GMarkersView({
      name: name
      ,model: model
      ,map: mapview.map()
      ,color: opt.color
      ,visible: opt.visible
      ,icon: opt.icon
    })

    ,polygons: new GPolygonsView({
      name: name
      ,model: model
      ,map: mapview.map()
      ,color: opt.color
      ,visible: opt.visible
    })

    ,infowins: new GInfowinsView({
      name: name
      ,model: model
      ,map: mapview.map()
    })

    ,clusterer: new GClustererView({
      name: name
      ,model: model
      ,map: mapview.map()
      ,visible: opt.visible
      ,icon: opt.icon
    })

    ,canvas_icons: new GCanvasLayerView({
      name: name
      ,model: model
      ,map: mapview.map()
      ,color: opt.color
      ,visible: opt.visible
      ,scale: false
      ,size: opt.icon.background_size || 26

      //feed canvas with list of latlng points
      ,points: function()
      {
        var latlngs = [];
        _.each( 
          ol.clusterer.clusters()
          ,function( cluster )
          {
            latlngs.push( cluster.getCenter() );
          });
        return latlngs;
      }
    }) 

    }; //end of default overlays


    // wire default overlays

    ol.clusterer.listenTo( 
        ol.markers,  
        'added:marker',
        ol.clusterer.marker_added, 
        ol.clusterer );

    ol.infowins.listenTo( 
        ol.markers,  
        'select:feature',
        ol.infowins.infowin, 
        ol.infowins );

    ol.infowins.on(
      'select:feature',
      function( feature )
      {
        mapview.focus( feature );
        add_detalle( feature, mapview );
      });

    ol.canvas_icons.listenTo( 
      ol.clusterer,
      'update', 
      ol.canvas_icons.render,
      ol.canvas_icons );


    // optional overlays

    if ( opt.overlays && opt.overlays
        .indexOf( 'canvas_points' ) > -1 )
    {

      ol.canvas_points =
        new GCanvasLayerView({
          name: name
          ,model: model
          ,map: mapview.map()
          ,color: opt.color
          ,visible: opt.visible
          //,points: function()
          //{
            //var latlngs = [];
            //_.each( 
              //ol.markers.markers()
              //,function( m )
              //{
                //latlngs.push(m.getPosition());
              //});
            //return latlngs;
          //}
        });

      ol.canvas_points.listenTo( 
        model, 'add', 
        ol.canvas_points.feature_added,
        ol.canvas_points );

    } 

    return ol;

  }

  function make_layers( mapview, config ) 
  {  
    var layer, cfg, k, i = config.length;

    while( i-- )
    {
      cfg = config[i];
      k = cfg.name;
      layer = make_layer( cfg, mapview );
      layers[k] = layer;

      //layer.model.fetch();

      // fetch with 1sec delay
      _.delay( 
        _.bind(layer.model.fetch,layer.model)
        , 1000*i );
    }

    // fetch in sequence....
    //(function next( seq )
    //{
      //if ( seq.length === 0 )
        //return;
      //var model = layers[seq.shift()].model; 
      //model.once( 'sync', function()
      //{
        //next( seq );
      //});
      //model.fetch();
    //})
    //( _.pluck( config, 'name' ) );

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

    var overlays = layer_factory.overlays
      .make( name, opt.view, model );
    

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

        update_clusters_size( layers, mapview );

      });

    return {
      model: model
      ,view: { 
        overlays: overlays 
      }
    };
  }

  function update_clusters_size(layers,mapview)
  {

    var visible_layers = 0;
    var cant_layers = 0;
    var i, j, overlays;

    for ( i in layers )
    {
      overlays = layers[i].view.overlays;
      for ( j in overlays )
      {
        if ( overlays[j].is_visible() )
          visible_layers++;
        break;
      }
      cant_layers++;
    }

    //var max_size = lerp2d( 
        //mapview.zoom(), 9, 20, 140, 220 );

    for ( i in layers )
    {
      layers[i].view.overlays.clusterer.size(
        lerp2d( visible_layers, 
          0, cant_layers, 
          40, 150 )
        );
    }
  } 

  function close_all_infowins()
  {}

  function add_detalle( feature, mapview )
  {
    if ( cur_detalle )
    {
      cur_detalle.close();
      cur_detalle = null;
    }

    var props = feature.get('properties');
    var feature_abm;

    var DetalleCtrler = 
      props.type === 'historias'
      ? HistoriaDetalleCtrler
      : FeatureDetalleCtrler;

    cur_detalle = new DetalleCtrler(
        layers, feature, mapview );

    cur_detalle.on( 'close', function()
    {
      cur_detalle.off();
      cur_detalle = null;
      ui.$widgets.show();

      if ( feature_abm )
        feature_abm.close();
    });

    ui.$widgets.hide();

    if ( cur_detalle instanceof 
        FeatureDetalleCtrler 
        && login.logged() )
    {
      feature_abm = new FeatureABMview({
        feature: feature
        ,layers: layers
      });

      $('body').append(feature_abm.render().el);
    }

  }

  //TODO hacer un layer de verdad de subcuencas
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
        if ( ! cur_detalle )
          ui.$widgets.show();
      }
    });

    return ui;
  }

  
  // init


  login = new Login();
  login.init();

  mapview = new GMapView({
    el: document.getElementById("map")
  }); 

  gcuenca = new GCuencaView({
    map: mapview.map()
  });
  gcuenca.render();

  var ui = init_ui( {}, mapview );

  var colores = new LayerColors();
  colores.add_css();

  var layers_config = [

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
        ,color: colores.get('industrias')
        ,overlays: ['canvas_points']
        ,visible: true
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
        ,color: colores.get('basurales')
        ,visible: true
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
        ,visible: true
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
        ,visible: true
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
        ,visible: true
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
        ,visible: true
      }
    }

  ]; //end of layers_config


  make_gsubcuencas_layer( mapview );

  make_layers( mapview, layers_config );   

  update_clusters_size( layers, mapview );
}

function lerp2d( x, x1, x2, y1, y2 )
{
  return (x-x1) / (x2-x1) * (y2-y1) + y1;
}

return App;

});

