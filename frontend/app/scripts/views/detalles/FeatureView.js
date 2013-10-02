define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'utils'
  ,'text!tpl/detalles/feature.html'
  ], 

function( $, _, Backbone, utils, tpl )
{

'use strict';

var FeatureView = Backbone.View.extend({ 

  initialize: function() 
  { 
    this.$el.addClass('feature-view');
  }

  ,tpl: _.template( tpl )

  ,render: function()
  {
    var feature = this.model; 
    var props = feature.get('properties');

    var temas = props.temas
      ? _.without(
          props.temas.split(',')
          ,props.type )
        .join(', ')
      : '';

    if ( !_.isEmpty( temas ) )
      temas = 'Temas: '+temas;

    var date = props.date
      ? utils.date_iso2arg( props.date.iso )
      : '';

    var locacion = props.locacion 
      ? 'Localización: ' + props.locacion
      : '';

    this.$el.html( 
      _.unescape( this.tpl({
        titulo: props.titulo
        ,txt: props.descripcion
        ,date: date
        ,temas: temas 
        ,locacion: locacion
        ,eventos: props.eventos
        ,eventos_title: props.eventos_title
        ,icon_url: props.icon.url
        ,layer_type: props.type
      }) )
    );

    //new CloseBtn().appendTo( 
        //this.$el.find('.close-svg'), 
        //20 );

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

