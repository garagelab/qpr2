#!/bin/bash

#./export_industrias.sh
#exporta a industrias.csv por default

#./export_industrias.sh > miarchivo.csv
#exporta a un csv con nombre miarchivo

python parser.py
sqlite3 qpr.sqlite <<!
.headers on
.mode csv
.output industrias.csv
select * from industrias_dje;
!
