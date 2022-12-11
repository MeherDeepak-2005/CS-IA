import os
import flask
from flask import session
from werkzeug.utils import secure_filename
from waitress import serve
import mysql.connector
from Search import Search
from flask_cors import CORS, cross_origin, logging
import bcrypt
from functools import wraps
from flask_session import Session

cdn = './static'
ALLOWED_EXTENSIONS = {'pdf'}

app = flask.Flask(__name__)
cors = CORS(app)
sess = Session()

app.secret_key = 'MxMx28xAxE'
app.config['CDN'] = cdn
app.config['SESSION_PERMANENT'] = True
app.config['SESSION_TYPE'] = 'filesystem'
sess.init_app(app)

secretCode = 'MxMx28xAxE'

def newDb():
    return mysql.connector.connect(user='root', password='password',
                                       host='localhost', database='mysql')

database =  mysql.connector.connect(user='root', password='password',
                                   host='localhost', database='mysql')

if database:
    print('Connected to MySQL Server')

db = database.cursor()


create_products_table = """
CREATE TABLE IF NOT EXISTS products (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) UNIQUE,
    description BLOB(10000),
    price INT
);
"""
db.execute(create_products_table)

create_productImages_table = """CREATE TABLE IF NOT EXISTS productImages (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    productId int REFERENCES products(id),
    imageUrl VARCHAR(200)
);
"""
db.execute(create_productImages_table)

create_employee_table = """
CREATE TABLE IF NOT EXISTS staff (id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name CHAR(20),
    mail CHAR(30) NOT NULL UNIQUE,
    phone int(10) NOT NULL UNIQUE,
    designation CHAR(20),
    password VARCHAR(200) NOT NULL
);"""
db.execute(create_employee_table)


create_table_customer = """
CREATE TABLE IF NOT EXISTS customer (
    id int AUTO_INCREMENT PRIMARY KEY,
    name CHAR(30),
    email CHAR(30) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL
);
"""
db.execute(create_table_customer)

create_queries_table = """
CREATE TABLE IF NOT EXISTS queries (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    client_email CHAR(20),
    client_name CHAR(20),
    client_phone int(10) NOT NULL,
    description VARCHAR(200) NOT NULL
);"""
db.execute(create_queries_table)

create_cart_table = """CREATE TABLE IF NOT EXISTS cart (
    id int AUTO_INCREMENT PRIMARY KEY,
    customerId int NOT NULL REFERENCES customer(id),
    itemId int REFERENCES products(id)
);"""
db.execute(create_cart_table)

# db.execute(createTables, multi=True)
db.close()



def hashPassword(password):
    bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashedPassword = bcrypt.hashpw(bytes, salt)
    return hashedPassword

def comparePassword(hashedPassword, userPassword):
    bytes = userPassword.encode('utf-8')
    return bcrypt.checkpw(bytes, hashedPassword.encode('utf-8'))



