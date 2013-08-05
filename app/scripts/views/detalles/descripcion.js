define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'text!tpl/detalles/descripcion.html'
    ], 

function( $, _, Backbone, tpl ) 
{

'use strict';

var DescripcionView = Backbone.View.extend({ 

  initialize: function() 
  { 
    //var opt = this.options;
    //this.$el.addClass( 'descripcion' );
    this.expanded = false;
  }

  ,tpl: _.template( tpl )

  ,events: {
    //'click .descripcion .footer': 'toogle_size'
  }

  ,toogle_size: function()
  {
    var el = this.$el
      .find('.descripcion .cuerpo.content');

    if ( ! this.expanded )
      el.addClass('expanded');
    else
      el.removeClass('expanded');

    this.expanded = !this.expanded;
  }

  ,render: function( data )
  {
    this.$el.html( this.tpl( data ) );
    return this;
  }

});

return DescripcionView;

});

