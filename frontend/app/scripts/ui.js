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
  var $layers = $('.layers');
  var $widgets = $('.widgets');

  var search = new SearchCtrler({
    mapview: opt.mapview
  });

  search.on('select:feature', function(feature)
  {
    this.trigger( 'select:feature', feature );
  }
  , this );


  var layer_ctrls = { grupos: [

  {
    name: 'monitoreo'
    ,title: 'Monitoreo Social'
    ,layers: [
      {
        name: 'enviar-alerta'
        ,title: 'Enviá tu Alerta'
      }
      ,{
        name: 'alertas'
        ,title: 'Alertas'
        ,icon_url: 'images/markers/alerta.png'
        ,fuente: 'Crowdmap'
      }
      ,{
        name: 'historias'
        ,title: 'Historias'
        ,icon_url: 'images/markers/historia.png'
        ,fuente: 'FARN'
      }
      ,{
        name: 'acciones'
        ,title: 'Acciones'
        ,icon_url: 'images/markers/accion.png'
        ,fuente: 'FARN'
      }
      ,{
        name: 'respuestas'
        ,title: 'Respuestas'
        ,icon_url:'images/markers/respuesta.png'
        ,fuente: 'FARN'
      } 
      ,{
        name: 'documentos'
        ,title: 'Documentos'
        ,icon_url:'images/markers/documento.png'
        ,fuente: 'FARN'
      }
      ,{
        name: 'noticias'
        ,title: 'Noticias'
        ,icon_url: 'images/markers/noticia.png'
        ,fuente: 'FARN'
      }
    ]
  }

  ,{
    name: 'datos-publicos'
    ,title: 'Datos Públicos'
    ,layers: [
      {
        name: 'industrias'
        ,title: 'Industrias'
        ,icon_url:'images/markers/industria.png'
        ,fuente: 'ACUMAR'
      }
      ,{
        name: 'basurales'
        ,title: 'Basurales'
        ,icon_url: 'images/markers/basural.png'
        ,fuente: 'ACUMAR'
      }
      ,{
        name: 'asentamientos'
        ,title: 'Asentamientos'
        ,icon_url:'images/markers/asentamiento.png'
        ,fuente: 'TECHO'
      }
      ,{
        name: 'ecopuntos'
        ,title: 'Ecopuntos'
        ,icon_url: 'images/markers/ecopunto.png'
        ,fuente: 'ACUMAR'
      }
      ,{
        name: 'subcuencas'
        ,title: 'Subcuencas'
        ,icon_url: 'images/markers/arroyo.png'
        ,fuente: 'ACUMAR'
      }
    ]
  }

  ]}; //end of layer_ctrls.grupos

  _.each( 
    layer_ctrls.grupos
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

  $layers.append( 
    _.template( tpl_layer_ctrls )(layer_ctrls)
  );

  $widgets.append( 
    _.template( tpl_widgets ) 
  ); 

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

