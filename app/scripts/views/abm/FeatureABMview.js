define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'text!tpl/abm/feature_abm.html'
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
    ,'click .titulo': 'select_historia'
  }

  ,update_bts: function()
  {
    // reset all btns

    this.show_bt(
        this.$el.find('.upload-feature') ); 

    this.hide_bt(
      this.$el.find('.remove-feature') );

    this.$el.find( 'input[type=date]' ).show();

    // show remove / hide upload btns
    // for each historia added
    this.collection.each( function( historia )
    {
      var $h = this.$el
        .find( '.id.' + historia.get('hid') );

      this.hide_bt(
        $h.siblings( '.upload-feature' ) );

      this.show_bt(
        $h.siblings( '.remove-feature' ) );

      $h.siblings()
        .find( 'input[type=date]' ).hide();
    }
    , this );
  }

  ,show_bt: function( $bt )
  {
    $bt.addClass('active').show();
  }

  ,hide_bt: function( $bt )
  {
    $bt.removeClass('active').hide();
  }

  ,close: function()
  {
    this.remove();
    this.trigger('close');
  }

  ,upload_feature: function( e )
  {
    var $el = $( e.currentTarget );
    var hid = $el.siblings('.id').text();
    var date = $el.siblings()
      .find('input[type=date]').val();

    this.trigger( 'upload', {
      feature: this.options.feature
      ,hid: hid
      ,date: date
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

  ,select_historia: function( e )
  {
    var hid = $( e.currentTarget )
      .siblings('.id').text();

    //XXX 
    //layer.historias.model es una collection !
    this.trigger('select:historia', { 
      feature_historia: this.options.layers
        .historias.model.get( hid )
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

