define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'models/qpr/Layer'
    ,'models/ft/FT'
    ,'views/detalles/HistoriaView'
    ], 

function( $, _, Backbone, 
  Layer, FT, HistoriaView ) 
{

'use strict';

var HistoriaDetalleCtrler = 
function( layers, feature, mapview )
{
  _.extend( this, Backbone.Events );

  var hid = feature.get('id');

  var ftid = 
  '1uIgt8vsouqvnDg3TZUFZe4bkMqC1IiM8R006Muw';

  var layers_models = {};
  for ( var k in layers )
    layers_models[k] = layers[k].model;

  //console.log('historia detalle ctrler',layers)

  var parser = new FT.LayerParsers
    .HistoriaDetalle({
      name: hid
      ,layers_models: layers_models
    });

  var api = new FT.API({
    sql: [
      'SELECT '
      ,parser.db.join(',')
      ,' FROM '
      ,ftid
      ,' WHERE '
      ,'hid'
      ,' = '
      ,'\''+hid+'\''
    ].join('') 
  });

  var model = new Layer([], {
    name: hid
    ,api: api
    ,parser: parser
  });

  //var model = new FT.Historia([], {
    //ftid: 
    //'1uIgt8vsouqvnDg3TZUFZe4bkMqC1IiM8R006Muw'
    //,feature: feature
    //,layers: layers_models
  //});

  var view = new HistoriaView({
    model: model
    ,feature: feature
  }); 

  var extra_markers = [];

  view.on( 'close', function()
  {
    view.off();

    _.each( extra_markers, function( m )
    {
      m.setMap( null );
    });
    extra_markers = null;

    this.trigger('close');

  });

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

  model.fetch();

  this.close = function()
  {
    //va a triggerear evento close de view
    view.close();
  }

};

return HistoriaDetalleCtrler;

});

