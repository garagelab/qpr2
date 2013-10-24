define( [ 
    'jquery'
    ,'underscore'
    ], 

function( $, _ ) 
{

'use strict';

var cur_lang = 'en';

var txt = { xxx:0

  //layers

  ,monitoreo: {
    ar: 'Monitoreo Social'
    ,en: 'Social Monitoring'
  }

  ,'datos-publicos': {
    ar: 'Datos Públicos'
    ,en: 'Public Data'
  }

  ,'enviar-alerta': {
    ar: 'Enviá tu Alerta'
    ,en: 'Send your Alert'
  }

  ,alertas: {
    ar: 'Alertas'
    ,en: 'Alerts'
  }

  ,historias: {
    ar: 'Historias'
    ,en: 'Stories'
  }

  ,acciones: {
    ar: 'Acciones'
    ,en: 'Actions'
  }

  ,respuestas: {
    ar: 'Respuestas'
    ,en: 'Responses'
  }

  ,documentos: {
    ar: 'Documentos'
    ,en: 'Documents'
  }

  ,normativas: {
    ar: 'Normativas'
    ,en: 'Laws'
  }

  ,noticias: {
    ar: 'Noticias'
    ,en: 'News'
  }

  ,industrias: {
    ar: 'Industrias'
    ,en: 'Industries'
  }

  ,basurales: {
    ar: 'Basurales'
    ,en: 'Landfills'
  }

  ,ecopuntos: {
    ar: 'Ecopuntos'
    ,en: 'Ecopoints'
  }

  ,asentamientos: {
    ar: 'Asentamientos'
    ,en: 'Settlement'
  }

  ,subcuencas: {
    ar: 'Subcuencas'
    ,en: 'Sub Basins'
  }

  // timeline

  ,timeline_advocacy_conresp: {
    ar: 'días hasta la respuesta'
    ,en: 'days to response'
  }

  ,timeline_advocacy_sinresp: {
    ar: 'días sin respuesta'
    ,en: 'days without response'
  }

  // layers 

  // industrias

  ,industrias_ev_rec: {
    ar: 'reconvertida el'
    ,en: 'reconverted on'
  }

  ,industrias_ev_pri: {
    ar: 'presentó el PRI el'
    ,en: 'presented PRI on'
  }

  ,industrias_ev_ac: {
    ar: 'agente contaminante desde'
    ,en: 'pollutant from'
  }

  ,industrias_website: {
    ar: 'Sitio web'
    ,en: 'Website'
  }

  ,industrias_zona_ind: {
    ar: 'Zona Industrial'
    ,en: 'Industrial Zone'
  }

  ,industrias_sust_det: {
    ar: 'Sustancias Detalle'
    ,en: 'Substances Detalail'
  }

  ,industrias_sust_pelig: {
    ar: 'Sustancias Peligrosas'
    ,en: 'Dangerous Substances'
  }

  ,industrias_resid_pelig: {
    ar: 'Residuos Peligrosos'
    ,en: 'Dangerous Waste'
  }

  ,industrias_trat_efl: {
    ar: 'Tratamiento de Efluentes'
    ,en: 'Effluent Treatment'
  }

  ,industrias_vert_efl: {
    ar: 'Vertido de Efluentes'
    ,en: 'Effluent Discharge'
  }

  ,industrias_cons_elec: {
    ar: 'Consumo de Electricidad'
    ,en: 'Electricity Consumption'
  }

  ,industrias_sup_total: {
    ar: 'Superficie Total'
    ,en: 'Total Area'
  }

  ,industrias_personal_ofic: {
    ar: 'Personal Oficina'
    ,en: 'Office Staff'
  }

  ,industrias_personal_fab: {
    ar: 'Personal Fábrica'
    ,en: 'Factory Staff'
  }

  ,industrias_datos_establ: {
    ar: 'Datos del Establecimiento'
    ,en: 'Establishment Data: '
  }

  ,industrias_direccion: {
    ar: 'Dirección'
    ,en: 'Address'
  }

  ,industrias_actividad: {
    ar: 'Actividad'
    ,en: 'Activity'
  }

  ,industrias_curt: {
    ar: 'CURT'
    ,en: 'CURT'
  }

  ,industrias_cuit: {
    ar: 'CUIT'
    ,en: 'CUIT'
  }

  ,industrias_producto: {
    ar: 'Producto'
    ,en: 'Product'
  }

  ,industrias_datos_grales: {
    ar: 'Datos Generales'
    ,en: 'General Information '
  }

  ,industrias_fecha_act: {
    ar: 'Información Actualizada al 11/09/2013'
    ,en: 'Information Updated on 09/11/2013'
  }

  // basurales

  ,basurales_fecha_act: {
    ar: 'Fuente: Coordinación Acumar: GIRS/CPPF – Fecha actualización: 03/05/2013'
    ,en: 'Source: Acumar: GIRS/CPPF – Update Date: 03/05/2013'
  }

  // asentamientos

  ,asentamientos_cant_flias: {
    ar: 'Cantidad de Familias'
    ,en: 'Number of Families'
  }

  ,asentamientos_anio: {
    ar: 'Año de conformación'
    ,en: 'Year of creation'
  }

  ,asentamientos_otra_denom: {
    ar: 'Otra Denominación'
    ,en: 'Another Name'
  }

  ,asentamientos_fecha_relev: {
    ar: 'Fecha de Relevamiento: Enero 2013'
    ,en: 'Survey Date: January 2013'
  }

  ,asentamientos_red_cloacal: {
    ar: 'Red Cloacal'
    ,en: 'Red Sewage'
  }

  // tablas

  ,tabla_title: {
    ar: 'Titulo'
    ,en: 'Title'
  }

  ,tabla_date: {
    ar: 'Fecha'
    ,en: 'Date'
  }

  ,tabla_source: {
    ar: 'Fuente'
    ,en: 'Source'
  }

  // layer controls

  ,layer_controls_source: {
    ar: 'Fuente'
    ,en: 'Source'
  }

  // ui

  ,temas: {
    ar: 'Temas'
    ,en: 'Topics'
  }

  ,localizacion: {
    ar: 'Localización'
    ,en: 'Location'
  }

  ,search_no_res: {
    ar: 'Sin resultados...'
    ,en: 'No results...'
  }

  ,stats_layer: {
    ar: 'Hay <%- cant %> <%- layer_name %> en la Cuenca'
    ,en: 'There are <%- cant %> <%- layer_name %> in the basin'
  }

  ,stats_intro_title: {
    ar: 'En la Cuenca Matanza Riachuelo hay'
    ,en: 'In the basin of Matanza Riachuelo there are'
  }

  ,stats_intro_remate: {
    ar: 'y un Proceso de Monitoreo Social en marcha'
    ,en: 'and a Social Monitoring Process running'
  }

  ,stats_intro_basurales: {
    ar: 'Basurales remanentes'
    ,en: 'Landfill remnants'
  }

  ,stats_intro_ac: {
    ar: 'Industrias declaradas agentes contaminantes'
    ,en: 'Industries declared pollutants'
  }

  ,stats_intro_pri: {
    ar: 'Industrias han presentado planes de reconversión'
    ,en: 'Industries have submitted conversion plans'
  }

  ,stats_intro_rec: {
    ar: 'Industrias han reconvertido sus procesos'
    ,en: 'Industries have converted their processes'
  }

};

var lang = function(key)
{
  return txt[key] 
    ? txt[key][cur_lang] 
    : undefined;
}

lang.set = function( _lang )
{
  cur_lang = _lang;
}

lang.get = function()
{
  return cur_lang;
}

return lang;

});

