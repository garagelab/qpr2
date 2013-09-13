define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    //models
    ,'models/qpr/Collection'
    ,'models/qpr/Feature'
    ,'models/ft/FT'
    ,'models/crowdmap/crowdmap'
    //overlays
    ,'views/gmaps/gmarkers_view'
    ,'views/gmaps/gpolygons_view'
    ,'views/gmaps/ginfowins_view'
    ,'views/gmaps/gclusterer_view'
    ,'views/gmaps/gcanvaslayer_view'
    //views
    ,'views/ui/LayerControlView'
    ], 

function( $, _, Backbone

  ,Collection
  ,Feature
  ,FT
  ,Crowdmap

  ,GMarkersView
  ,GPolygonsView 
  ,GInfowinsView 
  ,GClustererView 
  ,GCanvasLayerView 

  ,LayerControlView 

  )
{

'use strict';

var LayerCtrler = function( opt, mapview )
{
  _.extend( this, Backbone.Events );

  var self = this;
  var name = opt.name;

  // copy ref icon.url from view to model
  ( opt.model.icon || (opt.model.icon = opt.view.icon ) )
  //( opt.model.icon || (opt.model.icon = {
    //url: opt.view.icon.url
  //}) )


  var collection = layer_factory.collection
    [opt.model.type]
      .make( name, opt.model );

  collection.on(
    'parse:complete'
    ,function()
    {
      self.trigger('parse:complete');
    });


  var overlays = layer_factory.overlays
    .make( name, opt.view, collection, mapview); 

  if ( overlays.infowins ) 
    overlays.infowins.on(
      'select:feature'
      ,function( feature )
      {
        self.trigger('select:feature', feature);
      });


  // ui control

  var ctrl_view = new LayerControlView({
    name: name
    ,el: '.layer-controls .layer.'+name
    ,visible: opt.view.visible
  });

  ctrl_view.on(
    'change:visibility',
    function( v )
    {
      //var k;
      //for ( k in overlays )
        //overlays[k].visible( v );

      _.each( overlays, function( ol )
      {
        ol.visible( v );
      });

      self.trigger( 'change:visibility', v );

    });

    
  // TODO hacer getters
  this.model = collection;
  this.view = { overlays: overlays };

  // TODO dispose layer controller
  this.dispose = function()
  {
    // dispose overlays
    collection.off();
    collection.stopListening();
    ctrl_view.off();
    ctrl_view.remove();
    this.off();
  }

};

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

  collection.listenTo( 
    parser, 
    'add:feature', 
    collection.add,
    collection );

  parser.on('complete', function()
  {
    collection.trigger('parse:complete');
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

  collection.listenTo( 
    parser, 
    'add:feature', 
    collection.add,
    collection );

  parser.on('complete', function()
  {
    collection.trigger('parse:complete');
  });

  return collection;
} 

layer_factory.overlays.make = 
function( name, opt, model, mapview )
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

//darktheme
//layer_factory.overlays.make = 
//function( name, opt, model )
//{ 

  //var ol = {

  //// default overlays

  //polygons: new GPolygonsView({
    //name: name
    //,model: model
    //,map: mapview.map()
    //,color: opt.color
    //,visible: opt.visible
  //})

  //,infowins: new GInfowinsView({
    //name: name
    //,model: model
    //,map: mapview.map()
  //})

  //,canvas_points: new GCanvasLayerView({
    //name: name
    //,model: model
    //,map: mapview.map()
    //,color: opt.color
    //,visible: opt.visible
    //,size: opt.canvas_size
  //})

  //}; //end of default overlays


  //// wire default overlays

  //ol.canvas_points.listenTo( 
    //model, 'add', 
    //ol.canvas_points.feature_added,
    //ol.canvas_points );

  //return ol;

//}

return LayerCtrler;

});

