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

var Router = function( layers )
{
  _.extend( this, Backbone.Events );

  var self = this;

  // entity/:id >> entity: function(id)
  var _Router = Backbone.Router.extend(

    _.extend({
      routes: _.object( _.map( 
        _.keys( layers )
        ,function( name )
        {
          return [ name + '/:id', name ];
        } ) )
    }

    ,_.object( _.map( 
      _.keys( layers )
      ,function( name )
      {
        return [ name, function( id )
        {
          route_on({ name:name, id:id });
        }];
      } ) )
    ) 
  );

  var _router = new _Router();
  var _route = null, loading;

  this.navigate = _.bind(_router.navigate, this);

  Backbone.history.start();
  //Backbone.history.start({ pushState: true });

  // listen each layer
  // add:feature || parse:complete
  // to check tha route

  function __route_check(){ _route_check(); }

  var _route_check = _.after( _.keys( layers ).length, route_check );

  function route_on( route )
  {
    loading = new LoadingRoute();
    $('body').append( loading.render().el );

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
    loading.remove();
    loading = null;
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
      //add_detalle( feature, mapview );
      self.trigger('route:ready', feature);
      route_off();
    }
  } 

};

return Router;

});

