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
      var _descr = descripcion + '';
      var _infowin = '<b>'+hid+'</b><br>'+resumen;

      //var _resumen = _descr.split(' ').slice(0,20).join(' ') + '...';
      //var _infowin = '<b>'+hid+'</b><br>'+_resumen;

      return function( r, st ) 
      {
        if ( st !== 
          google.maps.GeocoderStatus.OK ) {
          console.error( "Geocode was not successful for the following reason: " + st); 
          return;
        }

        var coord = r[0].geometry.location;

        layer.add( new Feature({ 
          id: _hid
          ,properties: {
            type: opt.name
            ,infowin: _infowin
            ,descripcion: _descr
            ,icon: opt.icon
          }
          ,geometry: {
            type: 'Point'
            ,coordinates: [
              coord.jb, 
              coord.kb
            ]
          }
        }) );

      }
    })() );
  }
};

return Historias;

});

