define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'utils'
  ,'views/stats/StatsIntroView'
  ], 

function( $, _, Backbone, utils, StatsIntroView) 
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
      items: _.map( up_ls, function( stat_key )
      {
        return [
          stats.get( stat_key ).cant || '...'
          ,str( stat_key )
        ]
        .join(' ');
      })
    });

  } 

  function str( stat_key )
  {
    switch( stat_key )
    {
      case 'basurales':
      return 'Basurales remanentes';

      case 'ac':
      return 'Industrias declaradas agentes contaminantes';
      case 'pri':

      return 'Industrias han presentado planes de reconversión';
      case 'rec':
      return 'Industrias han reconvertido sus procesos';

      default:
      return utils.capitalize(stat_key);
    }
  }

};

return StatsIntroCtrler;

});

