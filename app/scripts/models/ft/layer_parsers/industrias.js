define( [ 
    'jquery' 
    ,'underscore'
    ,'backbone'
    ,'models/qpr/feature'
    ], 

function( $, _, Backbone, Feature ) 
{

'use strict';

function Industrias( opt ) 
{
  //_.extend( this, Backbone.Events );

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
function( layer, data, sync_opt )
//function( data, sync_opt )
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

  var rows = data.rows;
  var i = rows.length;

  var idx = {
    id: this.db.indexOf('cuit')
    ,loc: this.db.indexOf('geolocation')
    ,date: this.db.indexOf('fecha')
    ,nombre: this.db.indexOf('razon_social')
    ,producto: this.db.indexOf('producto_1')
  }

  while( i-- )
  {
    id = rows[i][ idx.id ];
    coordarr = (rows[i][idx.loc]).split(' '); 
    date = rows[i][ idx.date ];
    nombre = rows[i][ idx.nombre ]; 
    producto = rows[i][ idx.producto ]; 

    titulo = nombre;
    resumen = producto;
    descripcion = nombre+' '+producto;

    var dateiso = new Date( date )
      .toISOString();

    //this.trigger( 'add:feature', new Feature({ 
    layer.add( new Feature({ 
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
      //var addr = rows[i][ idx.loc ];
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
};

return Industrias;

});

