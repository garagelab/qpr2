# -*- coding: utf-8 -*-

# by clodo

import os
import sqlite3
import csv
# SELECT ind.*, ins.* FROM industrias ind left join inspecciones as ins on ins.curt = ind.curt
# SELECT industrias.curt, inspecciones.curt FROM inspecciones, industrias LEFT OUTER JOIN industrias ON industrias.curt=inspecciones.curt
# SELECT industrias_actual.*, inspecciones.*, industrias.* FROM industrias_actual INNER JOIN industrias ON industrias_actual.curt=industrias.curt INNER JOIN inspecciones ON industrias_actual.curt=inspecciones.curt
# SELECT industrias_actual.*, inspecciones.*, industrias.* 
# FROM industrias_actual, industrias, inspecciones WHERE industrias_actual.curt = industrias.curt  AND industrias_actual.curt = inspecciones.curt and inspecciones.fecha == (select max(fecha) from inspecciones where curt = industrias_actual.curt)

# SELECT insp.*, ind.* 
# FROM agentes_contaminantes, industrias_dje ind, inspecciones insp
# WHERE agentes_contaminantes.curt = ind.curt  AND agentes_contaminantes.curt = insp.curt AND insp.fecha == (select max(fecha) from inspecciones where curt = agentes_contaminantes.curt);

# Vista pulenta
# SELECT insp.*, ind.*, '' as 'semaforo_riesgo', '' as 'nca_grupo', '' as 'latitud', '' as 'longitud', '' as 'semaforo_legal', '' as 'semaforo_legal_absoluto', '' as 'semaforo_riesgo_absoluto',
# (ind.calle || ', ' || ind.nro_calle || ', ' || ind.localidad_real || ', ' || ind.partido_real || ', Argentina') as location
# FROM agentes_contaminantes, industrias_dje ind, inspecciones insp
# WHERE agentes_contaminantes.curt = ind.curt  AND agentes_contaminantes.curt = insp.curt AND insp.fecha == (select max(fecha) from inspecciones where curt = agentes_contaminantes.curt)

# Vista pulenta v2
# SELECT
# insp.curt, agentes_contaminantes.fecha as ac_fecha, insp.vertido_de_efluentes, insp.residuos_patogenicos, insp.residuos_peligrosos, insp.residuos_solidos, insp.tratamiento_de_efluentes, insp.emisiones_gaseosas, insp.agua_subterranea, insp.colector_cloacal, insp.acopio_peligroso, insp.tanques_subterraneos, insp.tanques_aereos, insp.tanques_otras_sustancias, insp.otras_sustancias_detalle, insp.sustancias_peligrosas, insp.sustancias_detalle, insp.acopio_sustancias, insp.transformadores, insp.cantidad_transformadores, insp.reconversion_industrial, insp.fecha,
# ind.razon_social, ind.cuit, ind.calle, ind.nro_calle, ind.calle_1, ind.calle_2, ind.localidad_real, ind.partido_real, ind.sitio_web, ind.personal_fabrica, ind.personal_oficina, ind.superficie_total, ind.superficie_libre, ind.superficie_cubierta, ind.electricidad, ind.consumo_electricidad, ind.combustible_electricidad, ind.cantidad_electricidad, ind.actividad_1, ind.actividad_2, ind.actividad_3, ind.actividad_4, ind.actividad_5, ind.actividad_6, ind.actividad_7, ind.actividad_8, ind.actividad_9, ind.actividad_10, ind.producto_1, ind.producto_2, ind.producto_3, ind.producto_4, ind.producto_5, ind.producto_6, ind.producto_7, ind.producto_8, ind.producto_9, ind.producto_10, ind.materia_prima_1, ind.materia_prima_2, ind.materia_prima_3, ind.materia_prima_4, ind.materia_prima_5, ind.materia_prima_6, ind.materia_prima_7, ind.materia_prima_8, ind.materia_prima_9, ind.materia_prima_10, ind.aptitud_ambiental, ind.aptitud_ambiental_caba, ind.pasivos_ambientales, ind.fuente_generador_efluentes, ind.desecho_industrial, ind.tratamiento_liquido, ind.almacenamiento_sustancias, ind.descripcion_sustancias, ind.agua_consumo, ind.rubro, ind.zona_industrial, ind.gestion_ambiental,
# (ind.calle || ', ' || ind.nro_calle || ', ' || ind.localidad_real || ', ' || ind.partido_real || ', Argentina') as location, pri.fecha as pri, reconvertida.fecha as reconvertida, 0 as semaforo_riesgo, 0 as semaforo_legal, 0 as semaforo_legal_absoluto, 0 as semaforo_riesgo_absoluto,
# (CASE WHEN pri.fecha IS NULL AND reconvertida.fecha IS NULL THEN 15 WHEN pri.fecha IS NOT NULL AND reconvertida.fecha IS NULL THEN 10 ELSE 0 END) as estado_legal
# FROM agentes_contaminantes, industrias_dje ind, inspecciones insp
# LEFT JOIN pri ON pri.establecimiento = ind.curt
# LEFT JOIN reconvertida ON reconvertida.establecimiento = ind.curt
# WHERE agentes_contaminantes.establecimiento = ind.curt  AND agentes_contaminantes.establecimiento = insp.curt AND insp.fecha == (select max(fecha) from inspecciones where curt = agentes_contaminantes.establecimiento);

