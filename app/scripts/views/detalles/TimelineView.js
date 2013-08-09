define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'text!tpl/detalles/timeline.html'
  ], 

function( $, _, Backbone, tpl ) 
{

'use strict';

var TimelineView = Backbone.View.extend({ 

  initialize: function() 
  { 
    //var opt = this.options;
    //this.$el.addClass( 'timeline' );
  }

  ,tpl: _.template( tpl )

  ,render: function()
  {
    this.$el.html( this.tpl({}) );

    this.init_vis();

    return this;
  }

  ,init_vis: function()
  { 

    var layout = {
      width: 1000
      ,height: 500
      ,margin: { x: 20 }
      ,timeline: { x: 0, y: 40 }
      ,icons: { y: 80 }
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

      svg.select('g')
        .call( xaxis );
    }

    this._bottom = layout.icons.y;

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

    var xscale = d3.time.scale(); 
    var xaxis = d3.svg.axis(); 

    var svg = d3
      .select( 
        this.$el.find('.svg-container')[0] )
      .append( 'svg' )
      .attr( 'width', layout.width )
      .attr( 'height', layout.height );

    svg.append( 'g' )
      .attr( 'class', 'x axis' )
      .attr( 'transform',
          'translate('+
            layout.timeline.x +','+
            layout.timeline.y +')')
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

  ,add: function( feature )
  {
    var self = this;

    var id = feature.get('id');
    var props = feature.get('properties');

    //console.log('timeline add feature',
        //id, feature );

    // TODO no date !
    if ( ! props.date )
    {
      console.warn(
        'feature',
        'id [', id, ']',
        'de tipo [', props.type, ']',
        'no tiene fecha');
      return;
    }

    var vis = this.vis; 

    vis.data.push( feature );

    //vis.domain( 
      //d3.extent( vis.data, function( feature )
      //{ 
        //var props = feature.get('properties');
        //return new Date( props.date.iso ); 
      //}) );

    var img = vis.svg
      .selectAll( 'image' );

    var clas = 'icon-' + props.type + '-' + id;

    this._bottom = vis.layout.icons.y;

    img
      .data( vis.data )
      .enter()

      .append( 'image' )
        .attr( 'class', clas )
        .attr( 'xlink:href', props.icon.url )
        .attr( 'width', props.icon.width )
        .attr( 'height', props.icon.height )

        .attr( 'x', function( feature ) 
        { 
          var props = feature.get('properties');
          var date = new Date( props.date.iso );
          return vis.xscale( date );
        })

        .attr( 'y', function() 
        { 
          var x = parseFloat(
            this.getAttribute('x') );

          img.each( function( feature, i )
          {
            var props = feature.get('properties');
            var el = img[0][i];
            var ox =  parseFloat(
              el.getAttribute('x') );
            var ow = parseFloat(
              el.getAttribute('width') );
            //ow /= 2;
            if ( x > ox-ow && x < ox+ow )
              self._bottom += props.icon.height+10;
          });

          return self._bottom;
        })

    //agregar 1 icono mas
    //para dejar el bottom realmente bottom
    this._bottom += props.icon.height+10;

    vis.svg.select('image.'+clas)

      .each( function()
      {
        var feature = this.__data__;
        var props = feature.get('properties');
        var _date = new Date( props.date.iso );
        var date = vis.tipformat( _date );

        $(this).qtip({

          position: { 
            my: 'bottom right' 
            ,target: 'mouse'
          }
          ,style: { classes: 'qtip-tipsy' }

          ,content: {
            title: date,
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
          //var d = this.__data__;
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

  ,bottom: function()
  {
    return this._bottom;
  }

});

return TimelineView;

});

