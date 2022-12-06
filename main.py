import os
import flask
from werkzeug.utils import secure_filename
from waitress import serve
import mysql.connector
from Search import Search
from flask_cors import CORS, cross_origin, logging

cdn = './static'
ALLOWED_EXTENSIONS = {'pdf'}

app = flask.Flask(__name__)
cors = CORS(app)

app.config['CDN'] = cdn


def newDb():
    return mysql.connector.connect(user='root', password='password',
                                       host='localhost', database='mysql')

database =  mysql.connector.connect(user='root', password='password',
                                   host='localhost', database='mysql')

if database:
    print('Connected to MySQL Server')

db = database.cursor()

create_projects_table = """
CREATE TABLE IF NOT EXISTS products (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    city CHAR(40), name VARCHAR(20) UNIQUE,
    image VARCHAR(200) UNIQUE,
    brochure VARCHAR(200) UNIQUE
);
"""
db.execute(create_projects_table)

create_employee_table = """
CREATE TABLE IF NOT EXISTS staff (id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name CHAR(20),
    mail CHAR(30) NOT NULL UNIQUE,
    phone int(10) NOT NULL UNIQUE,
    designation CHAR(20),
    password VARCHAR(200) NOT NULL
);"""
db.execute(create_employee_table)

create_queries_table = """
CREATE TABLE IF NOT EXISTS queries (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    client_email CHAR(20),
    client_name CHAR(20),
    client_phone int(10) NOT NULL,
    description VARCHAR(200) NOT NULL
);"""
db.execute(create_queries_table)


# db.execute(createTables, multi=True)
db.close()


# SEARCH function
@app.route('/search/<query>', methods=['GET'])
@cross_origin()
def search(query):
    searchCursor = database.cursor(buffered=True)

    # get all data from the database
    mysqlQuery = ("SELECT * FROM projectLists WHERE city = %s OR name = %s;")
    searchCursor.execute(mysqlQuery, (query,query))

    results = searchCursor.fetchall()

    return flask.jsonify(results)


@app.route("/add/<queryType>", methods=['POST'])
@cross_origin()
def add(queryType):
    data = flask.request.json
    print(data)
    addcursor = database.cursor(buffered=True)
    if queryType == 'project':
        addcursor.execute("INSERT INTO projectLists (name, city, image, brochure) VALUES (%s, %s, %s, %s)",
                   (data['name'], data['city'], data['image'], data['brochure']))
        database.commit()

        print(addcursor.rowcount, 'record inserted')
        addcursor.close()

    if queryType == 'query':
        addcursor.execute("INSERT INTO queries (client_email, description, client_name, client_phone) VALUES (%s, %s, %s, %s)", (data['client_email'], data['description'], data['client_name'], data['client_phone']))
        database.commit()
        print(addcursor.rowcount, 'record inserted')
        addcursor.close()

    return flask.jsonify(data), 201

@app.route('/fetch/<queryType>', methods=['GET'])
@cross_origin()
def fetch(queryType):
    database = newDb()
    fetchcursor = database.cursor()
    if queryType == 'projects':
        fetchcursor.execute(
            "SELECT * FROM projectLists")
        data = fetchcursor.fetchall()
        fetchcursor.close()
        return flask.jsonify(data), 200
    if queryType == 'queries':
        fetchcursor.execute(
            "SELECT * FROM queries")
        data = fetchcursor.fetchall()
        fetchcursor.close()
        return flask.jsonify(data), 200

        return 200

@app.route('/cdn/view/<name>', methods=['GET'])
@cross_origin()
def view(name):
    return flask.send_from_directory(app.config['CDN'], filename=name)

@app.route('/upload', methods=['POST'])
@cross_origin()
def upload_file():
    imageNames = []
    if flask.request.method == 'POST':
        if flask.request.files:
            print(flask.request.files)
            for productImage in flask.request.files:
                productImage = flask.request.files[productImage]
                image_name = secure_filename(productImage.filename)
                imageNames.append(image_name)
                productImage.save(os.path.join(app.config['CDN'], image_name))
        else:
            flask.flash('No file attached to the request')

    imageUrls = [flask.url_for('view', name=imageName) for imageName in imageNames]
    print(imageUrls)
        #     brochure = flask.request.files['brochure']
        #     brochure_name = secure_filename(brochure.filename)
        #     brochure.save(os.path.join(app.config['BROCHURE_FOLDER'], brochure_name))
        #
        #     project_image = flask.request.files['image']
        #     projectImage_name = secure_filename(project_image.filename)
        #     project_image.save(os.path.join(app.config['IMAGE_FOLDER'], projectImage_name))
        #
        #
        # else:
        #     flask.flash('No file attached to the request')

    return flask.jsonify({"Message": "OK"})

if __name__ == '__main__':
    app.secret_key = 'MxMx28xAxE'
    app.config['SESSION_TYPE'] = 'filesystem'
    # serve(app, host='127.0.0.1', port=5000)

    logging.getLogger('flask_cors').level = logging.DEBUG
    #
    app.run(debug=True)
