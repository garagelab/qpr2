define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'text!tpl/detalles/descripcion_historia.html'
  ], 

function( $, _, Backbone, tpl ) 
{

'use strict';

var DescripcionHistoriaView = Backbone.View.extend({ 

  initialize: function() 
  { 
    //var opt = this.options;
    this.$el.addClass('descripcion-historia-view');
  }

  ,tpl: _.template( tpl )

  ,render: function( data )
  {
    this.$el.html( this.tpl( data ) );
    return this;
  }

});

return DescripcionHistoriaView;

});

