define( [ 
    //libs
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'utils'
    ,'user'
    ,'ui'
    //views
    ,'views/gmaps/gmap_view'
    ,'views/gmaps/gcuenca_view'
    ,'views/ui/LayerControlView'
    ,'views/ui/LayerColors'
    //controllers
    ,'controllers/LayerCtrler'
    ,'controllers/HistoriaDetalleCtrler'
    ,'controllers/FeatureDetalleCtrler'
    ,'controllers/FeatureABMctrler'
    ], 

function( 
  $, _, Backbone

  ,utils
  ,User
  ,UI

  ,GMapView
  ,GCuencaView

  ,LayerControlView 
  ,LayerColors

  ,LayerCtrler
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
      });

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
        //darktheme
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
        //darktheme
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
        //darktheme
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
        //,visible: true
        //darktheme
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
        //darktheme
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

