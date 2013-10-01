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

  var self = this;

  var $win = $(window);

  var $layers = $('<div class="layers sidebar"/>');
  var $widgets = $('<div class="widgets"/>');
  var $search = $('<div class="search"/>');

  $( opt.el )
    .append( $layers )
    .append( $widgets )
    .append( $search )

  _.each( 
    config.layer_controls.grupos
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
    _.template( tpl_layer_ctrls )
      ( config.layer_controls )
  );

  $widgets.append( 
    _.template( tpl_widgets ) 
  );  


  //TODO FIXME 
  //puaj q feo todo lo que viene....!!!@#$%ˆ&*


  $('.goto-origin').click( function(e)
  {
    //close_all_infowins();
    opt.mapview.origin(); 
  }); 


  $layers.find('.toggle').click( function(e)
  {

    var gname = _.find( 
      $( e.currentTarget )
        .attr('class').split(' ')
      ,function(cl)
      {
        return cl.indexOf('grupo') > -1;
      })
      .split('-');

    gname = gname
      .slice( 1, gname.length )
      .join('-');

    var visible = $( e.target )
        .attr('class')
        .indexOf('expand') > -1;

    var glayernames = 
      _.pluck( 
        _.find(
          config.layer_controls.grupos,
          function( grupo )
          {
            return grupo.name === gname;
          })
        .layers
        , 'name' );

    self.trigger(
        'change:visibility:layers'
        , glayernames, visible );
  });
 

  var $enviar_alerta_frame = 
    $('#enviar-alerta-frame-container');

  var $enviar_alerta_bt = $('.enviar-alerta');

  $enviar_alerta_frame.css({
    'width': '1000px'
    ,'height': '100%'
    ,'background-color': 'rgba(0,0,0,0.5)'
    ,'position': 'absolute' 
    ,'left': '200px' 
    ,'z-index': '1'
  });

  //$enviar_alerta_frame.hide();
  $enviar_alerta_frame.css(
      'visibility','hidden');

  $enviar_alerta_bt.click( function(e)
  {
    //window.open('https://quepasariachuelo.crowdmap.com/reports/submit', '_blank');  

    if ( $enviar_alerta_frame
      .css('visibility') === 'hidden' )
      //.css('display') === 'none' )
    {

      $enviar_alerta_frame.append('<div style="width:100%; height:34px; background-color:black; position:absolute;"/><button class="close pure-button" style="padding: .1em .4em; top: 4px;"><i class="icon-remove"></i></button>');

      $enviar_alerta_frame.append("<iframe id='enviar-alerta-frame' src='//quepasariachuelo.crowdmap.com/reports/submit' width='1000px' height='100%' frameborder='0' style='border:none; overflow-x:hiden; overflow-y:auto;'></iframe>");

      //$enviar_alerta_frame.show();
      $enviar_alerta_frame.css(
          'visibility','visible');

      $enviar_alerta_frame
        .find('.close')
        .click( remove_enviar_alerta_frame );

      $widgets.hidden_on_enviar_alerta =
        $widgets.css('display') === 'none';

      $widgets.hide();
    }

    else
    {
      remove_enviar_alerta_frame(); 
    }

  });

  function remove_enviar_alerta_frame()
  {
    $enviar_alerta_frame
      .find('.close')
      .unbind(
        'click', remove_enviar_alerta_frame );

    $enviar_alerta_frame.empty();

    //$enviar_alerta_frame.hide();
    $enviar_alerta_frame.css(
        'visibility','hidden');

    if ( ! $widgets.hidden_on_enviar_alerta )
      $widgets.show();
  }

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

