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
  }

  ,tpl: _.template( tpl )

  ,render: function( data )
  {
    this.$el.html( this.tpl( data ) );
    return this;
  }

});

return DescripcionView;

});

