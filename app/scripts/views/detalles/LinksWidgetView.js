define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'text!tpl/detalles/links_widget.html'
  ], 

function( $, _, Backbone, tpl ) 
{

'use strict';

var LinksWidgetView = Backbone.View.extend({ 

  initialize: function() 
  { 
    //var opt = this.options;
    //this.$el.addClass( 'links-widget' );
  }

  ,tpl: _.template( tpl )

  ,render: function()
  {
    this.$el.html( this.tpl({
      test: 'los links'
    }) );

    return this;
  }

});

return LinksWidgetView;

});

