define( [ 
    'models/crowdmap/api'
    ,'models/crowdmap/parsers/historias'
    ,'models/crowdmap/parsers/alertas'
    ,'models/crowdmap/parsers/noticias'
    ,'models/crowdmap/parsers/acciones'
    ,'models/crowdmap/parsers/respuestas'
    ,'models/crowdmap/parsers/documentos'
    ,'models/crowdmap/parsers/normativas'
    ], 

function( 
  API
  ,ParserHistorias
  ,ParserAlertas
  ,ParserNoticias
  ,ParserAcciones
  ,ParserRespuestas
  ,ParserDocumentos
  ,ParserNormativas
  ) 
{

'use strict';

return {
  API: API
  ,Parsers: {
    Historias: ParserHistorias
    ,Alertas: ParserAlertas
    ,Noticias: ParserNoticias
    ,Acciones: ParserAcciones
    ,Respuestas: ParserRespuestas
    ,Documentos: ParserDocumentos
    ,Normativas: ParserNormativas
  }
};

});