# Agentes contaminantes que no machean con ninguna industria
# select ac.curt as curt_ac, ind.curt as curt_industria from agentes_contaminantes ac
# left join industrias_dje as ind on ind.curt = ac.curt
# where curt_industria is null;

#campos_importantes_industrias_dje = [
#	'curt',
#	'cuit',
#	'location',
#	'semaforo_riesgo',
#	'nca_grupo',
#	'latitud',
#	'longitud',
#	'semaforo_legal',
#	'semaforo_legal_absoluto',
#	'semaforo_riesgo_absoluto',
#]

campos_importantes_fuera_ac = [
    'establecimiento',
    'fecha'
]

campos_importantes_pri = [
    'establecimiento',
    'fecha'
]

campos_importantes_inspecciones = [
	'curt',
	'vertido_de_efluentes',
	'residuos_patogenicos',
	'residuos_peligrosos',
	'residuos_solidos',
	'tratamiento_de_efluentes',
	'emisiones_gaseosas',
	'agua_subterranea',
	'colector_cloacal',
	'acopio_peligroso',
	'tanques_subterraneos',
	'tanques_aereos',
	'tanques_otras_sustancias',
	'otras_sustancias_detalle',
	'sustancias_peligrosas',
	'sustancias_detalle',
	'acopio_sustancias',
	'transformadores',
	'cantidad_transformadores',
	'reconversion_industrial',
	'fecha',
]

campos_importantes_industrias_dje = [
	'curt',
	'razon_social',
	'cuit',
	'calle',
	'nro_calle',
	'calle_1',
	'calle_2',
	'localidad_real',
	'partido_real',
	'sitio_web',
	'personal_fabrica',
	'personal_oficina',
	'superficie_total',
	'superficie_libre',
	'superficie_cubierta',
	'electricidad',
	'consumo_electricidad',
	'combustible_electricidad',
	'cantidad_electricidad',
	'actividad_1',
	'actividad_2',
	'actividad_3',
	'actividad_4',
	'actividad_5',
	'actividad_6',
	'actividad_7',
	'actividad_8',
	'actividad_9',
	'actividad_10',
	'producto_1',
	'producto_2',
	'producto_3',
	'producto_4',
	'producto_5',
	'producto_6',
	'producto_7',
	'producto_8',
	'producto_9',
	'producto_10',
	'materia_prima_1',
	'materia_prima_2',
	'materia_prima_3',
	'materia_prima_4',
	'materia_prima_5',
	'materia_prima_6',
	'materia_prima_7',
	'materia_prima_8',
	'materia_prima_9',
	'materia_prima_10',
	'aptitud_ambiental',
	'aptitud_ambiental_caba',
	'pasivos_ambientales',
	'fuente_generador_efluentes',
	'desecho_industrial',
	'tratamiento_liquido',
	'almacenamiento_sustancias',
	'descripcion_sustancias',
	'agua_consumo',
	'rubro',
	'zona_industrial',
	'gestion_ambiental',
  'latitud',
  'longitud',
]

campos_importantes_ac = [
    "establecimiento",
    "fecha"
]

def parse_csv(archivo='', delimitador='|', campos_importantes=[], tabla='una_tabla', database='qpr.sqlite', quoting=csv.QUOTE_MINIMAL):
    csv.field_size_limit(1000000000)
    reader = csv.reader(open(archivo, "rb"), delimiter=delimitador, quoting=quoting)

    try:
        conn = sqlite3.connect(database)

        cursor = conn.cursor()

        first_row = next(reader)

        headers = [column.strip() for column in first_row]
        #import pdb; pdb.set_trace()

        indices = []

        for campo in campos_importantes:
            indices.append(headers.index(campo))

        cursor.execute("DROP TABLE IF EXISTS {0} ".format(tabla))

        cursor.execute("CREATE TABLE {0} ({1})".format(tabla, ", ".join(campos_importantes)))

        placeholders = ", ".join("?"*len(campos_importantes))

        command = "INSERT INTO {0} VALUES ({1})".format(tabla, placeholders)

        #reversedLines = [line[::-1] for line in reader]
        print "Parseando archivo %s" % archivo

        row_count = 0
        for row in reader:
            try:
                bla = []
                for indice in indices:

                    item = str(row[indice]).lstrip("0")
                    #if headers.index('curt') == indice:
                    #	item = str(row[indice]).lstrip("0")
                    #else:
					#	item = row[indice]

                    bla.append(item.decode('latin-1'))

                cursor.execute(command, bla)

                row_count += 1
            except Exception, e:
                print "Error '{0}' en la linea {1}".format(e.args[0], row_count)

        conn.commit()

        print "Total registros parseados %s" % row_count

    except sqlite3.Error, e:
        print "Error1 %s:" % e.args[0]
        sys.exit(1)

    except Exception, e:
        print "Error2 %s:" % e.args[0]
        sys.exit(1)

    finally:
        if conn:
            conn.close()

	print "---------------------------------------"

