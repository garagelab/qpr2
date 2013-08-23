define( [ 
    //'models/ft/layer'
    //,'models/ft/historia'
    'models/ft/api'
    ,'models/ft/layer_parsers/historias'
    ,'models/ft/layer_parsers/industrias'
    ,'models/ft/layer_parsers/basurales'
    ,'models/ft/layer_parsers/ecopuntos'
    ,'models/ft/layer_parsers/asentamientos'
    ,'models/ft/layer_parsers/historia_detalle'
    ], 

function( 
  //Layer
  //,Historia 
  API
  ,LParserHistorias
  ,LParserIndustrias
  ,LParserBasurales 
  ,LParserEcopuntos 
  ,LParserAsentamientos
  ,LParserHistoriaDetalle
  ) 
{

'use strict';

return {
  //Layer: Layer
  //,Historia: Historia 
  API: API
  ,LayerParsers: {
    Historias: LParserHistorias
    ,Industrias: LParserIndustrias
    ,Basurales: LParserBasurales 
    ,Ecopuntos: LParserEcopuntos 
    ,Asentamientos: LParserAsentamientos
    ,HistoriaDetalle: LParserHistoriaDetalle
  }
};

});

