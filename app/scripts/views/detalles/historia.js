define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'views/detalles/timeline'
    ,'views/detalles/descripcion'
    //,'views/detalles/links-widget'
    ], 

function( 
  $, _, Backbone, 
  TimelineView
  ,DescripcionView 
  ,LinksWidgetView 
  )
{

'use strict';

var HistoriaView = Backbone.View.extend({ 

  initialize: function() 
  { 
    //var opt = this.options;
    this.$el.addClass( 'detalle historia' );

    this.listenTo( this.model,
      'add', this.feature_added, this );
  }

  ,feature_added: function( feature ) 
  {
    this.timeline.add( feature ); 
  }

  ,render: function()
  {
    //console.log('render view historia') 
    var f = this.options.feature; 

    var descripcion = new DescripcionView();
    this.$el.append( 
        descripcion.render({
          titulo: f.get('id')
          //,texto: f.get('properties').descripcion
        }).el ); 

    this.timeline = new TimelineView();
    this.$el.append( 
        this.timeline.render().el );

    //var links = new LinksWidgetView();
    //this.$el.append( 
        //links.render().el );

    return this;
  }

  ,events: {
    'click .timeline .content': 'close'
    //,'click .descripcion .footer': 'expand'
  }

  ,close: function()
  {
    this.remove();
    this.trigger('close');
  }

});

return HistoriaView;

});

