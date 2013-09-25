define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'utils'
  ,'text!tpl/stats/stats_intro.html'
  ], 

function( $, _, Backbone, utils, tpl )
{

'use strict';

var StatsIntroView = Backbone.View.extend({ 

  initialize: function() 
  {
    this.listenTo(
      this.model, 'change', this.render );
  }

  ,tpl: _.template( tpl )

  ,render: function()
  {
    var data = this.model.toJSON();

    if ( _.isEmpty( data ) )
      return this;

    this.$el.html( this.tpl( data ) );

    return this;
  } 

  ,events: {
    'click .close': 'close'
  }

  ,close: function()
  {
    this.remove();
    this.trigger('close');
  }

});

return StatsIntroView;

});

