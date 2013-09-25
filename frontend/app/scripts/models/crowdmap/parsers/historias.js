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

function Historias( opt ) 
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
    ,name: 'historias'
  };
}

Historias.prototype.parse =
function( data, sync_opt )
{
  var opt = this.opt; 

  var customfields, cfkey;

  var date
    ,titulo
    ,resumen
    ,locacion
    ,temas
    ,descripcion
    ,links;

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

    customfields = reporte.customfields;
    for ( cfkey in customfields )
    {
      if ( customfields[cfkey]
          .field_name.toLowerCase() 
          === 'resumen' )
      {
        resumen = customfields[cfkey]
          .field_response;
        break;
      }
    }

    titulo = r.incidenttitle;
    locacion = r.locationname;

    links = _.map(
      reporte.media
      ,function( m )
      {
        if ( (/\.(gif|jpg|jpeg|tiff|png)$/i)
          .test( m.link ) )
        {
          return '<div class="link"><a href="'+m.link+'" target="_blank"><img src="'+m.link+'"/></a></div>'
        }
        else
        {
          return '<div class="link"><a href="'+m.link+'" target="_blank">'+m.link+'</a></div>'
        }
      });

    descripcion = [
      r.incidentdescription
    ]
    .concat( links )
    .join('');

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
      //las historias tienen hid = titulo
      //para filtrar en el FT/links x hid
      id: r.incidentid
      ,properties: {
        //id: r.incidenttitle
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

return Historias;

});

