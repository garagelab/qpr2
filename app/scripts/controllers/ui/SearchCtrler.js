define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'views/ui/SearchGeolocationView'
    ,'views/ui/SearchFeatureView'
    ], 

function( $, _, Backbone
  ,SearchGeolocationView
  ,SearchFeatureView
  ) 
{

'use strict';

var SearchCtrler = function( opt )
{
  _.extend( this, Backbone.Events );

  var geo_view = new SearchGeolocationView({
    mapview: opt.mapview
  });

  var feature_view = new SearchFeatureView({
    mapview: opt.mapview
  });

  feature_view.on('select:feature', function( e )
  {
    this.trigger('select:feature', {
      feature: _features[ e.name ]
    });
  }
  , this );

  opt.$container.append(
      geo_view.render().el );

  opt.$container.append(
      feature_view.render().el );

  var _features = {};

  this.update_feature_search = function( layers )
  {
    _features = parse_features( layers );
    feature_view.render({
      features: _.keys( _features )
    });
  }

  function parse_features( layers ) 
  {
    //var fnames = [];
    //var props, lfnames;

    var name, _features = {};

    _.each( layers
    ,function( layer, k )
    {

      _.each( layer.model.models
      ,function( feature )
      {
        if ( feature.get('geometry').type 
              === 'Point' )
        {
          name = feature
                  .get('properties').titulo; 
          _features[ name ] = feature;
        }
      });

      //props = _.map( layer.model.toJSON()
        //,function( v, k )
        //{
          //return v.geometry.type === 'Point' 
            //? v.properties
            //: null;
        //});

      //props = _.without( props, null );

      //lfnames = _.map( props
        //,function( v, k )
        //{
          //return v.titulo;
        //});

      //fnames.push( lfnames );
    });

    //return _.flatten( fnames );

    return _features;
  }

};

return SearchCtrler;

});