if __name__ == '__main__':
    if os.path.isfile('qpr.sqlite'):
        os.unlink('qpr.sqlite')

    parse_csv('data/agente_contaminante201324050726.csv', '|', campos_importantes_ac, 'agentes_contaminantes', 'qpr.sqlite')
    parse_csv('data/plan_reconversion_industrial201324050726.csv', '|', campos_importantes_pri, 'pri', 'qpr.sqlite')
    parse_csv('data/reconvertidos.txt201324050726.csv', '|', campos_importantes_fuera_ac, 'reconvertida', 'qpr.sqlite')
    parse_csv('data/inspeccion201324050726.csv', '|', campos_importantes_inspecciones, 'inspecciones', 'qpr.sqlite')
    parse_csv('data/Dje_sicmar_2012_10_14_23.csv', '|', campos_importantes_industrias_dje, 'industrias_dje', 'qpr.sqlite', csv.QUOTE_NONE)

    try:
        conn = sqlite3.connect('qpr.sqlite')
        cursor = conn.cursor()
        cursor.execute("CREATE VIEW industrias AS SELECT insp.curt, agentes_contaminantes.fecha as ac_fecha, insp.vertido_de_efluentes, insp.residuos_patogenicos, insp.residuos_peligrosos, insp.residuos_solidos, insp.tratamiento_de_efluentes, insp.emisiones_gaseosas, insp.agua_subterranea, insp.colector_cloacal, insp.acopio_peligroso, insp.tanques_subterraneos, insp.tanques_aereos, insp.tanques_otras_sustancias, insp.otras_sustancias_detalle, insp.sustancias_peligrosas, insp.sustancias_detalle, insp.acopio_sustancias, insp.transformadores, insp.cantidad_transformadores, insp.reconversion_industrial, insp.fecha, ind.razon_social, ind.cuit, ind.calle, ind.nro_calle, ind.calle_1, ind.calle_2, ind.localidad_real, ind.partido_real, ind.sitio_web, ind.personal_fabrica, ind.personal_oficina, ind.superficie_total, ind.superficie_libre, ind.superficie_cubierta, ind.electricidad, ind.consumo_electricidad, ind.combustible_electricidad, ind.cantidad_electricidad, ind.actividad_1, ind.actividad_2, ind.actividad_3, ind.actividad_4, ind.actividad_5, ind.actividad_6, ind.actividad_7, ind.actividad_8, ind.actividad_9, ind.actividad_10, ind.producto_1, ind.producto_2, ind.producto_3, ind.producto_4, ind.producto_5, ind.producto_6, ind.producto_7, ind.producto_8, ind.producto_9, ind.producto_10, ind.materia_prima_1, ind.materia_prima_2, ind.materia_prima_3, ind.materia_prima_4, ind.materia_prima_5, ind.materia_prima_6, ind.materia_prima_7, ind.materia_prima_8, ind.materia_prima_9, ind.materia_prima_10, ind.aptitud_ambiental, ind.aptitud_ambiental_caba, ind.pasivos_ambientales, ind.fuente_generador_efluentes, ind.desecho_industrial, ind.tratamiento_liquido, ind.almacenamiento_sustancias, ind.descripcion_sustancias, ind.agua_consumo, ind.rubro, ind.zona_industrial, ind.gestion_ambiental, (ind.calle || ', ' || ind.nro_calle || ', ' || ind.localidad_real || ', ' || ind.partido_real || ', Argentina') as location, pri.fecha as pri, reconvertida.fecha as reconvertida, 0 as semaforo_riesgo, 0 as semaforo_legal, 0 as semaforo_legal_absoluto, 0 as semaforo_riesgo_absoluto, (CASE WHEN pri.fecha IS NULL AND reconvertida.fecha IS NULL THEN 15 WHEN pri.fecha IS NOT NULL AND reconvertida.fecha IS NULL THEN 10 ELSE 0 END) as estado_legal, (CASE WHEN ind.actividad_1 LIKE '15%' THEN 'Alimenticia' WHEN ind.actividad_1 LIKE '17%' THEN 'Textil' WHEN ind.actividad_1 LIKE '19%' THEN 'Curtiembre' WHEN ind.actividad_1 LIKE '21%' THEN 'Papelera' WHEN ind.actividad_1 LIKE '24%' THEN 'Quimica' WHEN ind.actividad_1 LIKE '28%' THEN 'Metalurgia' ELSE 'Otro' END) as rubro_id FROM agentes_contaminantes, industrias_dje ind, inspecciones insp LEFT JOIN pri ON pri.establecimiento = ind.curt LEFT JOIN reconvertida ON reconvertida.establecimiento = ind.curt WHERE agentes_contaminantes.establecimiento = ind.curt  AND agentes_contaminantes.establecimiento = insp.curt AND insp.fecha == (select max(fecha) from inspecciones where curt = agentes_contaminantes.establecimiento)")
    except Exception, e:
        print "Error al crear la vista: %s" % e.args[0]
