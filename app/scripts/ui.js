define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'controllers/ui/SearchCtrler'
    ,'text!tpl/ui/layer_controls.html'
    ,'text!tpl/ui/widgets.html'
    ], 

function( $, _, Backbone
  ,SearchCtrler
  ,tpl_layer_controls
  ,tpl_widgets
  )
{

'use strict';

var UI = function( opt )
{
  _.extend( this, Backbone.Events );

  var $win = $(window);
  var $layers = $('.layers');
  var $widgets = $('.widgets');

  var search = new SearchCtrler({
    mapview: opt.mapview
  });

  search.on('select:feature', function( e )
  {
    this.trigger( 'select:feature', e );
  }
  , this );


  $layers.append( 
      _.template( tpl_layer_controls ) );

  $widgets.append( 
      _.template( tpl_widgets ) ); 

  search.appendTo( $layers ); 


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
    $layers.height( h );
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

};

return UI;

});

