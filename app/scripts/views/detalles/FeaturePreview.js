define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'text!tpl/detalles/feature_preview.html'
  ], 

function( $, _, Backbone, tpl ) 
{

'use strict';

var FeaturePreview = Backbone.View.extend({ 

  initialize: function() 
  { 
    //var opt = this.options;
    //this.$el.addClass( 'descripcion' );
  }

  ,tpl: _.template( tpl )

  ,render: function( data )
  {
    data = data || {
      titulo: ''
      ,date: ''
      ,txt: ''
    };
    this.$el.html( this.tpl( data ) );
    return this;
  }

});

return FeaturePreview;

});

