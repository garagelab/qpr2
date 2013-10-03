define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'lang'
    ,'utils'
    ,'text!tpl/infowin.html'
    ], 

function( $, _, Backbone, lang, utils, tpl ) 
{

'use strict';

var GInfowinsView = Backbone.View.extend({ 

  initialize: function() 
  { 
    var self = this;
    var opt = this.options;

    this._infowin = new google.maps.InfoWindow();

    // infowin data+events by feature id
    this.$infowins = {}; 

    this.listenTo( this.model,
      'add', this.feature_added, this );

    this.name = opt.name;
    this._visible = opt.visible;
  }

  // solo 1 infowin x layer ?
  ,tpl: _.template( tpl )

  ,dispose: function()
  {
    for ( var k in this.$infowins )
    {
      this.$infowins[k].off('click');
      this.$infowins[k].remove();
    }

    this.$infowins = null;
  } 

  ,is_visible: function()
  {
    return !!this._visible;
  }

  ,visible: function( v )
  {
    if ( v ) this.show();
    else this.hide();
  }

  ,show: function()
  {
    if ( this.is_visible() )
    {
      console.warn(this.name, 'infowins view is already visible');
      return;
    }

    this._visible = true;
  }

  ,hide: function()
  {
    this._infowin.close();
    this._visible = false;
  }

  ,feature_added: function( feature ) 
  {
    if (feature.get('geometry').type === 'Point')
    {
      this.add_infowin( feature );
    }
  }

  ,add_infowin: function( feature )
  {
    var self = this;

    var props = feature.get('properties');
    var id = feature.get('id');

    var temas = props.temas 
      ? _.without(
          props.temas.split(',')
          ,props.type )
        .join(', ')
      : '';

    if ( !_.isEmpty( temas ) )
      temas = lang('temas')+': '+temas;

    var date = props.date
      ? utils.date_iso2arg( props.date.iso )
      : '';

    var locacion = props.locacion 
      ? lang('localizacion')+': '+props.locacion
      : '';

    var $infowin = $('<div/>')

      .addClass( 'infowin' )
      .html(
          this.tpl({
            titulo: props.titulo
            ,resumen: props.resumen 
            ,type: props.type
            ,date: date
            ,temas: temas
            ,locacion: locacion
            ,eventos: props.eventos
          }) )
      //.append( 
          //'<b>'+props.titulo+'</b>'+
          //'<br>'+props.resumen )

      // see dispose()
      .click( function()
      {
        //self._infowin.close();
        self.trigger('select:feature', feature);
      });

    this.$infowins[ id ] = $infowin;
  }

  ,infowin: function( feature )
  {
    if ( ! feature )
      return this._infowin;

    var opt = this.options;

    var props = feature.get('properties');
    var geom = feature.get('geometry');

    var id, coordarr;

    if ( geom.type === 'Polygon' )
    {
      id = _.without( _.map( 
          feature.get('id').split('_')
          ,function( tk )
          {
            return tk.search(/polygon/) > -1 
              ? null : tk;
          })
        , null )
        .join('_');

      coordarr = utils
        .get_polygon_center( 
            geom.coordinates );
    }
    else
    {
      id = feature.get('id');
      coordarr = geom.coordinates;
    }

    var $infowin = this.$infowins[ id ]; 

    var coord = new google.maps.LatLng(
        coordarr[0], coordarr[1] );

    this._infowin.close();
    this._infowin.setPosition( coord );
    this._infowin.setContent( $infowin[0] );
    this._infowin.open( opt.map );
  }

});

return GInfowinsView;

});

