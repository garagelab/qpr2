define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'text!tpl/detalles/titulo.html'
  ], 

function( $, _, Backbone, tpl ) 
{

'use strict';

var TituloView = Backbone.View.extend({ 

  initialize: function() 
  { 
    //var opt = this.options;
    //this.$el.addClass( 'titulo' );
    //this.expanded = false;
  }

  ,tpl: _.template( tpl )

  //,events: {
    //'click .titulo .footer': 'toogle_size'
  //}

  ,render: function( data )
  {
    this.$el.html( this.tpl( data ) );
    return this;
  }

  //,toogle_size: function()
  //{
    //var el = this.$el
      //.find('.titulo .cuerpo.ctr-content');

    //if ( ! this.expanded )
      //el.addClass('expanded');
    //else
      //el.removeClass('expanded');

    //this.expanded = !this.expanded;
  //} 

});

return TituloView;

});

