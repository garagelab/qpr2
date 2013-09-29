define( [ 
    //libs
    'jquery'
    ,'underscore'
    ,'backbone'
    //qpr
    ,'config'
    ,'utils'
    ,'router'
    ,'user'
    ,'ui'
    ,'stats'
    //views
    //,'views/lmaps/lmap_view'
    //,'views/lmaps/lcuenca_view'
    ,'views/gmaps/gmap_view'
    ,'views/gmaps/gcuenca_view'
    ,'views/ui/LayerControlView'
    ,'views/ui/LayerColors'
    //controllers
    ,'controllers/LayerCtrler'
    ,'controllers/stats/StatsLayerCtrler'
    ,'controllers/stats/StatsIntroCtrler'
    ,'controllers/detalles/HistoriaDetalleCtrler'
    ,'controllers/detalles/FeatureDetalleCtrler'
    ,'controllers/abm/FeatureABMctrler'
    ], 

function( 
  $, _, Backbone

  ,config
  ,utils
  ,Router
  ,User
  ,UI
  ,Stats

  ,MapView
  ,CuencaView

  ,LayerControlView 
  ,LayerColors 

  ,LayerCtrler
  ,StatsLayerCtrler
  ,StatsIntroCtrler
  ,HistoriaDetalleCtrler
  ,FeatureDetalleCtrler
  ,FeatureABMctrler

  ) 
{

'use strict';

var App = function() 
{ 

  var router;
  var user, ui;
  var layers;
  var stats, stats_layer, stats_intro;
  var mapview, cuencaview;
  var cur_detalle;

  function make_layers( layers_cfg, mapview ) 
  {  
    var layers = {};
    var layer, name;

    _.each( layers_cfg, function( cfg, i )
    {
      name = cfg.name;

      layer = make_layer( cfg, mapview );

      layers[ name ] = layer;

      //layer.model.fetch();

      // fetch with 1sec delay
      _.delay( 
        _.bind(layer.model.fetch,layer.model)
        , 1000*i );
    }); 

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
    //( _.pluck( layers_cfg, 'name' ) );

    return layers;
  }

  function make_layer( opt, mapview )
  {
    var layer = new LayerCtrler( opt, mapview );

    layer.on( 
      'parse:complete'
      ,function()
      {
        init_fetch_complete();
      });

    layer.on( 
      'select:feature'
      ,function( feature )
      {
        add_detalle( feature, mapview );
      });

    layer.on( 
      'change:visibility'
      ,function( v )
      {
        update_clusters_size( layers, mapview );
        var lname = layer.name();
        if ( v ) 
          stats_layer.update( 
            lname, stats.get( lname ) );
      }); 

    layer.on( 
      'add:feature'
      ,function( feature )
      {
        stats.add_feature( feature );

        var lname = layer.name();
        var lstat = stats.get( lname );

        if ( stats_intro )
          stats_intro.update( stats );

        if(stats_layer.cur_layer_name === lname)
          stats_layer.update( lname, lstat );

      });

    //if ( opt.view.visible )
      //stats_layer.update( layer );

    return layer;

  }

  function update_clusters_size(layers,mapview)
  {

    var visible_layers = 0;
    var cant_layers = 0;
    var clstr;

    _.each( layers, function( layer ) 
    {
      _.find( layer.view.overlays, function(ol) 
      {
        if ( ol.is_visible() )
          visible_layers++;
        return true;
      });
      cant_layers++;
    });

    //var max_size = utils.lerp2d( 
        //mapview.zoom(), 9, 20, 140, 220 );

    _.each( layers, function( layer ) 
    {
      clstr = layer.view.overlays.clusterer;
      if ( clstr ) 
        clstr.size(
          utils.lerp2d( visible_layers, 
            0, cant_layers, 
            40, 120 )
          );
    });
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

    if ( router )
      router.navigate( 
        encodeURI( props.type+'/'+props.id ) );

    var feature_abm;

    var _config = {
      type: 'fusiontables'
      ,ftid: '1uIgt8vsouqvnDg3TZUFZe4bkMqC1IiM8R006Muw' 
    };

    var DetalleCtrler = 
      props.type === 'historias'
        ? HistoriaDetalleCtrler
        : FeatureDetalleCtrler;

    cur_detalle = new DetalleCtrler({
      el: $('body')
      ,layers: layers
      ,feature: feature
      ,mapview: mapview
      ,config: _config 
    });   

    cur_detalle.on( 
      'close', 
      function()
      {
        cur_detalle.off();
        cur_detalle.stopListening();
        cur_detalle = null;

        if ( feature_abm )
        {
          feature_abm.off();
          feature_abm.close();
          feature_abm = null;
        }

        ui.show_widgets();

        close_all_infowins();

        if ( router )
          router.navigate();
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
        ,config: _config 
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
  function make_gsubcuencas_layer( _gmap ) 
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

    new LayerControlView({
        name: name
        ,el: '.layer.'+name
        ,visible: false
      })

      .on( 'change:visibility'
        ,function( v )
        {
          layer.setMap( v ? _gmap : null);
        });
  }

  // init

  new LayerColors().add_css([{
    name: 'subcuencas'
    ,view: { color: '#20B2AA' }
  }].concat( config.layers) );

  user = new User();
  user.login();

  mapview = new MapView({
    el: document.getElementById("map")
  }); 

  cuencaview = new CuencaView({
    map: mapview.map()
  });
  cuencaview.render();

  ui = new UI({
      el: $('body')
      ,mapview: mapview
    })
    .on('select:feature', function( feature )
    {
      add_detalle( feature, mapview );
    });

  layers = make_layers(config.layers, mapview); 

  router = new Router()

    .on('route:ready', function( feature )
    {
      add_detalle( feature, mapview );
    })

    .on('route:info', function( pagina )
    {
      console.log('info',pagina)
    })

    .on('route:tabla', function(layer_name)
    {
      console.log('tabla',layer_name)
    })
    
    .init( layers );

  make_gsubcuencas_layer(
    mapview.map() );
    //mapview.map( 'google' ) );


  stats = new Stats();

  stats_layer = new StatsLayerCtrler({
    el: $('body')
  });

  stats_intro = new StatsIntroCtrler({
      el: $('body')
    })
    .on('close', function()
    {
      stats_intro.off();
      stats_intro = null;
    });


  update_clusters_size( layers, mapview );


  var init_fetch_complete = 
    _.after( 
      _.keys( layers ).length
      ,function()
      {
        ui.update_feature_search( layers );
      }); 


  // disable markers/clusters

  //$( window ).keyup( function(e)
  //{
    //if ( e.keyCode !== 67 ) //c
      //return;

    //var ols, visible;

    //_.each( [
      //layers.industrias
      //,layers.basurales
      //,layers.asentamientos
      //,layers.ecopuntos
    //]
    //,function( layer )
    //{
      //ols = layer.view.overlays; 
      //visible = ols.clusterer.is_visible();
      //if ( visible ) 
      //{
        //ols.clusterer.hide();
        //ols.markers.hide();
        //ols.canvas_icons.render();
      //}
    //});

  //});

  window.layers = layers;
  //window.router = router;
  //window.stats = stats;
  //window.map = mapview.map();
  //window.config = config;
  //window.utils = utils;
  //window.user = user; 
}

return App;

});

