define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'text!tpl/detalles/feature_add_to_historia.html'
  ], 

function( $, _, Backbone, tpl )
{

'use strict';

var FeatureAddToHistoria=Backbone.View.extend({ 

  initialize: function() 
  { 
    this.$el.addClass(
      'feature-add-to-historia-view' );
  }

  ,tpl: _.template( tpl )

  ,render: function()
  {
    this.$el.html( this.tpl({
      //historias: historias
    }) );

    return this;
  }

  ,events: {
    'click button': 'upload'
  }

  ,close: function()
  {
    this.remove();
  }

  ,upload: function()
  {
    var feature = this.options.feature;
    console.log('upload feature',feature,'args',arguments)
  }

});

return FeatureAddToHistoria;

});

