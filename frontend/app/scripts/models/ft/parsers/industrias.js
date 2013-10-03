define( [ 
    'jquery' 
    ,'underscore'
    ,'backbone'
    ,'lang','config','utils'
    ,'models/qpr/Feature'
    ], 

function( $, _, Backbone,
  lang, config, utils, Feature ) 
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
      ,lang('industrias_fecha_act')
      ,'</div>'

      ,'<h4>'
      ,lang('industrias_datos_grales')
      ,'</h4>'

      ,'<div>'
      ,lang('industrias_producto')
      ,d.producto_1
      ,'</div>'

      ,'<div>'
      ,lang('industrias_cuit')
      ,d.cuit
      ,'</div>'

      ,'<div>'
      ,lang('industrias_curt')
      ,d.curt
      ,'</div>'

      ,'<div>'
      ,lang('industrias_actividad')
      ,d.actividad_1
      ,'</div>'

      //,'<div>'
      //,lang('industrias_direccion')
      //,d.location
      //,'</div>'

      ,'<h4>'
      ,lang('industrias_datos_establ')
      ,'</h4>'

      ,'<div>'
      ,lang('industrias_personal_fab')
      ,d.personal_fabrica
      ,'</div>'

      ,'<div>'
      ,lang('industrias_personal_ofic')
      ,d.personal_oficina
      ,'</div>'

      ,'<div>'
      ,lang('industrias_sup_total')
      ,d.superficie_total
      ,'</div>'

      ,'<div>'
      ,lang('industrias_cons_elec')
      ,d.consumo_electricidad
      ,'</div>'

      ,'<div>'
      ,lang('industrias_vert_efl')
      ,d.vertido_de_efluentes
      ,'</div>'

      ,'<div>'
      ,lang('industrias_trat_efl')
      ,d.tratamiento_de_efluentes
      ,'</div>'

      ,'<div>'
      ,lang('industrias_resid_pelig')
      ,d.residuos_peligrosos
      ,'</div>'

      ,'<div>'
      ,lang('industrias_sust_pelig')
      ,d.sustancias_peligrosas
      ,'</div>'

      ,'<div>'
      ,lang('industrias_sust_det')
      ,d.sustancias_detalle
      ,'</div>'

      ,'<div>'
      ,lang('industrias_zona_ind')
      ,d.zona_industrial
      ,'</div>'

      ,'<div>'
      ,lang('industrias_website')
      ,d.sitio_web
      ,'</div>'
    ]
    .join('');

    // eventos

    eventos = [];

    if ( !_.isEmpty( d.ac_fecha ) )
      eventos.push({
        name: 'ac'
        ,txt: [
          lang('industrias_ev_ac')
          ,utils.date_iso2arg( d.ac_fecha )
        ].join(' ')
      });

    if ( !_.isEmpty( d.pri ) )
      eventos.push({
        name: 'pri'
        ,txt: [
          lang('industrias_ev_pri')
          ,utils.date_iso2arg( d.pri )
        ].join(' ')
      });

    if ( !_.isEmpty( d.reconvertida ) )
      eventos.push({
        name: 'rec'
        ,txt: [
          lang('industrias_ev_rec')
          ,utils.date_iso2arg( d.reconvertida )
        ].join(' ')
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

