define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'canvaslayer'
    ], 

function( $, _, Backbone ) 
{

'use strict';

var GCanvasLayerView = Backbone.View.extend({ 

  initialize: function() 
  { 
    var self = this;
    var opt = this.options;

    _.defaults( opt, {
      scale: true
      ,size: 0.0005
    });

    this.name = opt.name;
    this._visible = opt.visible;

    //this.listenTo( this.model,
      //'add', this.feature_added, this );

    //this._latlngs = [];

    this.canvas_layer = new CanvasLayer({
      map: opt.map
      ,animate: false
      ,resizeHandler: 
        _.bind( this.render, this )
      ,updateHandler: 
        _.bind( this.render, this )
    });

    this.ctx = this.canvas_layer 
        .canvas.getContext('2d'); 

  }

  ,render: function()
  {
    if ( this.is_visible() )
      this._canvas_render();
  }

  ,_canvas_clear: function()
  {
    this.ctx.clearRect( 0, 0, 
        this.canvas_layer.canvas.width, 
        this.canvas_layer.canvas.height );
  }

  ,_canvas_render: function()
  { 
    var opt = this.options;

    var canvas_layer = this.canvas_layer; 
    var ctx = this.ctx; 

    this._canvas_clear();

    var crgb = chroma
      .color( opt.color ).rgb().join();

    ctx.fillStyle = 'rgba( '+crgb+', 0.8 )';
    ctx.strokeStyle = 'rgba( '+crgb+', 1.0 )';

    ctx.setTransform( 1, 0, 0, 1, 0, 0 );

    // scale is just 2^zoom
    var scale = Math.pow( 2, opt.map.zoom );
    ctx.scale( scale, scale );

    var map_proj = opt.map.getProjection();

    var tl = canvas_layer.getTopLeft();

    var off = tl 
      ? map_proj.fromLatLngToPoint( tl ) 
      : { x:0, y:0 };

    ctx.translate( -off.x, -off.y );

    var pt_size = opt.size * 
      ( opt.scale ? 1 : 1/scale );

    var pt_world;

    _.each( opt.points(), function( pt_latlng )
    {

      // project LatLng 
      // to world coordinates and draw
      pt_world = map_proj
        .fromLatLngToPoint( pt_latlng );

      ctx.beginPath();
      ctx.arc( 
        pt_world.x, pt_world.y, 
        pt_size,
        0, 2*Math.PI );

      //ctx.rect(
        //pt_world.x, pt_world.y, 
        //pt_size, pt_size );

      //ctx.stroke();
      ctx.fill();
    }
    , this );

  }

  ,dispose: function()
  {} 

  ,is_visible: function()
  {
    return this._visible;
  }

  ,visible: function( v )
  {
    if ( v ) this.show();
    else this.hide();
  }

  ,show: function()
  {
    if ( this.is_visible() )
    {
      console.warn(this.name, 'canvas layer view is already visible');
      return;
    }

    this._canvas_render();
    this._visible = true;
  }

  ,hide: function()
  {
    this._canvas_clear();
    this._visible = false;
  }

  //,feature_added: function( feature ) 
  //{
    //if (feature.get('geometry')
          //.type === 'Point')
    //{
      //var coordarr = feature
        //.get('geometry')
        //.coordinates;

      //this._latlngs.push( 
          //new google.maps.LatLng(
            //coordarr[0], coordarr[1] ) );

      //this.render();
    //}
  //}

});

return GCanvasLayerView;

});

