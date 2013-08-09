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
  this.opt = opt;

  //tmp
  this._geocoder = new google.maps.Geocoder();

  this.db = [
    'hid'
    ,'resumen'
    ,'descripcion'
    ,'direccion'
  ];

}

Historias.prototype.parse =
function( layer, data, sync_opt )
{
  //console.log( 'historias.parse', arguments )

  var opt = this.opt;

  var hid, descripcion, resumen, addr;

  var rows = data.rows;
  var i = rows.length;

  var idx = {
    hid: this.db.indexOf('hid'),
    resumen: this.db.indexOf('resumen'),
    descripcion: this.db.indexOf('descripcion'),
    direccion: this.db.indexOf('direccion')
  }

  while( i-- )
  {
    hid = rows[i][ idx.hid ];
    resumen = rows[i][ idx.resumen ];
    descripcion = rows[i][ idx.descripcion ];
    addr = rows[i][ idx.direccion ];

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

        layer.add( new Feature({ 
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

