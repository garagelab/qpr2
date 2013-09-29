define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'config'
    ,'controllers/ui/SearchCtrler'
    ,'text!tpl/ui/layer_controls.html'
    ,'text!tpl/ui/widgets.html'
    ], 

function( $, _, Backbone
  ,config
  ,SearchCtrler
  ,tpl_layer_ctrls
  ,tpl_widgets
  )
{

'use strict';

var UI = function( opt )
{
  _.extend( this, Backbone.Events );

  var $win = $(window);

  var $layers=$('<div class="layers sidebar"/>');
  var $widgets = $('<div class="widgets"/>');
  var $search = $('<div class="search"/>');

  $(opt.el)
    .append( $layers )
    .append( $widgets )
    .append( $search )

  var layer_controls = config.layer_controls;

  _.each( 
    layer_controls.grupos
    ,function( grupo )
    {
      grupo.layers = _.map( 
        grupo.layers
        ,function( lc )
        {
          if ( lc.fuente )
            lc.fuente = 'Fuente: '+lc.fuente;
          return lc;
        });
    });


  var search = new SearchCtrler({
    mapview: opt.mapview
    //,el: $layers
    ,el: $search
  });

  search.on('search:feature', function(feature)
  {
    this.trigger( 'select:feature', feature );
  }
  , this );


  $layers.append( 
    _.template( tpl_layer_ctrls )(layer_controls)
  );

  $widgets.append( 
    _.template( tpl_widgets ) 
  ); 
 

  $('.goto-origin').click( function(e)
  {
    //close_all_infowins();
    opt.mapview.origin(); 
  }); 


  //TODO q feo......!

  var $enviar_alerta_frame = 
    $('#enviar-alerta-frame-container');

  var $enviar_alerta = $('.enviar-alerta');

  $enviar_alerta_frame.css({
    'width': '1000px'
    ,'height': '100%'
    ,'background-color': 'rgba(0,0,0,0.5)'
    ,'position': 'absolute' 
    ,'left': '200px' 
  });

  //$enviar_alerta_frame.hide();
  $enviar_alerta_frame.css(
      'visibility','hidden');

  $enviar_alerta.click( function(e)
  {
    //window.open('https://quepasariachuelo.crowdmap.com/reports/submit', '_blank');  

    if ( $enviar_alerta_frame
      .css('visibility') === 'hidden' )
      //.css('display') === 'none' )
    {
      $enviar_alerta_frame.append("<iframe id='enviar-alerta-frame' src='//quepasariachuelo.crowdmap.com/reports/submit' width='1000px' height='100%' frameborder='0' style='border:none; overflow-x:hiden; overflow-y:auto;'></iframe>");
      //$enviar_alerta_frame.show();
      $enviar_alerta_frame.css(
          'visibility','visible');

      $widgets.hidden_on_enviar_alerta =
        $widgets.css('display') === 'none';
      $widgets.hide();
    }

    else
    {
      $enviar_alerta_frame.empty();
      //$enviar_alerta_frame.hide();
      $enviar_alerta_frame.css(
          'visibility','hidden');

      //if ( ! cur_detalle )
      if ( ! $widgets.hidden_on_enviar_alerta )
        $widgets.show();
    }
  });

  var on_win_resize = _.debounce( function()
  {
    var ltop = $layers.position().top;
    var fh = $('#footer').height(); 
    var h = $win.height() - ltop - fh;
    $layers.height( h - 200 );
  }
  , 400 );

  on_win_resize();

  $win.on('resize', on_win_resize); 

  // public

  this.dispose = function()
  {
    $win.off('resize', on_win_resize);
  };

  this.update_feature_search = function(layers)
  {
    search.update_feature_search( layers );
  }

  this.show_widgets = function()
  {
    $widgets.show();
  }

  this.hide_widgets = function()
  {
    $widgets.hide();
  }

  //google.load("feeds", "1");
  //function _init_feeds() 
  //{
    //console.log('init feeds');
    //var feed = new google.feeds.Feed("http://monitoreoriachuelo.blogspot.com/feeds/posts/default?alt=rss");
    //feed.load( function( res ) 
    //{
      //if ( res.error )
        //return;
      //var i, len = res.feed.entries.length;
      //for ( i = 0; i < len; i++ ) 
      //{
        //console.log(res.feed.entries[i]);
        ////entry.title
      //}
    //});
  //}
  //google.setOnLoadCallback( _init_feeds );



};

return UI;

});

