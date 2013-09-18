define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'spin'
  //,'text!tpl/ui/loading_route.html'
  ], 

function( $, _, Backbone, Spinner ) 
{

'use strict';

var LoadingRoute = Backbone.View.extend({ 

  initialize: function() 
  { 
    this.$el.addClass('loading-route');
  }

  //,tpl: _.template( tpl )

  ,render: function()
  {

    this.$el.append( $('<div/>')
      .css({
        'width': '100%'
        ,'height': '100%'
        ,'background-color': 'rgba(0,0,0,0.2)'
        ,'position': 'absolute'
      }) 
      .append( 
        $( new Spinner({
          radius: 5
          ,width: 3
        })
        .spin().el )
        .css({
          'height': '30%'
          ,'width': '1%'
          ,'position': 'absolute'
          ,'margin': 'auto'
          ,'top': '0' 
          ,'left': '0'
          ,'bottom': '0'
          ,'right': '0'
        }) ) 
      );

    return this;
  }

});

return LoadingRoute;

});

