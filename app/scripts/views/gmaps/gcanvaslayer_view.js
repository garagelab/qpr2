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
      ,size: 0.001
    });

    this.name = opt.name;
    this._visible = opt.visible;

    //this.listenTo( this.model,
      //'add', this.feature_added, this );

    this._latlngs = [];

    this.canvas_layer = new CanvasLayer({
      map: opt.map
      ,animate: false
      ,resizeHandler: 
        _.bind( canvas_resize, this )
      ,updateHandler: 
        _.bind( canvas_update, this )
    });

    this.ctx = this.canvas_layer 
        .canvas.getContext('2d'); 

    function canvas_update()
    {
      if ( this.is_visible() )
        this.canvas_render();
    }

    function canvas_resize(){}

  }

  ,canvas_clear: function()
  {
    this.ctx.clearRect( 0, 0, 
        this.canvas_layer.canvas.width, 
        this.canvas_layer.canvas.height );
  }

  ,canvas_render: function()
  { 
    var opt = this.options;

    var canvas_layer = this.canvas_layer; 
    var ctx = this.ctx; 

    this.canvas_clear();

    var crgb = chroma
      .color( opt.color ).rgb().join();

    ctx.fillStyle = 'rgba( '+crgb+', 0.8 )';
    ctx.strokeStyle = 'rgba( '+crgb+', 1.0 )';

    ctx.setTransform( 1, 0, 0, 1, 0, 0 );

    // scale is just 2^zoom
    var scale = Math.pow( 2, opt.map.zoom );
    ctx.scale( scale, scale );

    var map_proj = opt.map.getProjection();

    var off = map_proj
      .fromLatLngToPoint(
          canvas_layer.getTopLeft() );

    ctx.translate( -off.x, -off.y );

    var pt_size = opt.size * 
      ( opt.scale ? 1 : 1/scale );

    var pt_latlng;
    var pt_world;

    //_.each( opt.clusterer.getClusters(), 
    //function( pt_latlng )
    _.each( this._latlngs, function( pt_latlng )
    {

      //pt_latlng = cluster.getCenter();

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

    this.canvas_render();
    this._visible = true;
  }

  ,hide: function()
  {
    this.canvas_clear();
    this._visible = false;
  }

  ,update_points: function( latlngs_arr )
  {
    this._latlngs = latlngs_arr;
    if ( this.is_visible() )
      this.canvas_render();
  }

  //,feature_added: function( feature ) 
  //{
    //if (feature.get('geometry').type === 'Point')
    //{
      //var coordarr = feature
        //.get('geometry')
        //.coordinates;

      //this._latlngs.push( 
          //new google.maps.LatLng(
            //coordarr[0], coordarr[1] ) );

      //if ( this.is_visible() )
        //this.canvas_render();
    //}
  //}

});

return GCanvasLayerView;

});

