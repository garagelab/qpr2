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

  this.db = {
    task: 'incidents'
    ,by: 'catname'
    ,name: 'historias'
  };
}

Historias.prototype.parse =
function( data, sync_opt )
{
  var opt = this.opt;

  var reportes = data.payload.incidents; 
  var i = reportes.length;
  var r;

  var customfields, cfkey;

  var date
    ,titulo
    ,resumen
    ,descripcion;

  while( i-- )
  {
    r = reportes[i].incident;

    //if ( r.incidentverified === '0' )
      //continue;

    customfields = reportes[i].customfields;
    for ( cfkey in customfields )
    {
      if ( customfields[cfkey].field_name.toLowerCase() === 'resumen' )
      {
        resumen = customfields[cfkey].field_response;
        break;
      }
    }

    titulo = r.incidenttitle;
    descripcion = r.incidentdescription;

    date = new Date( 
        r.incidentdate.replace(' ','T') )
      .toISOString();

    this.trigger('add:feature', new Feature({ 
      //id: r.incidentid
      //las historias tienen hid = titulo
      //para filtrar en el FT/links x hid
      id: r.incidenttitle
      ,properties: {
        type: opt.name
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
}

return Historias;

});

