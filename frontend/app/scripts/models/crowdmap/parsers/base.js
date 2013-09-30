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

var CrowdmapParserBase = 
  _.extend( {}, Backbone.Events );

CrowdmapParserBase.parse =
function( data, sync_opt )
{
  var opt = this.opt; 

  var date
    ,link_src
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

    link_src = [
      opt.url
      ,'/reports/view/'
      ,r.incidentid
    ]
    .join('');

    // remove html tags
    resumen = (r.incidentdescription.split(' ').slice(0,20).join(' ') + '...').replace(/<(?:.|\n)*?>/gm, '');

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
      id: r.incidentid
      ,properties: {
        id: r.incidentid
        ,type: opt.name
        ,link_src: link_src 
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

};

return CrowdmapParserBase;

});

