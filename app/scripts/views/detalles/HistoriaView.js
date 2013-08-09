define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'views/detalles/TimelineView'
  ,'views/detalles/TituloView'
  ,'views/detalles/DescripcionHistoriaView'
  ,'views/detalles/FeaturePreview'
  ], 

function( 
  $, _, Backbone 
  ,TimelineView
  ,TituloView 
  ,DescripcionHistoriaView 
  ,FeaturePreview 
  )
{

'use strict';

var HistoriaView = Backbone.View.extend({ 

  initialize: function() 
  { 
    var self = this;

    //var opt = this.options;
    //this.$el.addClass( 'detalle historia' );

    this.listenTo( this.model,
      'add', this.feature_added, this );

    // init win resize event
    // to update descripcion loc y
    var timer = 0, delay = 1200;
    this.on_win_resize = function()
    {
      self.descripcion.$el.hide();
      self.feature_preview.$el.hide();
      clearTimeout( timer );
      timer = setTimeout( 
        function()
        {
          self.update_bottom.call(self);
        }, delay );
    };

    $(window).on('resize', this.on_win_resize);
  }

  ,feature_added: function( feature ) 
  {
    this.timeline.add( feature ); 
    this.update_bottom();
  }

  ,render: function()
  {
    //console.log('render view historia') 

    var self = this;
    var f = this.options.feature; 

    var titulo = new TituloView();
    this.$el.append( 
        titulo.render({
          titulo: f.get('id')
        }).el );

    var timeline = new TimelineView();
    this.$el.append( timeline.render().el );

    var descripcion = 
      new DescripcionHistoriaView();
    descripcion.$el.hide();
    this.$el.append( 
        descripcion.render({
          txt: f.get('properties').descripcion
        }).el ); 

    var feature_preview = new FeaturePreview();
    feature_preview.$el.hide();
    this.$el.append(feature_preview.render().el);


    // css para $el 
    // para ubicarlos dinamicamente
    // con update_bottom()
    var _css = { 
      position: 'absolute'
      ,width: '100%'
    };
    descripcion.$el.css( _css );
    feature_preview.$el.css( _css );


    // wait for $el to be in the dom
    // to update descripcion loc y
    var timer = 0, delay = 100;
    (function check_t()
    {
      clearTimeout( timer );
      self.$timeline = $('body')
        .find('.timeline');
      if ( self.$timeline.length === 0 )
        timer = setTimeout( check_t, delay ); 
      else
        self.update_bottom();
    })();


    // add close svg

    var $close = this.$el.find('.close-svg'); 
    var csize = 20;

    var close = d3
      .select( $close[0] )
      .append( 'svg' )
      .append( 'g' )
      .attr( 'style', 
        'stroke: rgba(0,0,0, 0.5);'+
        'stroke-linecap: "round";'+
        'stroke-width: 1.2;' 
        );

    close.append( 'line' )
      .attr( 'x1', 0 )
      .attr( 'y1', 0 )
      .attr( 'x2', csize )
      .attr( 'y2', csize );
    close.append( 'line' )
      .attr( 'x1', csize )
      .attr( 'y1', 0 )
      .attr( 'x2', 0 )
      .attr( 'y2', csize );

    // public
    this.timeline = timeline;
    this.descripcion = descripcion;
    this.feature_preview = feature_preview;

    return this;
  }

  ,events: {

    'click .close': 'close'

    ,'mouseenter .timeline image': 
        'update_feature_preview'

    ,'click .timeline image': 'feature_selected'

  }

  ,feature_selected: function( e )
  {
    var feature = e.target.__data__;
    this.trigger('select:feature', feature);
  }

  ,update_feature_preview: function( e )
  {
    // d3 datum viene del timeline...
    var feature = e.target.__data__;
    var props = feature.get('properties');
    var date = new Date( props.date.iso );
    var format = d3.time.format("%d/%m/%Y");
    this.feature_preview.render({
      titulo: props.titulo
      ,date: format( date )
      ,txt: props.descripcion
    });
  }

  ,close: function()
  {
    $(window).off('resize', this.on_win_resize);
    this.remove();
    this.trigger('close');
  }

  ,update_bottom: function()
  {
    var _top = 
      this.$timeline.position().top
      + this.timeline.bottom() 
      //+ feature.get('properties').icon.height
      //+ parseFloat( this.timeline.$el.find('.timeline').css('bottom') )

    this.descripcion.$el
      //.find(':first-child')
        .css({ top: _top });

    this.feature_preview.$el
      //.find(':first-child')
        .css({ top: _top }); 

    this.descripcion.$el.show();
    this.feature_preview.$el.show();
  }

});

return HistoriaView;

});

