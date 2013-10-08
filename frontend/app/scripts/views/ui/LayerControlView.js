define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ], 

function( $, _, Backbone ) 
{

'use strict';

var LayerControlView = Backbone.View.extend({

  initialize: function() 
  {
    this.visible( this.options.visible );
  },

  events: 
  {
    'click': function(e) 
    {
      //dont change visibility 
      //if clicked on <a> tag
      if ( $(e.target).prop('tagName') === 'A' )
        return;
      this.visible( ! this._visible );
      this.trigger( 
        'change:visibility',
        this.is_visible() );
    }
  },

  is_visible: function()
  {
    return !!this._visible;
  },

  visible: function( v )
  {
    this._visible = v;
    if ( v )
      this.$el.addClass( 'visible' );
    else
      this.$el.removeClass( 'visible' );
  }

});

return LayerControlView;

});

