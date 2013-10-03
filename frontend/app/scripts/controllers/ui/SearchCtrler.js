define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'views/ui/SearchGeolocationView'
    ,'views/ui/SearchFeatureView'
    ,'views/ui/SearchMunicipiosView'
    ], 

function( $, _, Backbone
  ,SearchGeolocationView
  ,SearchFeatureView
  ,SearchMunicipiosView
  ) 
{

'use strict';

var SearchCtrler = function( opt )
{
  _.extend( this, Backbone.Events );

  var _features = {};

  var geo_view = new SearchGeolocationView({
    mapview: opt.mapview
  });

  var feature_view = new SearchFeatureView({
    mapview: opt.mapview
  });

  var munis_view = new SearchMunicipiosView({
    mapview: opt.mapview
  });

  this.clear_all_fields = function()
  {
    geo_view.clear();
    munis_view.clear();
    feature_view.clear();
  }

  this.update_feature_search = function(layers)
  {
    _features = parse_features( layers );
    feature_view.render({
      features: _.keys( _features )
    });
  }

  //geo_view.on('search', 
      //this.clear_all_fields);
  //munis_view.on('search', 
      //this.clear_all_fields);
  //feature_view.on('search:feature', 
      //this.clear_all_fields);

  feature_view.on( 'search:feature'
    ,function( e )
    {
      this.trigger(
        'search:feature', 
        _features[ e.name ] );
    }
    , this );

  $(opt.el).append( munis_view.render().el ); 
  //$(opt.el).append( geo_view.render().el );
  $(opt.el).append( feature_view.render().el );

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

