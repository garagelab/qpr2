define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'text!tpl/feature_abm.html'
  ], 

function( $, _, Backbone, tpl )
{

'use strict';

var FeatureABMview = Backbone.View.extend({ 

  initialize: function() 
  { 
    this.$el.addClass( 'feature-abm-view' );  
  }

  ,tpl: _.template( tpl )

  ,render: function()
  {
    var layers = this.options.layers;

    this.$el.html( this.tpl({
      historias: layers.historias.model.toJSON() 
    }) );

    this.$el.find('.remove-feature').hide();
    this.$el.find('.upload-feature').hide();
    this.$el.find('.spinner').hide();

    return this;
  }

  ,events: {
    'click .upload-feature': 'upload_feature'
    ,'click .remove-feature': 'remove_feature'
  }

  ,update_btns: function()
  {
    // reset all btns

    this.show(
        this.$el.find('.upload-feature') ); 

    this.hide(
      this.$el.find('.remove-feature') );

    // show remove / hide upload btns
    // for each historia added
    this.collection.each( function( historia )
    {
      var $h = this.$el
        .find( '.id.' + historia.get('hid') );

      this.hide(
        $h.siblings( '.upload-feature' ) );

      this.show(
        $h.siblings( '.remove-feature' ) );
    }
    , this );
  }

  ,show: function( $bt )
  {
    $bt.addClass('active').show();
  }

  ,hide: function( $bt )
  {
    $bt.removeClass('active').hide();
  }

  ,close: function()
  {
    this.remove();
  }

  ,upload_feature: function( e )
  {
    var $el = $( e.currentTarget );
    var hid = $el.siblings('.id').text();

    this.trigger( 'upload', {
      feature: this.options.feature
      ,hid: hid
    });

  }

  ,remove_feature: function( e )
  {
    var hid = $( e.currentTarget )
      .siblings('.id').text();

    this.trigger( 'remove', {
      feature: this.options.feature
      ,hid: hid
    });
  }

  ,spin: function( go )
  {
    if ( go )
    {
      this.$el.find('.active')
        .addClass('.pure-button-disabled')
        .css('cursor','wait');
      $('body').css('cursor','wait');
      //this.$el.find('.spinner').show();
    }
    else
    {
      this.$el.find('.active')
        .removeClass('.pure-button-disabled')
        .css('cursor','pointer');
      $('body').css('cursor','default');
      //this.$el.find('.spinner').hide();
    }
  }

});

return FeatureABMview;

});

