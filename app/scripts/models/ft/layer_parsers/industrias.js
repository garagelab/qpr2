define( [ 
    'jquery' 
    ,'underscore'
    ,'backbone'
    ,'models/qpr/feature'
    ,'utils'
    ], 

function( $, _, Backbone, Feature, utils ) 
{

'use strict';

function Industrias( opt ) 
{
  _.extend( this, Backbone.Events );

  this.opt = opt;

  this.db = [
    'cuit'
    ,'geolocation'
    ,'fecha'
    ,'razon_social'
    ,'producto_1'
  ];
}

Industrias.prototype.parse =
function( data, sync_opt )
{
  //console.log('industrias.parse',this,arguments);

  var opt = this.opt;

  var id
    ,date
    ,titulo
    ,resumen
    ,descripcion

    ,coordarr
    ,nombre
    ,producto;

  var idx = {
    id: this.db.indexOf('cuit')
    ,loc: this.db.indexOf('geolocation')
    ,date: this.db.indexOf('fecha')
    ,nombre: this.db.indexOf('razon_social')
    ,producto: this.db.indexOf('producto_1')
  }

  var rows = data.rows;
  //var row, i = rows.length; 

  //while( i-- )
  function parse( row )
  {
    //row = rows[i];

    id = row[ idx.id ];
    coordarr = (row[idx.loc]).split(' '); 
    date = row[ idx.date ];
    nombre = row[ idx.nombre ]; 
    producto = row[ idx.producto ]; 

    titulo = nombre;
    resumen = producto;
    descripcion = nombre+' '+producto;

    var dateiso = new Date( date )
      .toISOString();

    this.trigger( 'add:feature', new Feature({ 
      id: id
      ,properties: {
        type: opt.name
        ,date: {
          iso: dateiso
          ,src: date
        }
        ,titulo: titulo
        ,resumen: resumen
        ,descripcion: descripcion
        //,nombre: nombre
        //,producto: producto
        ,icon: opt.icon
      }
      ,geometry: {
        type: 'Point'
        ,coordinates: [
          parseFloat( coordarr[0] ) 
          ,parseFloat( coordarr[1] ) 
        ]
      }
    }) );

    //(function() {
      //var desc = 'industria n';
      //var addr = row[ idx.loc ];
      //var delay = 1000;
      ////console.log('queue',delay*i,addr)
      //setTimeout( function()
      //{
        ////console.log('-req',delay*i,addr)
        //opt.geocoder.geocode( 
        //{ 
          //'address': addr
        //}, 
        //function( r, st ) 
        //{
          ////console.log('--res',delay*i,addr)
          //if ( st !== 
            //google.maps.GeocoderStatus.OK ) {
            //console.error( "Geocode was not successful for the following reason: " + st); 
            //return;
          //}
          //var coord = r[0].geometry.location;
          //layer.add_point( 
          //[
            //coord.jb, 
            //coord.kb
          //], desc );
        //} );
      //}, delay * i ); //setTimeout
    //})();
  }

  utils.process( rows, parse, null, this );
};

return Industrias;

});

