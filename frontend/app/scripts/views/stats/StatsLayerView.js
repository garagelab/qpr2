define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'lang'
  ,'text!tpl/stats/stats_layer.html'
  ], 

function( $, _, Backbone, lang, tpl )
{

'use strict';

var StatsLayerView = Backbone.View.extend({ 

  initialize: function() 
  {
    this.listenTo(
      this.model, 'change', this.render );
  }

  //,tpl: _.template( tpl )
  ,tpl: _.template( _.unescape(_.template(tpl)({
    stats_layer: lang('stats_layer')
  }) ) )

  ,render: function( data )
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

return StatsLayerView;

});

