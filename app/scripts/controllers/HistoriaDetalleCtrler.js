define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'models/qpr/Collection'
    ,'models/qpr/FeatureHistoria'
    ,'models/ft/FT'
    ,'views/detalles/HistoriaView'
    ], 

function( $, _, Backbone, 
  Collection, FeatureHistoria, 
  FT, HistoriaView ) 
{

'use strict';

var HistoriaDetalleCtrler = function( opt )
{
  _.extend( this, Backbone.Events );

  var layers = opt.layers;
  var feature = opt.feature;
  var mapview = opt.mapview;

  var collection = HistoriaDetalleCtrler
    .factory.model[opt.config.type]
    .make( opt );

  var view = new HistoriaView({
    collection: collection
    ,feature: feature
  }); 

  var extra_markers = [];

  view.on( 'close', function()
  {
    _.each( extra_markers, function( m )
    {
      m.setMap( null );
    });
    extra_markers = null;

    this.trigger('close');
    
    view.off();
    collection.off();
  }
  , this );

  view.on('select:feature', function( feature )
  {
    mapview.focus( feature );
    
    var layer = layers
      [ feature.get('properties').type ];

    layer.view.overlays.infowins
      .infowin( feature );

    var marker = layer.view.overlays.markers
        .make_marker( feature );

    _.each( extra_markers, function( m )
    {
      if ( marker.getPosition()
            .equals( m.getPosition() ) )
      {
        marker.setMap( null );
        marker = null;
        return false;
      }
    });

    if ( marker )
    {
      marker.setMap( mapview.map() );
      extra_markers.push( marker );
    }

  });

  $('body').append( view.render().el );

  collection.fetch();

  this.close = function()
  {
    //va a triggerear evento close de view
    view.close();
  }

};

HistoriaDetalleCtrler
.factory = {
  model: {
    fusiontables: {
      make: function(opt){}
    }
  }
};

HistoriaDetalleCtrler
.factory.model.fusiontables.make = 
function( opt )
{
  var layers = opt.layers;
  var ftid = opt.config.ftid;
  var hid = opt.feature.get('properties').id;

  var parser = new FT.Parsers.HistoriaDetalle({
    name: 'historia_'+hid
    ,layers: layers
  });

  var api = new FT.API({
    ftid: ftid
    ,read: {
      cols: parser.db()
      ,filters: [
        ,' WHERE '
        ,'hid'
        ,' = '
        ,'\''+ hid +'\''
      ]
      .join('')
    }
  });

  var collection = new Collection([], {
    model: FeatureHistoria
    ,name: hid
    ,api: api
    ,parser: parser
  });

  collection.listenTo( 
    parser, 
    'add:feature_historia', 
    collection.add,
    collection );

  //var model = new FT.Historia([], {
    //ftid
    //,feature: feature
    //,layers: layers
  //});

  return collection;
};

return HistoriaDetalleCtrler;

});

