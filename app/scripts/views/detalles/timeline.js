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
      //test: 'el timeline (x)'
    //}) ); 

    this.init_vis();

    return this;
  }

  ,init_vis: function()
  {

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

    var $timeline = this.$el
      .find('.timeline .content');

    var layout = {
      width: 1000
      ,height: 600
      ,margin: { x: 20 }
      ,loc: { x: 0, y: 30 }
      ,icons: { y: 60 }
    };

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
      .select( $timeline[0] )
      .append( 'svg' )
      .attr( 'width', layout.width )
      .attr( 'height', layout.height );

    svg.append( 'g' )
      .attr( 'class', 'x axis' )
      .attr( 'transform',
          'translate('+
            layout.loc.x +','+
            layout.loc.y +')')
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
        'de entidad [', props.type, ']',
        'no tiene fecha');
      return;
    }

    var vis = this.vis; 

    var d = {
      date: new Date( props.date.iso )
      ,id: id
      ,descripcion: props.descripcion
      ,icon: props.icon
    };

    vis.data.push( d );

    //vis.domain( 
        //d3.extent( vis.data, function( d )
        //{ 
          //return d.date; 
        //}) );

    var img = vis.svg
      .selectAll( 'image' );

    var clas = 'icon-' + props.type + '-' + id;

    img
      .data( vis.data )
      .enter()

      .append( 'image' )
        .attr( 'class', clas )
        .attr( 'xlink:href', d.icon.url )
        .attr( 'width', d.icon.width )
        .attr( 'height', d.icon.height )

        .attr( 'x', function( d ) 
        { 
          return vis.xscale( d.date );
        })

        .attr( 'y', function() 
        { 
          var yoff = 0;

          var x = parseFloat(
            this.getAttribute('x') );

          img.each( function( d, i )
          {
            var el = img[0][i];
            var ox =  parseFloat(
              el.getAttribute('x') );
            var ow = parseFloat(
              el.getAttribute('width') );
            //ow /= 2;
            if ( x > ox-ow && x < ox+ow )
              yoff += d.icon.height + 10;
          });

          return vis.layout.icons.y + yoff;
        })

    $('.timeline .content svg image.'+clas)
      .tipsy({ 
        gravity: 's', 
        html: true, 
        title: function() 
        {
          var d = this.__data__;

          var date = vis.tipformat( d.date );

          //var resumen = d.descripcion 
            //? d.descripcion
              //.split(' ').slice(0,5)
              //.join(' ') + '...'
            //: '';

          return [
            '<div style="'
              ,'font-size: 15px;'
              ,'padding: 10px;'
            ,'">'
            ,date
            ,' '
            ,d.descripcion
            ,'</div>'
          ]
          .join(''); 
        }
      });

  }

});

return TimelineView;

});

