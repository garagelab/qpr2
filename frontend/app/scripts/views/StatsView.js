define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'text!tpl/stats.html'
  ], 

function( $, _, Backbone, tpl )
{

'use strict';

var StatsView = Backbone.View.extend({ 

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

  //,events: {
    //'click .close': 'close'
  //}

  //,close: function()
  //{
    //this.remove();
    //this.trigger('close');
  //}

});

return StatsView;

});

