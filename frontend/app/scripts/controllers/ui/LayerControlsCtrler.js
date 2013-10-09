define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'lang','config','utils'
    ,'text!tpl/ui/layer_controls.html'
    ], 

function( $, _, Backbone, 
  lang, config, utils, tpl ) 
{

'use strict';

var LayerControlsCtrler = function( opt )
{
  _.extend( this, Backbone.Events );

  // preprocess layer_controls template
  _.each( 
    config.layer_controls.grupos
    ,function( grupo )
    {
      grupo.layers = _.map( 
        grupo.layers
        ,function( lc )
        {
          if ( lc.fuente_name )
            lc.fuente_name = lang('layer_controls_source') + ': ' + lc.fuente_name;

          // download json data link
          //if ( lc.fuente_url 
            //&& /crowdmap\.com/
              //.test( lc.fuente_url ) )
          //{
            //lc.fuente_filename = lc.name+'.json';
            //lc.fuente_url = URL.createObjectURL( 
              //new Blob([ string ]
              //,{ type : 'text/plain' }) );
          //}

          return lc;
        });
    });

  $( opt.el ).append( 
    _.template( tpl )( config.layer_controls )
  );

};

return LayerControlsCtrler;

});

