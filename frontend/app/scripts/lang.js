define( [ 
    'jquery'
    ,'underscore'
    ], 

function( $, _ ) 
{

'use strict';

var cur_lang = 'ar';

var txt = { xxx:0

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
    ar: 'Sitio web: '
  }

  ,industrias_zona_ind: {
    ar: 'Zona Industrial: '
  }

  ,industrias_sust_det: {
    ar: 'Sustancias Detalle: '
  }

  ,industrias_sust_pelig: {
    ar: 'Sustancias Peligrosas: '
  }

  ,industrias_resid_pelig: {
    ar: 'Residuos Peligrosos: '
  }

  ,industrias_trat_efl: {
    ar: 'Tratamiento de Efluentes: '
  }

  ,industrias_vert_efl: {
    ar: 'Vertido de Efluentes: '
  }

  ,industrias_cons_elec: {
    ar: 'Consumo de Electricidad: '
  }

  ,industrias_sup_total: {
    ar: 'Superficie Total: '
  }

  ,industrias_personal_ofic: {
    ar: 'Personal Oficina: '
  }

  ,industrias_personal_fab: {
    ar: 'Personal Fábrica: '
  }

  ,industrias_datos_establ: {
    ar: 'Datos del Establecimiento'
  }

  ,industrias_direccion: {
    ar: 'Dirección: '
  }

  ,industrias_actividad: {
    ar: 'Actividad: '
  }

  ,industrias_curt: {
    ar: 'CURT '
  }

  ,industrias_cuit: {
    ar: 'CUIT '
  }

  ,industrias_producto: {
    ar: 'Producto: '
  }

  ,industrias_datos_grales: {
    ar: 'Datos Generales'
  }

  ,industrias_fecha_act: {
    ar: 'Información Actualizada al 11/09/2013'
  }

  // basurales

  ,basurales_fecha_act: {
    ar: 'Fuente: Coordinación Acumar: GIRS/CPPF – Fecha actualización: 03/05/2013'
  }

  // asentamientos

  ,asentamientos_cant_flias: {
    ar: 'Cantidad de Familias: '
  }

  ,asentamientos_anio: {
    ar: 'Año de conformación: '
  }

  ,asentamientos_otra_denom: {
    ar: 'Otra Denominación: '
  }

  ,asentamientos_fecha_relev: {
    ar: 'Fecha de Relevamiento: Enero 2013'
  }

  ,asentamientos_red_cloacal: {
    ar: 'Red Clocal: '
  }

  // tablas

  ,tabla_title: {
    ar: 'Titulo'
  }

  ,tabla_date: {
    ar: 'Fecha'
  }

  ,tabla_source: {
    ar: 'Fuente'
  }

  // ui

  ,temas: {
    ar: 'Temas'
  }

  ,localizacion: {
    ar: 'Localización'
  }

  ,search_no_res: {
    ar: 'Sin resultados...'
  }

  ,stats_layer: {
    ar: 'Hay <%- cant %> <%- layer_name %> en la Cuenca'
  }

  ,stats_intro_title: {
    ar: 'En la Cuenca Matanza Riachuelo hay:'
  }

  ,stats_intro_remate: {
    ar: 'y un Proceso de Monitoreo Social en marcha...'
  }

  ,stats_intro_basurales: {
    ar: 'Basurales remanentes'
  }

  ,stats_intro_ac: {
    ar: 'Industrias declaradas agentes contaminantes'
  }

  ,stats_intro_pri: {
    ar: 'Industrias han presentado planes de reconversión'
  }

  ,stats_intro_rec: {
    ar: 'Industrias han reconvertido sus procesos'
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

return lang;

});

