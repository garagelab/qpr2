define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'views/detalles/timeline'
    ,'views/detalles/titulo'
    ,'views/detalles/descripcion'
    //,'views/detalles/links-widget'
    ], 

function( 
  $, _, Backbone 
  ,TimelineView
  ,TituloView 
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

    var self = this;
    var timer = 0, delay = 1200;
    this.on_win_resize = function()
    {
      self.descripcion.$el.hide();
      clearTimeout( timer );
      timer = setTimeout( 
        function()
        {
          self.update_descripcion_loc.call(self);
        }, delay );
    };

    $(window).on('resize', this.on_win_resize);
  }

  ,feature_added: function( feature ) 
  {
    this.timeline.add( feature ); 
    this.update_descripcion_loc();
  }

  ,render: function()
  {
    //console.log('render view historia') 
    var f = this.options.feature; 

    var titulo = new TituloView();
    this.$el.append( 
        titulo.render({
          titulo: f.get('id')
          //,txt: 
          //f.get('properties').descripcion
        }).el );

    this.timeline = new TimelineView();
    this.$el.append( 
        this.timeline.render().el );

    this.descripcion = new DescripcionView();
    this.descripcion.$el.hide();
    this.$el.append( 
        this.descripcion.render({
          txt: 
            f.get('properties').descripcion
        }).el ); 

    //var links = new LinksWidgetView();
    //this.$el.append( 
        //links.render().el );

    return this;
  }

  ,events: {
    'click .timeline .content': 'close'
    //,'click .titulo .footer': 'expand'
  }

  ,close: function()
  {
    $(window).off('resize', this.on_win_resize);
    this.remove();
    this.trigger('close');
  }

  ,update_descripcion_loc: function()
  {
    var descripcion_top = 
      this.timeline.$el.find('.timeline').position().top
      + this.timeline.bottom() 
      //+ feature.get('properties').icon.height
      //+ parseFloat( this.timeline.$el.find('.timeline').css('bottom') )

    this.descripcion.$el.find('.descripcion')
      .css({ top: descripcion_top });

    this.descripcion.$el.show();
  }

});

return HistoriaView;

});

