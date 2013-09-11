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

function Alertas( opt ) 
{
  _.extend( this, Backbone.Events );

  this.opt = opt;

  this.db = function()
  {
    return _db;
  }

  var _db = {
    task: 'incidents'
  };
}

Alertas.prototype.parse =
function( data, sync_opt )
{
  var opt = this.opt;

  var date
    ,titulo
    ,resumen
    ,locacion
    ,temas
    ,descripcion;

  var reportes = data.payload.incidents; 
  var r;
  //var reporte, i = reportes.length;

  //while( i-- )
  function parse( reporte )
  {
    //reporte = reportes[i]; 

    r = reporte.incident;

    if ( r.incidentverified === '0' )
      //continue;
      return;

    resumen = r.incidentdescription.split(' ').slice(0,20).join(' ') + '...';

    titulo = r.incidenttitle;
    descripcion = r.incidentdescription;
    locacion = r.locationname;

    temas = [];
    _.each( reporte.categories, function(cat)
    {
      temas.push( cat.category.title );
    });
    temas = temas.join(',');

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
        ,locacion: locacion
        ,temas: temas
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
    ,callback: function()
    {
      this.trigger( 'complete' );
    }
  });

}

return Alertas;

});
