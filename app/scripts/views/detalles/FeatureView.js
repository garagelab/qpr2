define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'views/detalles/CloseBtn'
  ,'text!tpl/detalles/feature.html'
  ], 

function( 
  $, _, Backbone
  ,CloseBtn
  ,tpl 
  )
{

'use strict';

var FeatureView = Backbone.View.extend({ 

  initialize: function() 
  { 
    this.$el.addClass('feature-view');

    //this.listenTo( this.model,
      //'add', this.feature_added, this );
  }

  ,tpl: _.template( tpl )

  ,render: function()
  {
    var feature = this.options.feature; 
    var props = feature.get('properties');

    this.$el.html( this.tpl({
      titulo: props.titulo
      ,txt: props.descripcion
    }) );

    new CloseBtn().appendTo( 
        this.$el.find('.close-svg'), 
        20 );

    return this;
  }

  ,events: {
    'click .close': 'close'
  }

  ,close: function()
  {
    this.remove();
    this.trigger('close');
  }

});

return FeatureView;

});