def authenticate(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if bool(flask.request.cookies.get("login")) is True:
            return f(*args, **kwargs)
        else:
            return flask.Response("User not logged in", status=401)
    wrapper.__name__ = f.__name__
    return wrapper

@app.route("/add/<queryType>", methods=['POST'])
@cross_origin()
def add(queryType):
    data = flask.request.json
    addcursor = database.cursor(buffered=True)
    if queryType == 'product':
        addcursor.execute("INSERT INTO products (name, price) VALUES (%s, %s)",
                   (data['name'], data['price']))
        database.commit()
        print(addcursor.rowcount, 'record inserted')
        addcursor.close()
        addcursor = database.cursor(buffered=True)
        addcursor.execute("SELECT id FROM products WHERE name = %s", (data['name'],))
        data = addcursor.fetchall()[0]
        addcursor.close()

    if queryType == 'query':
        addcursor.execute("INSERT INTO queries (client_email, description, client_name, client_phone) VALUES (%s, %s, %s, %s)", (data['client_email'], data['description'], data['client_name'], data['client_phone']))
        database.commit()
        print(addcursor.rowcount, 'record inserted')
        addcursor.close()

    return flask.jsonify(data), 201


# ------------ PRODUCTS -------------- #
@app.route('/get/product/<id>', methods=['GET'])
@cross_origin()
def get_product(id):

    getProductCursor = database.cursor(buffered=True)
    getProductCursor.execute("SELECT * FROM products WHERE id = %s", (id,))
    res = getProductCursor.fetchall()[0]
    getProductCursor.close()
    getProductCursor = database.cursor(buffered=True)
    getProductCursor.execute("SELECT imageUrl FROM productImages WHERE productId = %s", (id,))
    images = getProductCursor.fetchall()

    result = {
        "id": res[0],
        "name": res[1],
        "price": res[2],
        "images": [image[0] for image in images]
    }

    getProductCursor.close()

    return flask.jsonify(result)


@app.route('/get/<queryType>', methods=['GET'])
@cross_origin()
def fetch(queryType):
    database = newDb()
    fetchcursor = database.cursor()
    if queryType == 'products':
        fetchcursor.execute("SELECT products.id, name, price, imageUrl FROM products JOIN productImages ON productImages.id = (SELECT id FROM productImages WHERE products.id = productId LIMIT 1);")
        data = fetchcursor.fetchall()
        fetchcursor.close()
        return flask.jsonify(data), 200
    if queryType == 'queries':
        fetchcursor.execute(
            "SELECT * FROM queries")
        data = fetchcursor.fetchall()
        fetchcursor.close()
        return flask.jsonify(data), 200


@app.route('/cdn/view/<name>', methods=['GET'])
@cross_origin()
def view(name):
    return flask.send_from_directory(app.config['CDN'], filename=name)

@app.route('/upload/<productId>', methods=['POST'])
@cross_origin()
def upload_file(productId):
    imageNames = []
    uploadCursor = database.cursor(buffered=True)
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
    for imageUrl in imageUrls:
        uploadCursor.execute("INSERT INTO productImages (productId, imageUrl) VALUES (%s, %s)", (productId, imageUrl))
        print("UPloaded", imageUrl)
    database.commit()
    print(uploadCursor.rowcount, 'record inserted')
    uploadCursor.execute("SELECT * FROM productImages")
    print(uploadCursor.fetchall())
    uploadCursor.close()

    return flask.jsonify({"Message": "OK"})


# ------- Employee LOGIN ------- #
@app.route('/employee/new', methods=['POST'])
@cross_origin()
def add_new_employee():
    employeeDetails = flask.request.json
    if employeeDetails['secretCode'] != secretCode:
        raise Exception("Invalid Secret Code")
    hashedPassword = hashPassword(employeeDetails['password'])
    newEmployeeCursor = database.cursor()
    newEmployeeCursor.execute("INSERT INTO staff (name, mail, phone, designation, password) VALUES (%s, %s, %s, %s, %s)", (employeeDetails['name'], employeeDetails['email'], employeeDetails['phone'], employeeDetails['designation'], hashedPassword))
    database.commit()
    newEmployeeCursor.execute("SELECT id from staff WHERE mail = %s", (employeeDetails['email'],))
    getEmployeeId = newEmployeeCursor.fetchall()
    print(getEmployeeId)
    newEmployeeCursor.close()
    return flask.jsonify({"employeeId": '1'}), 201

@app.route('/employee/login', methods=['POST'])
@cross_origin()
def employee_login():
    userDetails = flask.request.json
    loginCursor = database.cursor()
    loginCursor.execute("SELECT id, password FROM staff WHERE mail = %s", (userDetails['email'],))
    result = loginCursor.fetchall()[0]
    employeeId = result[0]
    hashedPassword = result[1]
    if hashedPassword == None:
        return flask.jsonify({"message": "login failed"})
    else:
        res = comparePassword(hashedPassword, userDetails['password'])
        response = flask.make_response({"message": "successfully logged in!"})
        response.set_cookie('employeeId', str(employeeId))
        response.set_cookie("employeeLogin", str(res))
        return flask.jsonify({"employeeId": str(employeeId)})

# ----- CUSTOMER LOGIN ------- #
@app.route('/user/new', methods=['POST'])
@cross_origin()
def add_new_user():
    userDetails = flask.request.json
    hashedPassword = hashPassword(userDetails['password'])
    newUserCursor = database.cursor()
    newUserCursor.execute("INSERT into customer (name, email, password) VALUES (%s, %s, %s)", (userDetails['name'], userDetails['email'], hashedPassword))
    database.commit()
    newUserCursor.execute("SELECT id from customer WHERE email = %s", (userDetails['email'],))
    getCustomerId = newUserCursor.fetchall()[0][0]
    print(getCustomerId)
    newUserCursor.close()
    return flask.jsonify({"customerId": str(getCustomerId)}), 201

@app.route('/user/login', methods=['POST'])
@cross_origin()
def login():
    userDetails = flask.request.json
    loginCursor = database.cursor()
    loginCursor.execute("SELECT id, password FROM customer WHERE email = %s", (userDetails['email'],))
    result = loginCursor.fetchall()[0]
    customerId = result[0]
    hashedPassword = result[1]
    if hashedPassword == None:
        return flask.jsonify({"message": "login failed"})
    else:
        res = comparePassword(hashedPassword, userDetails['password'])
        response = flask.make_response({"message": "successfully logged in!"})
        response.set_cookie('customerId', str(customerId))
        response.set_cookie("login", str(res))
        return flask.jsonify({"customerId": str(customerId)})

@app.route('/user/getLogin', methods=['GET'])
@cross_origin()
def get_user():
    loginStatus = flask.request.cookies.get('login')
    return flask.jsonify({"login": bool(loginStatus)})

@app.route("/user/logout", methods=['GET'])
@cross_origin()
@authenticate
def logout():
    response = flask.Response()
    Response.delete_cookie('customerId')
    Response.delete_cookie('login')
    return Response

# -------- CART -------- #

@app.route("/add/cart/<itemId>", methods=['POST'])
@cross_origin()
def add_to_cart(itemId):
    userDetails = flask.request.json
    customerId = userDetails['customerId']
    cartCursor = database.cursor()
    cartCursor.execute('INSERT INTO cart (customerId, itemId) VALUES (%s,%s)', (customerId, itemId))
    database.commit()
    cartCursor.close()
    return flask.Response(status=201)

@app.route("/delete/cart/<itemId>", methods=['POST'])
@cross_origin()
def delete_from_cart(itemId):
    userDetails = flask.request.json
    customerId = userDetails['customerId']
    cartCursor = database.cursor()
    cartCursor.execute('DELETE FROM cart WHERE customerId = %s AND itemId = %s', (int(customerId), int(itemId)))
    database.commit()
    cartCursor.close()
    return flask.Response(status=201)

@app.route("/get/cart", methods=['POST'])
@cross_origin()
def getCart():
    products = []
    userDetails = flask.request.json
    customerId = userDetails['customerId']
    getCartCursor = database.cursor(buffered=True)
    getCartCursor.execute("SELECT products.id, name, price, imageUrl FROM cart INNER JOIN products ON cart.itemId = products.id INNER JOIN productImages ON productImages.id = (SELECT id FROM productImages WHERE cart.itemId = productImages.productId LIMIT 1) WHERE customerId = %s;", (customerId, ))
    res = getCartCursor.fetchall()
    print(res)
    getCartCursor.close()
    return flask.jsonify({"cart": res})


if __name__ == '__main__':
    # serve(app, host='127.0.0.1', port=5000)


    app.run(debug=True)
