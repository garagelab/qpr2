define( [ 
    'jquery' 
    ,'underscore'
    ,'backbone'
    ,'models/qpr/feature'
    ], 

function( $, _, Backbone, Feature ) 
{

'use strict';

function Historias( opt ) 
{
  _.extend( this, Backbone.Events );

  this.opt = opt;

  this.db = function()
  {
    return _.values( _db );
  }

  //tmp
  this._geocoder = new google.maps.Geocoder();

  var _db = {
    hid: 'hid'
    ,resumen: 'resumen'
    ,descripcion: 'descripcion'
    ,direccion: 'direccion'
  };

  this.dbi = {};
  var i = 0;
  for ( var k in _db )
    this.dbi[k] = i++;

}

Historias.prototype.parse =
function( data, sync_opt )
{
  //console.log( 'historias.parse', arguments )

  var opt = this.opt;

  var hid, descripcion, resumen, addr;

  var rows = data.rows;
  var i = rows.length;

  while( i-- )
  {
    hid = rows[i][ this.dbi.hid ];
    resumen = rows[i][ this.dbi.resumen ];
    descripcion = rows[i][this.dbi.descripcion];
    addr = rows[i][ this.dbi.direccion ];

    this._geocoder.geocode( 
    { 
      'address': addr
    }, 
    (function() {

      var _hid = hid + '';
      var _titulo = hid + '';
      var _resumen = resumen + '';
      var _descripcion = descripcion + '';

      return function( r, st ) 
      {
        if ( st !== 
          google.maps.GeocoderStatus.OK ) {
          console.error( "Geocode was not successful for the following reason: " + st); 
          return;
        }

        var coord = r[0].geometry.location;

        //console.log('historia geoloc', coord);

        var latlng = [];
        var n = 0;
        for ( var k in coord )
        {
          latlng[n] = coord[k];
          n++;
        }

        this.trigger('add:feature',new Feature({ 
          id: _hid
          ,properties: {
            type: opt.name
            ,titulo: _titulo
            ,resumen: _resumen
            ,descripcion: _descripcion
            ,icon: opt.icon
          }
          ,geometry: {
            type: 'Point'
            ,coordinates: [
              latlng[0], latlng[1]
            ]
          }
        }) );

      }
    })() );
  }
};

return Historias;

});

