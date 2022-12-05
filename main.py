import os
import flask
from werkzeug.utils import secure_filename
from waitress import serve
import mysql.connector
from Search import Search
from flask_cors import CORS, cross_origin, logging

brochureUploadFilePath = './brochures'
imageUploadFilePath = './images'
ALLOWED_EXTENSIONS = {'pdf'}

app = flask.Flask(__name__)
cors = CORS(app)

app.config['BROCHURE_FOLDER'] = brochureUploadFilePath
app.config['IMAGE_FOLDER'] = imageUploadFilePath


def newDb():
    return mysql.connector.connect(user='root', password='password',
                                       host='localhost', database='mysql')

database =  mysql.connector.connect(user='root', password='password',
                                   host='localhost', database='mysql')

if database:
    print('Connected to MySQL Server')

db = database.cursor()


createTables = """
create table projectLists IF NOT EXISTS (
  id int NOT NULL AUTO_INCREMENT,
  city char(40),
  name varchar(20) UNIQUE,
  image varchar(200) UNIQUE,
  brochure varchar(200) UNIQUE,
  PRIMARY KEY (id)
);

CREATE TABLE employee IF NOT EXISTS (
  id int NOT NULL AUTO_INCREMENT primary key,
  name char(20),
  email char(30) NOT NULL UNIQUE,
  phone int(10) NOT NULL UNIQUE,
  designation char(20),
  password varchar(200) NOT NULL
);

create table queries(
  id int NOT NULL AUTO_INCREMENT primary key,
  client_email varchar(30),
  description varchar(200) NOT NULL,
  client_name char(20),
  client_phone int(10) NOT NULL
);

create table customers IF NOT EXISTS (
  id int NOT NULL AUTO_INCREMENT primary key,
  name char(20),
  email varchar(30) NOT NULL UNIQUE,
  password varchar(200) NOT NULL,
  phone int(10) NOT NULL UNIQUE
);
"""

db.execute(createTables, multi=True)
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
        addcursor.execute("INSERT into projectLists (name, city, image, brochure) VALUES (%s, %s, %s, %s)",
                   (data['name'], data['city'], data['image'], data['brochure']))
        database.commit()

        print(addcursor.rowcount, 'record inserted')
        addcursor.close()

    if queryType == 'query':
        addcursor.execute("INSERT into queries (client_email, description, client_name, client_phone) VALUES (%s, %s, %s, %s)", (data['client_email'], data['description'], data['client_name'], data['client_phone']))
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
    if queryType == '':
        return 200

@app.route('/cdn/view/<fileType>/id/<name>', methods=['GET'])
@cross_origin()
def view(fileType,name):
    if fileType == 'brochure':
        return flask.send_from_directory(app.config['BROCHURE_FOLDER'], filename=name)
    if fileType == 'image':
        return flask.send_from_directory(app.config['IMAGE_FOLDER'], filename=name)

@app.route('/upload', methods=['POST'])
@cross_origin()
def upload_file():
    print("Request got")
    if flask.request.method == 'POST':
        if flask.request.files:
            brochure = flask.request.files['brochure']
            brochure_name = secure_filename(brochure.filename)
            brochure.save(os.path.join(app.config['BROCHURE_FOLDER'], brochure_name))

            project_image = flask.request.files['image']
            projectImage_name = secure_filename(project_image.filename)
            project_image.save(os.path.join(app.config['IMAGE_FOLDER'], projectImage_name))


        else:
            flask.flash('No file attached to the request')

    return flask.jsonify({
        "brochure_downloadURL": "http://127.0.0.1:5000" + flask.url_for('view', fileType='brochure', name=brochure_name),
        "image_downloadURL": "http://127.0.0.1:5000" + flask.url_for('view', fileType='image', name=projectImage_name)
    }), 201

if __name__ == '__main__':
    app.secret_key = 'MxMx28xAxE'
    app.config['SESSION_TYPE'] = 'filesystem'
    serve(app, host='127.0.0.1', port=5000)

