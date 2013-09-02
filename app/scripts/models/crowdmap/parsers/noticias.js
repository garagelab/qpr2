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

function Noticias( opt ) 
{
  _.extend( this, Backbone.Events );

  this.opt = opt;

  this.db = function()
  {
    return _db;
  }

  var _db = {
    task: 'incidents'
    ,by: 'catname'
    ,name: 'noticias'
  };

}

Noticias.prototype.parse =
function( data, sync_opt )
{
  var opt = this.opt; 

  var date
    ,titulo
    ,resumen
    ,descripcion;

  var reportes = data.payload.incidents; 
  var r;
  //var reporte, i = reportes.length;

  //while( i-- )
  function parse( reporte )
  {
    //reporte = reportes[i]; 

    r = reporte.incident;

    //if ( r.incidentverified === '0' )
      ////continue;
      //return;

    resumen = r.incidentdescription.split(' ').slice(0,20).join(' ') + '...';

    titulo = r.incidenttitle;
    descripcion = r.incidentdescription;

    date = new Date( 
        r.incidentdate.replace(' ','T') )
      .toISOString();

    this.trigger('add:feature', new Feature({ 
      id: r.incidentid
      ,properties: {
        id: r.incidentid
        ,type: opt.name
        ,date: {
          iso: date
          ,src: r.incidentdate
        }
        ,titulo: titulo 
        ,resumen: resumen 
        ,descripcion: descripcion 
        ,icon: opt.icon
      }
      ,geometry: {
        type: 'Point'
        ,coordinates: [
          parseFloat( r.locationlatitude ) 
          ,parseFloat( r.locationlongitude )
        ]
      }
    }) );

  }

  utils.process( {
    list: reportes
    ,iterator: parse
    ,context: this
  });

}

return Noticias;

});

