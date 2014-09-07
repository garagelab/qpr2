define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'lang'
    ,'text!tpl/ui/search_municipios.html'
    ], 

function( $, _, Backbone, lang, tpl ) 
{

'use strict';

var SearchMunicipiosView = Backbone.View.extend({

  initialize: function()
  {
    this.$el.addClass('search-municipios');
    this.$el.addClass('search-field');
  }

  ,tpl: _.template( tpl )

  ,render: function()
  { 
    var self = this;

    var map = this.options.mapview.map();

    this.$el.html( this.tpl({
      items: [
        'Ciudad Autónoma de Buenos Aires'
        ,'Almirante Brown'
        ,'Avellaneda'
        ,'Cañuelas'
        ,'Esteban Echeverría'
        ,'Ezeiza'
        ,'General Las Heras'
        ,'La Matanza'
        ,'Lanús'
        ,'Lomas de Zamora'
        ,'Marcos Paz'
        ,'Merlo'
        ,'Morón'
        ,'Presidente Perón'
        ,'San Vicente'
      ]
    }) );

    this.$el.find('form')
      .unbind('submit')
      .submit( function( e ) 
      {
        return false;
      });

    var geocoder = new google.maps.Geocoder();

    this.dispose_selectize();

    var $sel = this.$el.find('select');

    $sel.selectize({
      maxOptions: 100
      ,scrollDuration: 0
      ,onChange: function( value )
      {

        geocoder.geocode({
          address: 
            value + ', Buenos Aires, Argentina'
        }
        ,function( res, st )
        {

          if (st!=google.maps.GeocoderStatus.OK)
          {
            self._selectize.setValue(
              lang('search_no_res') );
            return;
          }

          map.setCenter(
            res[0].geometry.location );

          map.setZoom( 15 );

          self.trigger('search');

        });
      }
    }); 

    this._selectize = $sel[0].selectize;

    return this;
  }

  ,clear: function()
  {
    this._selectize.clear();
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

  //,events: 
  //{
    //'click': 'xxx' 
  //}

});

return SearchMunicipiosView;

});

