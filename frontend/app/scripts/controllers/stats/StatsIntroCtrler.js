define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'lang'
  ,'utils'
  ,'views/stats/StatsIntroView'
  ], 

function( $, _, Backbone, 
  lang, utils, StatsIntroView ) 
{

'use strict';

var StatsIntroCtrler = function( opt )
{
  _.extend( this, Backbone.Events );

  var model = new Backbone.Model({
    //items: [
      //'xx pepe pepe'
      //,'xx pepe2 pepe2'
    //]
  });

  var view = new StatsIntroView({ 
    model: model 
    ,className: 'stats-intro-view'
  });

  view.on('close', function()
  {
    this.dispose();
    this.trigger('close');
  }
  , this );

  $(opt.el).append( view.render().el );

  this.dispose = function()
  {
    view.off();
    model.clear();
    view = null;
    model = null;
  }

  var up_ls = [
    'ac'
    ,'pri'
    ,'rec'
    ,'basurales'
    ,'ecopuntos'
    ,'asentamientos'
    //,'subcuencas'
  ];

  this.update = function( stats )
  {

    model.set({
      title: lang('stats_intro_title')+':'
      ,remate: lang('stats_intro_remate')+'...'
      ,items: _.map( up_ls, function( stat_key )
      {
        return [
          stats.get( stat_key ).cant || '...'
          ,texto( stat_key )
        ]
        .join(' ');
      })
    });

  } 

  function texto( stat_key )
  {
    return lang('stats_intro_'+stat_key)
      || utils.capitalize(stat_key);
  }

};

return StatsIntroCtrler;

});

