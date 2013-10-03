define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'lang'
    ,'text!tpl/ui/search_geolocation.html'
    ], 

function( $, _, Backbone, lang, tpl ) 
{

'use strict';

var SearchGeolocationView = Backbone.View.extend({

  initialize: function()
  {
    this.$el.addClass('search-geoloc');
    this.$el.addClass('search-field');
  }

  ,tpl: _.template( tpl )

  ,render: function()
  { 
    var self = this;

    var map = this.options.mapview.map();

    var bounds = 
      new google.maps.LatLngBounds(
        new google.maps.LatLng(
          -34.9800, -58.4000 )
        ,new google.maps.LatLng(
          -34.9900, -58.4100 )
        ); 

    this.$el.html( this.tpl({}) );

    this.$el.find('form')
      .unbind('submit')
      .submit( function( e ) 
      {
        return false;
      });

    var $input = this.$el.find('input');

    var _opt = {
      //bounds: bounds
      types: [ 'geocode' ]
    };

    var autocomplete = 
      new google.maps.places.Autocomplete(
        $input[0], _opt );

    autocomplete.bindTo( 'bounds', map );

    google.maps.event.addListener(
    autocomplete, 'place_changed', function() 
    {
      var place = autocomplete.getPlace();

      if ( ! place.geometry ) 
      {
        $input.val( 
          lang('search_no_res') );
        return;
      }

      if ( place.geometry.viewport ) 
      {
        map.fitBounds(place.geometry.viewport);
      } 
      else 
      {
        map.setCenter(place.geometry.location);
        map.setZoom( 17 );
      }

      self.trigger('search');

    });

    this.dispose_autocomplete();
    this._autocomplete = autocomplete;

    return this;
  }

  ,clear: function()
  {
    this.$el.find('input').val('');
  }

  ,dispose: function()
  {
    this.dispose_autocomplete();
  }

  ,dispose_autocomplete: function()
  {
    if ( ! this._autocomplete )
      return;
    google.maps.event.clearInstanceListeners(
        this._autocomplete );
    this._autocomplete = null;
  }

  //,events: 
  //{
    //'click': 'xxx' 
  //}

});

return SearchGeolocationView;

});

