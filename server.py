from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2 as pg
from datetime import datetime as dt

app = Flask(__name__)
CORS(app)

db_con_str = "host=localhost user=postgres password=postgres dbname=animal_sightings_db"

@app.route('/api/countries')
def countries():
    q = "select country from countries order by country"
    with pg.connect(db_con_str) as con:
        cur = con.cursor()
        cur.execute(q)
        db_data = cur.fetchall()
        ret_data = [row[0] for row in db_data]
        return jsonify(ret_data)

@app.route('/api/filter')
def filter():
    args = dict(request.args)
    params = {}
    for k in ['s', 'genus', 'date_from', 'date_to', 'country']:
        if k in args:
            params[k] = args[k]

    where = 'where '
    for k in params.keys():
        if k == 's':
            where += 'common_name ~* %s and '
        elif k == 'genus':
            where += 'taxon_family_name ~* %s and '
        elif k == 'date_from':
            where += 'observed_on >= %s and '
        elif k == 'date_to':
            where += 'observed_on <= %s and '
        elif k == 'country':
            where += 'country ~* %s and '

    q = f"""select common_name, 
                scientific_name, 
                taxon_family_name, 
                observed_on,  
                latitude,
                longitude,
                image_url,
                country
            from animals a
            join sightings s on a.animal_id = s.animal_id
            join countries c on s.country_abbr = c.country_abbr
            {where[:-4]}  
            order by observed_on desc
        """
    
    with pg.connect(db_con_str) as con:
        cur = con.cursor()
        cur.execute(q, list(params.values()))

        q_data = cur.fetchall()
        
        ret_data = []
        for row in q_data:
            ret_data.append({
                'name': row[0],
                'genus': row[1],
                'family': row[2],
                'observation_date': dt.strftime(row[3], '%Y-%m-%d'),
                'coords': [float(row[4]), float(row[5])],
                'image_url': row[6],
                'country': row[7]
            })

        return jsonify({ 'count': len(ret_data), 'data': ret_data})


if __name__ == '__main__':
    app.run(debug=True)
