define( [ 
    //libs
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'utils'
    ,'router'
    ,'user'
    ,'ui'
    //views
    ,'views/gmaps/gmap_view'
    ,'views/gmaps/gcuenca_view'
    ,'views/ui/LayerControlView'
    //controllers
    ,'controllers/LayerCtrler'
    ,'controllers/StatsCtrler'
    ,'controllers/HistoriaDetalleCtrler'
    ,'controllers/FeatureDetalleCtrler'
    ,'controllers/FeatureABMctrler'
    ], 

function( 
  $, _, Backbone

  ,utils
  ,Router
  ,User
  ,UI

  ,MapView
  ,CuencaView

  ,LayerControlView 

  ,LayerCtrler
  ,StatsCtrler
  ,HistoriaDetalleCtrler
  ,FeatureDetalleCtrler
  ,FeatureABMctrler

  ) 
{

'use strict';

var App = function( config ) 
{ 

  var router;
  var user, ui;
  var layers;
  var stats;
  var mapview, cuencaview;
  var cur_detalle;

  function make_layers( config, mapview ) 
  {  
    var layers = {};
    var layer, name;

    _.each( config, function( cfg, i )
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
    //( _.pluck( config, 'name' ) );

    return layers;
  }

  function make_layer( opt, mapview )
  {
    var layer = new LayerCtrler( opt, mapview );

    layer.on( 
      'parse:complete'
      ,function( v )
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
        if ( v ) stats.update( layer );
      }); 

    layer.on( 
      'add:feature'
      ,function( feature )
      {
        if ( stats.cur_layer() !== layer )
          return;
        stats.update( layer );
      });

    //if ( opt.view.visible )
      //stats.update( layer );

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
            40, 150 )
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
      layers: layers
      ,feature: feature
      ,mapview: mapview
      ,config: _config 
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
        layer.setMap(v ? mapview.map() : null);
      });
  }

  // init

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
    mapview: mapview
  });

  ui.on('select:feature', function( feature )
  {
    add_detalle( feature, mapview );
  });

  stats = new StatsCtrler();

  layers = make_layers( config, mapview );

  router = new Router( layers );

  router.on('route:ready', function( feature )
  {
    add_detalle( feature, mapview );
  });

  make_gsubcuencas_layer( mapview );

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
  //window.user = user; 
}

return App;

});

