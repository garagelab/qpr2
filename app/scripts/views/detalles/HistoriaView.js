define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'d3'
  ,'views/detalles/TimelineView'
  ,'views/detalles/TituloView'
  ,'views/detalles/DescripcionHistoriaView'
  ,'views/detalles/FeaturePreview'
  ], 

function( 
  $, _, Backbone, d3
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

    this.$el.addClass('historia-view');

    this.listenTo( this.collection,
      'add', this.feature_historia_added, this );

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

  ,feature_historia_added: 
  function( feature_historia ) 
  {
    var feature=feature_historia.get('feature');

    // XXX aca se puede decidir que fecha
    // usar para el timeline
    // si la fecha del feature en la historia
    // o la fecha del feature mismo
    var date = feature_historia.get('date');
    //var date = feature.get('properties').date;

    this.timeline.add( feature, date );

    this.update_bottom();
  }

  ,render: function()
  {
    //console.log('render view historia') 

    var self = this;
    var feature = this.options.feature; 
    var props = feature.get('properties');

    var titulo = new TituloView();
    this.$el.append( 
        titulo.render({
          titulo: props.titulo
          //titulo: feature.get('id')
        }).el );

    var timeline = new TimelineView();
    this.$el.append( timeline.render().el );

    var descripcion = 
      new DescripcionHistoriaView();
    descripcion.$el.hide();
    this.$el.append( 
        descripcion.render({
          txt: props.descripcion
        }).el ); 

    var feature_preview = new FeaturePreview();
    feature_preview.$el.hide();
    this.$el.append(feature_preview.render().el);


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

    //new CloseBtn().appendTo( 
        //this.$el.find('.close-svg'), 
        //20 );

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
    var d = e.target.__data__;
    this.trigger('select:feature', d.feature);
  }

  ,update_feature_preview: function( e )
  {
    // d3 datum viene del timeline...
    var d = e.target.__data__;
    var props = d.feature.get('properties');

    //var format = d3.time.format("%d/%m/%Y");

    // para el preview 
    // usamos la fecha del feature
    // y 0j0 puede no tener fecha...
    var date = '';
    if ( props.date )
    {
      var _date = new Date( props.date.iso );
      date = [
        _date.getUTCDate()
        ,'/'
        ,_date.getUTCMonth() + 1
        ,'/'
        ,_date.getUTCFullYear()
      ]
      .join('');
    }

    this.feature_preview.render({
      titulo: props.titulo
      ,date: date
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

