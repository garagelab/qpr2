define( [ 
    'models/ft/api'
    ,'models/ft/parsers/industrias'
    ,'models/ft/parsers/basurales'
    ,'models/ft/parsers/ecopuntos'
    ,'models/ft/parsers/asentamientos'
    ,'models/ft/parsers/historia_detalle'
    ,'models/ft/parsers/historia'
    ], 

function( 
  API
  ,ParserIndustrias
  ,ParserBasurales 
  ,ParserEcopuntos 
  ,ParserAsentamientos
  ,ParserHistoriaDetalle
  ,ParserHistoria
  ) 
{

'use strict';

return {
  API: API
  ,Parsers: {
    Industrias: ParserIndustrias
    ,Basurales: ParserBasurales 
    ,Ecopuntos: ParserEcopuntos 
    ,Asentamientos: ParserAsentamientos
    ,HistoriaDetalle: ParserHistoriaDetalle
    ,Historia: ParserHistoria
  }
};

});

