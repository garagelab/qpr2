define( [ 
    'jquery' 
    ,'underscore'
    ,'backbone'
    ,'text!tpl/info/proyecto.html'
    ,'text!tpl/info/datos_abiertos.html'
    ,'text!tpl/info/manual.html'
    ,'text!tpl/info/contacto.html'
    ], 

function( $, _, Backbone
  ,tpl_proyecto
  ,tpl_datos_abiertos
  ,tpl_manual
  ,tpl_contacto
)
{

'use strict';

var View = Backbone.View.extend({

  initialize: function() 
  { 
    //var opt = this.options;
  }

  ,tpls: {
    proyecto: 
      _.template( tpl_proyecto )
    ,datos_abiertos: 
      _.template( tpl_datos_abiertos )
    ,manual: 
      _.template( tpl_manual )
    ,contacto: 
      _.template( tpl_contacto )
  }

  ,render: function()
  {
    this.$el.html( 
      this.tpls[this.options.info]() );
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

return View;

});

