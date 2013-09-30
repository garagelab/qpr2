define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'d3'
  ,'text!tpl/detalles/timeline.html'
  ,'qtip2'
  ], 

function( $, _, Backbone, d3, tpl ) 
{

'use strict';

var TimelineView = Backbone.View.extend({ 

  initialize: function() 
  { 
    //var opt = this.options;
    this.$el.addClass('timeline-view');

    _.defaults( this.options, {
      icon_class: 'timeline-icon' 
    });
  }

  ,tpl: _.template( tpl )

  ,render: function()
  {
    this.$el.html( this.tpl({}) );
    this.init_vis();
    return this;
  }

  ,dispose: function()
  {
    this._clock = null;
    this.vis = null;
    this.remove();
  }

  ,init_vis: function()
  { 

    var layout = {
      width: 1000
      ,height: 500
      ,margin: { x: 20, y: 20 }
      ,icons: {
        offset: { bottom: 40, top: 0 }
        ,height: 30 //default
      }
    };

    function make_format( formats ) 
    {
      return function( date ) 
      {
        var i = formats.length - 1;
        var f = formats[i];
        while ( ! f[1]( date ) ) 
          f = formats[--i];
        return f[0]( date );
      };
    }

    function domain( _domain )
    {
      xscale
        .domain( _domain )
        .range([ 
          0 + layout.margin.x, 
          layout.width - layout.margin.x 
        ]);

      xaxis
        .scale( xscale )
        .ticks( d3.time.months, 12 )
        .tickSize( 4 )
        .tickPadding( 6 )
        .tickFormat( format );

      svg.select('.x.axis')
        .call( xaxis );
    }

    // init bottom top
    this._top = layout.icons.offset.top;
    this._bottom = layout.icons.offset.bottom;

    var tipformat = d3.time.format("%d/%m/%Y");

    var format = d3.time.format("%Y");
    //var format = make_format([
      //[ 
        //d3.time.format("%Y"), 
        //function() { return true; }
      //]
      //,[
        //d3.time.format("%m/%y"), 
        //function(d) { return d.getMonth(); }
      //]
    //]); 

    var xscale = d3.time.scale().clamp(true); 
    var xaxis = d3.svg.axis(); 

    var svg = d3
      .select( 
        this.$el.find('.svg-container')[0] )
      .append( 'svg' )
        .attr( 'width', layout.width )
        .attr( 'height', layout.height )
      .append( 'g' )
        .attr( 'class', 'svg-canvas' )

    svg
      .append( 'g' )
      .attr( 'class', 'x axis' )
      //.attr( 'transform',
          //'translate('+
            //layout.timeline.x +','+
            //layout.timeline.y +')')
      //.call( xaxis );

    domain([
      new Date( 2003, 0, 1 )
      ,new Date( 2016, 0, 1 )
    ]); 

    // acceso publico para updatear
    this.vis = {
      data: []
      ,svg: svg
      ,format: format
      ,xscale: xscale
      ,tipformat: tipformat
      ,layout: layout
      //,domain: domain
    };

  }

  /*
   *  date: {
   *    //ISO-8601 2013-07-31T19:28:10.444Z
   *    iso: 'YYYY-MM-DDTHH:mm:ss.sssZ'
   *    ,src: ''
   *  }
   */
  ,add_feature: function( feature, date )
  {
    var opt = this.options;

    //var id = feature.get('id');
    var props = feature.get('properties');

    var _advocacy = props.type === 'acciones' || props.type === 'respuestas';

    var vis = this.vis; 

    vis.layout.icons.height = props.icon.height + 10;

    var ics_off = vis.layout.icons.offset;
    var ics_h = vis.layout.icons.height;

    vis.data.push({
      feature: feature
      ,date: date
    });

    //vis.domain( 
      //d3.extent( vis.data, function( d )
      //{ 
        //var props=d.feature.get('properties');
        //return new Date( date.iso ); 
      //}) );

    var img = vis.svg
      .selectAll( 'image' );

    //var icon_url = this._get_icon_url(feature);
    var icon_url = props.icon.url;

    img
      .data( vis.data )
      .enter()

    .append( 'image' )

      .attr( 'class', opt.icon_class )
      .attr( 'id', function( d ) 
      {
        //var props=d.feature.get('properties');
        var id = d.feature.get('id');
        return opt.icon_class + '-' + id;
      })

      .attr( 'xlink:href', icon_url )
      .attr( 'width', props.icon.width )
      .attr( 'height', props.icon.height )

      .attr( 'x', function( d ) 
      { 
        return vis.xscale( 
          new Date( date.iso ) );
      })

      .attr( 'y', function( d ) 
      { 
        var x = parseFloat(
          this.getAttribute('x') );

        var _top = ics_off.top - ics_h;
        var _bottom = ics_off.bottom;

        img.each( function( d_img, i )
        {
          var props = d_img.feature
            .get('properties');

          var el = img[0][i];

          var ox =  parseFloat(
            el.getAttribute('x') );

          var ow = parseFloat(
            el.getAttribute('width') );

          //ow /= 2;
          if ( x > ox-ow && x < ox+ow )
          {
            _top -= ics_h;
            _bottom += ics_h;
          }

        });

        return _advocacy ? _top : _bottom;
        //return _bottom;
      })

    this._update_bottom_top();
    this._add_tooltips();
    //this._add_advocacy_timer();

  } 

  ,add_clock: function()
  {
    var ini = this._get_advocacy_ini();
    if ( ! ini )
      return;

    var f = ini.feature.clone();

    var props = _.extend({},f.get('properties'));
    props.icon = _.defaults({
      url: 'images/clock.png'
    }, props.icon );

    f.set('properties', props);

    this.add_feature( f, ini.date );
    this._add_advocacy_timer();
  }

  ,_update_bottom_top: function()
  {
    var self = this;
    var opt = this.options;
    var vis = this.vis;

    var ics_off = vis.layout.icons.offset;
    var ics_h = vis.layout.icons.height;
    var margin_y = vis.layout.margin.y;

    this._top = ics_off.top - ics_h;
    this._bottom = ics_off.bottom + ics_h;

    _.each( 
      $('image.'+opt.icon_class)
      ,function( el )
      {
        var y = parseFloat(el.getAttribute('y'));

        self._top = Math.min(
          y - ics_h - margin_y, self._top );

        self._bottom = Math.max( 
          y + ics_h + margin_y, self._bottom );
      });

    var _top_offset = Math.abs( this._top );

    vis.svg.attr( 'transform',
        'translate( 0, '+
          _top_offset+')')
  }

  ,_add_tooltips: function()
  {
    var opt = this.options;
    var vis = this.vis;

    _.each( 
      $('image.'+opt.icon_class)
      ,function( el )
      {
        var d = el.__data__;
        var props = d.feature.get('properties');

        var _date = vis.tipformat( 
          new Date( d.date.iso ) );

        $(el).qtip({

          position: { 
            my: 'bottom right'
            ,adjust: { 
              x: -props.icon.width
              ,y: -props.icon.height
            }
            //,target: 'mouse'
          }
          ,style: { 
            classes: 'qtip-tipsy' 
            //,tip: {
              //corner: true
            //}
          }

          ,content: {
            title: _date,
            text: [
              '<div style="'
                ,'font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif;'
                ,'font-size: 15px;'
                ,'font-weight: 200;'
                ,'padding: 10px;'
              ,'">'
              ,props.titulo
              ,'</div>'
            ]
            .join('')
          }

          ,show: { 
            effect: false
            ,event: 'click mouseenter'
            ,delay: 50
          }   

          ,hide: { 
            effect: false
            ,delay: 50
            ,fixed: true
          }
        });
      });

    //.tipsy({ 
      //gravity: 's', 
      //html: true, 
      //title: function() 
      //{
        //var d = el.__data__;
        //var date = vis.tipformat( d.date );
        //return [
          //'<div style="'
            //,'font-size: 15px;'
            //,'padding: 10px;'
          //,'">'
          //,date
          //,' '
          //,d.titulo
          //,'</div>'
        //]
        //.join(''); 
      //}
    //});

  }

  //,_get_icon_url: function( feature )
  //{
    //var props = feature.get('properties');

    //if ( props.type !== 'acciones' )
      //return props.icon.url;

    //// no hay acciones
    //if ( ! this._get_advocacy_ini() ) 
      //return props.icon.url;

    //// renderear el relos
    //return 'images/clock.png';
  //} 

  ,_add_advocacy_timer: function()
  {
    var self = this;
    var opt = this.options;
    var vis = this.vis;

    var ini = this._get_advocacy_ini();
    var end = this._get_advocacy_end();

    // no hay acciones
    if ( ! ini ) 
      return;

    // contador de tiempo

    var $clock = $( _.find( 
      $('image.'+opt.icon_class)
      ,function( el ) 
      { 
        return $(el)
          .attr('href') === 'images/clock.png';
      }));

    //var $clock = $([
        //'image'
        //,'.'
        //,opt.icon_class
        //,'#'
        //,opt.icon_class+'-'
        //,ini.feature.get('id')
      //]
      //.join('') );

    if ( $clock.length === 0 )
    {
      console.warn('timeline add advocacy timer, no hay $clock para agregar el tiempo');
      return;
    }

    var tclas = 'timer-advocacy';

    var _timer = vis.svg.select('.'+tclas);

    if ( ! _timer[0][0] )
    {
      _timer = vis.svg
        .append('text')
        .attr('class', tclas );
    }

    // set x,y 

    var _x = $clock.attr('x');
    var _y = self._top;
    //var _y = $clock.attr('y');

    _timer
      .attr( 'x', _x )
      .attr( 'y', _y );

    // set time

    var ini_date = new Date( ini.date.iso );
    var end_date = end 
      ? new Date( end.date.iso )
      : new Date();

    //var delay = Math.abs( 
      //ini_date.getTime() - end_date.getTime());
    var delay = d3.time.days( 
        ini_date, end_date ).length;

    _timer.text( delay 
        + ' días ' 
        + ( end 
          ? 'hasta la respuesta'
          : 'sin respuesta' ) );

  }

  ,_get_advocacy_ini: function()
  {
    // buscar la accion advocacy mas antigua

    var ini, props;

    _.each( this.vis.data, function( d )
    {
      props = d.feature.get('properties');

      if ( props.type !== 'acciones' ) 
        return;

      ini = ! ini ? d 
        : ( new Date( ini.date.iso ).getTime() - new Date( d.date.iso ).getTime() > 0 ) ? d : ini;

    });

    return ini;
  }

  ,_get_advocacy_end: function()
  {
    // buscar la respuesta mas nueva

    var end, props;

    _.each( this.vis.data, function( d )
    {
      props = d.feature.get('properties');

      if ( props.type !== 'respuestas' ) 
        return;

      end = ! end ? d 
          : ( new Date(end.date.iso).getTime() - new Date(d.date.iso).getTime() > 0 ) ? end : d;

    });

    return end;
  }

  ,bottom: function()
  {
    return this._bottom + Math.abs(this._top); 
  }

});

return TimelineView;

});

