define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'text!tpl/ui/search_feature.html'
    ], 

function( $, _, Backbone, tpl ) 
{

'use strict';

var SearchFeatureView = Backbone.View.extend({

  initialize: function()
  {
    this.$el.addClass('search-feature'); 
  }

  ,tpl: _.template( tpl )

  ,render: function( opt )
  {

    var self = this;

    this.$el.html( this.tpl({
      items: opt ? opt.features : []
    }) );

    var $sel = this.$el.find('select');

    $sel.selectize({
      maxOptions: 100
      ,scrollDuration: 0
      ,onChange: function( value )
      {
        self.trigger('select:feature', {
          name: value
        });
        //$sel[0].selectize.clear();
      }
      //,onInitialize: function()
      //{
        //self.$el
          //.find('.selectize-input')
          //.css('cursor','wait');
      //}
    });

    if ( opt 
        && opt.features 
        && opt.features.length > 0 )
    {
      $sel[0].selectize.enable();
      this.$el.find('.cargando').hide();
      //this.$el
        //.find('.selectize-input')
        //.css('cursor','default');
    }
    else
      this.$el.find('.cargando').show();

    this.$el.find('form')
      .unbind('submit')
      .submit( function( e ) 
      {
        return false;
      });

    return this;
  } 

  ,dispose: function()
  {}

});

return SearchFeatureView;

});

