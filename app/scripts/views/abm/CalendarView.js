define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'text!tpl/abm/calendar.html'
  ], 

function( $, _, Backbone, tpl )
{

'use strict';

var CalendarView = Backbone.View.extend({ 

  initialize: function() 
  { 
    this.$el.addClass('calendar-view');
  }

  ,tpl: _.template( tpl )

  ,render: function()
  {
    this.$el.html( this.tpl({}) );
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

return CalendarView;

});

