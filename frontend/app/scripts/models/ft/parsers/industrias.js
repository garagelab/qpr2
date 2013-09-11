define( [ 
    'jquery' 
    ,'underscore'
    ,'backbone'
    ,'models/qpr/Feature'
    ,'utils'
    ], 

function( $, _, Backbone, Feature, utils ) 
{

'use strict';

function Industrias( opt ) 
{
  _.extend( this, Backbone.Events );

  this.opt = opt;

  this.db = function()
  {
    return _.values( _db );
  }

  var _db = {
    id: 'curt'
    ,loc: 'geolocation'
    ,date: 'fecha'
    ,nombre: 'razon_social'
    ,locacion: 'location'
    ,producto: 'producto_1'
    ,cuit: 'cuit'
    ,curt: 'curt'
    ,pri: 'pri'
    ,reconversion: 'reconvertida'
  };

  this.dbi = {};
  var i = 0;
  for ( var k in _db )
    this.dbi[k] = i++;

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
    ,eventos

    ,coordarr
    ,nombre
    ,locacion

    ,extra;

  var rows = data.rows;
  //var row, i = rows.length; 

  //while( i-- )
  function parse( row )
  {
    //row = rows[i];

    id = row[ this.dbi.id ];
    coordarr = (row[this.dbi.loc]).split(' '); 
    date = row[ this.dbi.date ];
    nombre = row[ this.dbi.nombre ]; 
    locacion = row[ this.dbi.locacion ]; 

    extra = {
      producto: row[ this.dbi.producto ]
      ,cuit: row[ this.dbi.cuit ]
      ,curt: row[ this.dbi.curt ]
      ,pri: row[ this.dbi.pri ]
      ,reconversion: row[ this.dbi.reconversion ]
    };

    titulo = nombre;
    resumen = extra.producto;

    descripcion = [
      ,'Producto: '
      ,extra.producto
      ,'<br>'
      ,'CUIT '
      ,extra.cuit
      ,'<br>'
      ,'CURT '
      ,extra.curt
      ,'<br>'
      ,'Dirección: '
      ,locacion
    ]
    .join('');

    eventos = [{
      name: 'contaminacion'
      ,txt: 'agente contaminante desde '+date
    }];

    if ( !_.isEmpty( extra.pri ) )
      eventos.push({
        name: 'pri'
        ,txt: 'presentó el PRI el '+extra.pri
      });

    if ( !_.isEmpty( extra.reconversion ) )
      eventos.push({
        name: 'reconversion'
        ,txt: 'reconvertida el '+extra.reconversion
      });

    this.trigger( 'add:feature', new Feature({ 
      id: id
      ,properties: {
        id: id
        ,type: opt.name
        ,date: {
          iso: new Date( date ).toISOString()
          ,src: date
        }
        ,titulo: titulo
        ,resumen: resumen
        ,descripcion: descripcion
        ,eventos: eventos
        ,icon: opt.icon
        ,locacion: locacion
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
      //var addr = row[ this.dbi.loc ];
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

  utils.process({
    list: rows
    ,iterator: parse
    ,context: this
    ,callback: function()
    {
      this.trigger( 'complete' );
    }
  });

};

return Industrias;

});

