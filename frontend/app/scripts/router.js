define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'views/ui/LoadingRoute'
    ], 

function( 
  $, _, Backbone
  ,LoadingRoute )
{

'use strict';

var Router = function()
{
  _.extend( this, Backbone.Events );
}

Router.prototype.init = function( layers )
{

  var self = this;

  var info = [
    'proyecto'
    ,'datos_abiertos'
    ,'como_visualizar'
  ];

  var routes = {};

  _.extend( routes, 
    _.object( _.map( 
      _.keys( layers )
      ,function( name )
      {
        return [ name + '/:id', name ];
      } ) ) );

  _.extend( routes, 
      _.object(info,info) );

  _.extend( routes, {'tabla/:layer': 'tabla'} );


  var fns = {};

  _.extend( fns,
    _.object( _.map( 
      _.keys( layers )
      ,function( name )
      {
        return [ name, function( id )
        {
          route_on({ name:name, id:id });
        }];
      } ) ) );

  _.extend( fns, 
    _.object( _.map( 
      info
      ,function( pag )
      {
        return [ pag, function()
        {
          self.trigger('route:info', pag);
        }];
      } ) ) );

  _.extend( fns, {
    'tabla': function( layer_name )
    {
      var layer = layers[ layer_name ];

      if ( layer.parsed() )
      {
        self.trigger(
          'route:tabla', layer_name );
        return;
      }

      add_loading();
      layer.on( 
        'parse:complete'
        ,function()
        {
          self.trigger(
            'route:tabla', layer_name );
          remove_loading();
        });
    }
  });


  // entity/:id >> entity: function(id)
  var _Router = Backbone.Router.extend(
    _.extend({
      routes: routes 
    }
    , fns )
  );

  var _router = new _Router();
  var _route = null, loading;

  this.navigate = _.bind(
      _router.navigate, _router );

  Backbone.history.start();
  //Backbone.history.start({ pushState: true });

  // listen each layer
  // add:feature || parse:complete
  // to check tha route

  function __route_check(){ _route_check(); }

  var _route_check = _.after( _.keys( layers ).length, route_check );

  function route_on( route )
  {
    add_loading();

    _route = route; //save

    _.each( layers, function( layer )
    {
      if ( _route.name === 'historias' )
        layer.on( 
          'parse:complete'
          ,__route_check );
      else
        layer.on('add:feature', route_check);
    });
  } 

  function route_off()
  {
    remove_loading();

    _.each( layers, function( layer )
    {
      if ( _route.name === 'historias' )
        layer.off(
          'parse:complete'
          ,__route_check );
      else
        layer.off('add:feature', route_check);
    });

    _route = null;
  }

  function route_check( feature )
  {
    var name = _route.name;
    var id = _route.id;

    feature = feature || 
      layers[ name ].model.get( id );

    if ( ! feature ) 
      return false;

    var props = feature.get('properties');

    if ( props.type === name 
          && props.id === id )
    {
      self.trigger('route:feature', feature);
      route_off();
    }
  } 

  function add_loading()
  {
    loading = new LoadingRoute();
    $('body').append( loading.render().el );
  }

  function remove_loading()
  {
    loading.remove();
    loading = null;
  }

};

return Router;

});

