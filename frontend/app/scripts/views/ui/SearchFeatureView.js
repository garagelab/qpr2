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

    this.dispose_selectize();

    var $sel = this.$el.find('select');

    $sel.selectize({
      maxOptions: 100
      ,scrollDuration: 0
      ,onChange: function( value )
      {
        self.trigger('select:feature', {
          name: value
        });
        //this._selectize.clear();
      }
      //,onInitialize: function()
      //{
        //self.$el
          //.find('.selectize-input')
          //.css('cursor','wait');
      //}
    });

    this._selectize = $sel[0].selectize;

    if ( opt 
        && opt.features 
        && opt.features.length > 0 )
    {
      this._selectize.enable();
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
  {
    this.dispose_selectize();
  }

  ,dispose_selectize: function()
  {
    if ( this._selectize )
    {
      this._selectize.destroy();
      this._selectize = null;
    }
  }

});

return SearchFeatureView;

});

