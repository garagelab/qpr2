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
    return _db;
  }

  this.filters = function() 
  { return ''; }
  //{ 
    //return 'WHERE ST_INTERSECTS(Address, RECTANGLE(LATLNG(37.0242,-122.2806), LATLNG(37.5242,-121.6806)))'; 
  //}

  var _db = [
    'curt'
    //,'geolocation'
    ,'latitud'
    ,'longitud'
    ,'fecha'
    ,'razon_social'
    ,'location'

    //extras
    ,'producto_1'
    ,'actividad_1'
    ,'cuit'
    ,'curt'
    ,'personal_fabrica'
    ,'personal_oficina'
    ,'superficie_total'
    ,'consumo_electricidad'
    ,'vertido_de_efluentes'
    ,'tratamiento_de_efluentes'
    ,'residuos_peligrosos'
    ,'sustancias_peligrosas'
    ,'sustancias_detalle'
    ,'zona_industrial'
    ,'sitio_web'

    //eventos
    ,'ac_fecha'
    ,'pri'
    ,'reconvertida'
  ];

}

Industrias.prototype.parse =
function( data, sync_opt )
{

  var opt = this.opt;

  var d, db = this.db();

  var descripcion
    ,resumen
    ,eventos
    ,coordarr;

  var rows = data.rows;
  //var row, i = rows.length; 

  //console.log('industrias.parse',rows.length);

  //while( i-- )
  function parse( row )
  {
    //row = rows[i];

    d = _.object( db, row );

    coordarr = [ d.latitud, d.longitud ];

    resumen = d.producto_1;

    descripcion = [

      // TODO fecha hardcodeada
      '<div>'
      ,'Información Actualizada al 11/09/2013'
      ,'</div>'

      ,'<h4>'
      ,'Datos Generales'
      ,'</h4>'

      ,'<div>'
      ,'Producto: '
      ,d.producto_1
      ,'</div>'

      ,'<div>'
      ,'CUIT '
      ,d.cuit
      ,'</div>'

      ,'<div>'
      ,'CURT '
      ,d.curt
      ,'</div>'

      ,'<div>'
      ,'Actividad: '
      ,d.actividad_1
      ,'</div>'

      //,'<div>'
      //,'Dirección: '
      //,d.location
      //,'</div>'

      ,'<h4>'
      ,'Datos del Establecimiento'
      ,'</h4>'

      ,'<div>'
      ,'Personal Fábrica: '
      ,d.personal_fabrica
      ,'</div>'

      ,'<div>'
      ,'Personal Oficina: '
      ,d.personal_oficina
      ,'</div>'

      ,'<div>'
      ,'Superficie Total: '
      ,d.superficie_total
      ,'</div>'

      ,'<div>'
      ,'Consumo de Electricidad: '
      ,d.consumo_electricidad
      ,'</div>'

      ,'<div>'
      ,'Vertido de Efluentes: '
      ,d.vertido_de_efluentes
      ,'</div>'

      ,'<div>'
      ,'Tratamiento de Efluentes: '
      ,d.tratamiento_de_efluentes
      ,'</div>'

      ,'<div>'
      ,'Residuos Peligrosos: '
      ,d.residuos_peligrosos
      ,'</div>'

      ,'<div>'
      ,'Sustancias Peligrosas: '
      ,d.sustancias_peligrosas
      ,'</div>'

      ,'<div>'
      ,'Sustancias Detalle: '
      ,d.sustancias_detalle
      ,'</div>'

      ,'<div>'
      ,'Zona Industrial: '
      ,d.zona_industrial
      ,'</div>'

      ,'<div>'
      ,'Sitio web: '
      ,d.sitio_web
      ,'</div>'
    ]
    .join('');

    // eventos

    eventos = [];

    if ( !_.isEmpty( d.ac_fecha ) )
      eventos.push({
        name: 'ac'
        ,txt: 'agente contaminante desde '+d.ac_fecha
      });

    if ( !_.isEmpty( d.pri ) )
      eventos.push({
        name: 'pri'
        ,txt: 'presentó el PRI el '+d.pri
      });

    if ( !_.isEmpty( d.reconvertida ) )
      eventos.push({
        name: 'rec'
        ,txt: 'reconvertida el '+d.reconvertida
      });

    this.trigger( 'add:feature', new Feature({ 
      id: d.curt
      ,properties: {
        id: d.curt
        ,type: opt.name
        //,date: {
          //iso: new Date(d.fecha).toISOString()
          //,src: d.fecha
        //}
        ,titulo: d.razon_social
        ,resumen: resumen
        ,descripcion: descripcion
        ,eventos: eventos
        ,eventos_title: 'Estado Legal'
        ,icon: opt.icon
        ,locacion: d.location
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

