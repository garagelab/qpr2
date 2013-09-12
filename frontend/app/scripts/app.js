define( [ 
    //libs
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'utils'
    ,'user'
    ,'ui'
    //models
    ,'models/qpr/Collection'
    ,'models/qpr/Feature'
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
    //controllers
    ,'controllers/HistoriaDetalleCtrler'
    ,'controllers/FeatureDetalleCtrler'
    ,'controllers/FeatureABMctrler'
    ], 

function( 
  $, _, Backbone

  ,utils
  ,User
  ,UI

  ,Collection
  ,Feature
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

  ,HistoriaDetalleCtrler
  ,FeatureDetalleCtrler
  ,FeatureABMctrler

  ) 
{

'use strict';

var App = function( config ) 
{ 

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


  var user, ui;
  var layers;
  var mapview, gcuenca;
  var cur_detalle;

  var layer_factory = 
  {
    collection: {
      fusiontables: {}
      ,crowdmap: {}
    }
    ,overlays: {}
  };

  layer_factory.collection.fusiontables.make = 
  function( name, opt )
  {
    //capitalize name
    var parserclass = name.charAt(0).toUpperCase() + name.slice(1);

    var parser = new FT.Parsers
      [parserclass]({
        name: name
        ,icon: opt.icon
      });

    var api = new FT.API({
      ftid: opt.ftid
      ,read: { cols: parser.db() }
    });

    var collection = new Collection([], {
      model: Feature
      ,name: name
      ,api: api
      ,parser: parser
    }); 

    // TODO dispose layer collection
    collection.listenTo( 
      parser, 
      'add:feature', 
      collection.add,
      collection );

    parser.on('complete', function()
    {
      init_fetch_complete();
    });

    return collection;
  }

  layer_factory.collection.crowdmap.make = 
  function( name, opt )
  {
    //capitalize name
    var parserclass = name.charAt(0).toUpperCase() + name.slice(1);

    var parser = new Crowdmap.Parsers
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

    var collection = new Collection([], {
      model: Feature
      ,name: name
      ,api: api
      ,parser: parser
    }); 

    // TODO dispose layer collection
    collection.listenTo( 
      parser, 
      'add:feature', 
      collection.add,
      collection );

    parser.on('complete', function()
    {
      init_fetch_complete();
    });

    return collection;
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

    //ol.infowins.listenTo( 
        //ol.polygons,  
        //'select:feature',
        //ol.infowins.infowin, 
        //ol.infowins );

    ol.infowins.on(
      'select:feature',
      function( feature )
      {
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
    var layers = {};

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

    return layers;
  }

  function make_layer( opt, mapview )
  {
    var name = opt.name;

    // copy ref icon.url from view to model
    ( opt.model.icon || (opt.model.icon = opt.view.icon ) )
    //( opt.model.icon || (opt.model.icon = {
      //url: opt.view.icon.url
    //}) )

    var collection = layer_factory.collection
      [opt.model.type]
        .make( name, opt.model );

    var overlays = layer_factory.overlays
      .make( name, opt.view, collection ); 


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
      model: collection
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

    //var max_size = utils.lerp2d( 
        //mapview.zoom(), 9, 20, 140, 220 );

    for ( i in layers )
    {
      layers[i].view.overlays.clusterer.size(
        utils.lerp2d( visible_layers, 
          0, cant_layers, 
          40, 150 )
        );
    }
  } 

  function close_all_infowins()
  {
    _.each( layers, function( layer ) 
    {
      layer.view.overlays.infowins
        //.hide();
        .infowin().close();
    });
  }

  function add_detalle( feature, mapview )
  {
    if ( ! feature ) return;

    mapview.focus( feature );

    if ( cur_detalle )
    {
      if ( cur_detalle.feature() === feature )
        return;
      cur_detalle.close();
      cur_detalle = null;
    }

    var props = feature.get('properties');
    var feature_abm;

    var config = {
      type: 'fusiontables'
      ,ftid: '1uIgt8vsouqvnDg3TZUFZe4bkMqC1IiM8R006Muw' 
    };

    var DetalleCtrler = 
      props.type === 'historias'
        ? HistoriaDetalleCtrler
        : FeatureDetalleCtrler;

    cur_detalle = new DetalleCtrler({
      layers: layers
      ,feature: feature
      ,mapview: mapview
      ,config: config 
    }); 

    cur_detalle.on( 'close', 
    function()
    {
      cur_detalle.off();
      cur_detalle = null;

      if ( feature_abm )
      {
        feature_abm.off();
        feature_abm.close();
        feature_abm = null;
      }

      ui.show_widgets();

      close_all_infowins();
    });

    ui.hide_widgets();

    if ( cur_detalle instanceof 
        FeatureDetalleCtrler 
        && user.logged() )
    {
      feature_abm = new FeatureABMctrler({
        feature: feature
        ,layers: layers
        ,user: user
        ,config: config 
      });

      feature_abm.on( 'select:historia', 
      function( e )
      {
        add_detalle( 
          e.feature_historia, mapview );
      });

    }

  }

  //TODO hacer un layer de verdad
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

    google.maps.event.addListener(
      layer, 'click',
      function( e )
      {
        //dejamos solo la tabla....
        e.infoWindowHtml = $('<table/>')
          .html( 
            $( e.infoWindowHtml )
              .find('table')
              .html() 
            )
          .html();
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
  
  
  // init


  user = new User();
  user.login();


  mapview = new GMapView({
    el: document.getElementById("map")
  }); 


  gcuenca = new GCuencaView({
    map: mapview.map()
  });
  gcuenca.render();


  ui = new UI({
    mapview: mapview
  });

  ui.on('select:feature', function( e )
  {
    add_detalle( e.feature, mapview );
  });


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
        //,visible: true
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

  ]; //end of layers_config


  layers = make_layers(mapview, layers_config); 

  make_gsubcuencas_layer( mapview );

  update_clusters_size( layers, mapview );

  var init_fetch_complete = 
    _.after( 
      _.keys( layers ).length
      ,function()
      {
        ui.update_feature_search( layers );
      });

  window.layers = layers;
  //window.user = user; 
}

return App;

});

