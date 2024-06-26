from flask import Flask, request, jsonify, make_response
from pymongo import MongoClient
from bson import ObjectId
import jwt
import datetime
from functools import wraps
import bcrypt
import flask_bcrypt
from flask_cors import CORS
import string
import pandas as pd

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'homeinventorysecret'

client = MongoClient( "mongodb://127.0.0.1:27017")
db = client.homeInventory
properties = db.properties
users = db.users

def login_required(func):
    @wraps(func)
    def login_required_wrapper(*args, **kwargs):
        token = request.args.get('token')
        if not token:
            return jsonify({ "message" : "Token missing" }), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        except:
            return jsonify({ "message" : "Token invalid" }), 401
        return func(*args, **kwargs)
    return login_required_wrapper

@app.route("/api/v1.0/homeinventory/register", methods=["POST"])
def register():

    # Validate the request form data
    if "username" in request.form and "password" in request.form and request.form["username"] and request.form["password"]:

        hashed_password = flask_bcrypt.generate_password_hash(request.form["password"]).decode('utf-8')

        new_user = {
        "username": request.form["username"],
        "password": hashed_password
        }

        # Check if the username already exists
        if users.find_one({'username': request.form["username"]}):
            return make_response( jsonify( { "error" : "Username already exists"} ), 403 )
        else:
            # Add new user to the users
            new_user_id = users.insert_one(new_user)
            return make_response( jsonify( { "success" : "Account creation successful"} ), 201 )
    else:
        return make_response( jsonify( { "error" : "Missing Form Data"} ), 404 )

@app.route("/api/v1.0/homeinventory/updateuser", methods=["PUT"])
@login_required
def update_user():
    # Get userid from request parameters
    id = request.args.get('userid')

    # Validate user id
    if not id or len(id) != 24 or not all(c in string.hexdigits for c in id):
        return make_response( jsonify( { "error" : "Invalid user ID"} ), 404 )

    # Validate the request form data
    if "old_username" in request.form and "old_password" in request.form and "new_username" in request.form and "new_password" in request.form and request.form["old_username"] and request.form["old_password"] and request.form["new_username"] and request.form["new_password"]:

        hashed_password = flask_bcrypt.generate_password_hash(request.form["new_password"]).decode('utf-8')

        # Check if old username and password is correct
        if users.find_one({'username': request.form["old_username"]}):
            user = users.find_one({'username': request.form["old_username"]})
            if flask_bcrypt.check_password_hash(str(user["password"]), request.form["old_password"]):
                # Check if the new username already exists
                if request.form["old_username"] != request.form["new_username"]:
                    if users.find_one({'username': request.form["new_username"]}): 
                        return make_response( jsonify( { "error" : "Username already exists"} ), 403 )
                    else:
                        # Update user in the users collection
                        new_user_id = users.update_one(
                        { "_id" : ObjectId(id) },
                        {
                            "$set" : {
                                "username": request.form["new_username"],
                                "password": hashed_password
                            }
                        })
                        return make_response( jsonify( { "success" : "Account creation successful"} ), 201 )
                else:
                    # Update user in the users collection
                    new_user_id = users.update_one(
                    { "_id" : ObjectId(id) },
                    {
                        "$set" : {
                            "username": request.form["new_username"],
                            "password": hashed_password
                        }
                    })
                    return make_response( jsonify( { "success" : "Account creation successful"} ), 201 )
            else:  
                return make_response( jsonify( { "error" : "Invalid username or password"} ), 404 ) 
        else:  
            return make_response( jsonify( { "error" : "Invalid username or password"} ), 404 )                
    else:
        return make_response( jsonify( { "error" : "Missing Form Data"} ), 404 )

@app.route("/api/v1.0/homeinventory/login", methods=["POST"])
def login():

    # Validate the request form data
    if "username" in request.form and "password" in request.form:
        # Check if the username and password exist
        if users.find_one({'username': request.form["username"]}):
            user = users.find_one({'username': request.form["username"]})
            if flask_bcrypt.check_password_hash(str(user["password"]), request.form["password"]):
                userid = str(user["_id"])
                token = jwt.encode( {
                    'user' : str(user["username"]),
                    'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
                }, app.config['SECRET_KEY'])
                return make_response( jsonify( { "token" : token, "userid" : userid }) )
            else:
                return make_response( jsonify( { "error" : "Invalid username or password"} ), 404 )
        else:
             return make_response( jsonify( { "error" : "Invalid username or password"} ), 404 )
    else:
        return make_response( jsonify( { "error" : "Missing Form Data"} ), 404 )

@app.route("/api/v1.0/homeinventory", methods=["POST"])
@login_required
def add_new_property():

    thumbnail = ''

    # Validate the request form data
    if request.form["thumbnail"] != '':
        thumbnail = request.form["thumbnail"]
    else:
        thumbnail = "/assets/Placeholder.png"
    if "property_name" in request.form and "user_id" in request.form and request.form["property_name"] and request.form["user_id"]:
        new_property = {
        "property_name": request.form["property_name"],
        "property_notes": request.form["property_notes"],
        "thumbnail": thumbnail,
        "user_id": request.form["user_id"], 
        "items": [],
        "item_count": 0,
        "total_value": 0
        }
        # Add new property to the home inventory
        new_property_id = properties.insert_one(new_property)
        new_property_link = "http://localhost:5000/api/v1.0/homeinventory/" + \
            str(new_property_id.inserted_id)
        return make_response( jsonify( { "url" : new_property_link} ), 201 )
    else:
        return make_response( jsonify( { "error" : "Missing Form Data"} ), 404 )

@app.route("/api/v1.0/homeinventory", methods=["GET"])
@login_required
def show_all_properties():

    # Get userid from request parameters
    userid = request.args.get('userid')

    # Validate user id
    if not userid or len(userid) != 24 or not all(c in string.hexdigits for c in userid):
        return make_response( jsonify( { "error" : "Invalid user ID"} ), 404 )

    data_to_return = []

    # Find all properties in the collection
    for property in properties.find():
        total_value = 0
        item_count = 0
        if userid in property["user_id"]:
            property["_id"] = str(property["_id"])
            for item in property["items"]:
                item["_id"] = str(item["_id"])
                # Calculate total value of items in property
                if item["estimated_value"] != '' and item["estimated_value"]:
                    try: total_value = total_value + int(item["estimated_value"])
                    except ValueError:
                        ...
                # Calculate total value of all items in property
                item_count = item_count + 1
            property["total_value"] = total_value
            property["item_count"] = item_count
            data_to_return.append(property)
    return make_response( jsonify( data_to_return ), 200 )

@app.route("/api/v1.0/homeinventory/<string:id>", methods=["GET"])
@login_required
def show_one_property(id):

    # Get userid from request parameters
    userid = request.args.get('userid')

    # Validate user id
    if not userid or len(userid) != 24 or not all(c in string.hexdigits for c in userid):
        return make_response( jsonify( { "error" : "Invalid user ID"} ), 404 )

    # Validate property id
    if len(id) != 24 or not all(c in string.hexdigits for c in id):
        return make_response( jsonify( { "error" : "Invalid property ID"} ), 404 )

    # Find property matching the id in url
    property = properties.find_one( { "_id" : ObjectId(id) } )
    if property is not None:
        if userid in property["user_id"]:
            property["_id"] = str(property["_id"])
            for item in property["items"]:
                item["_id"] = str(item["_id"])
            return make_response( jsonify ( [property] ), 200)
        else:
            return make_response( { "error" : "Invalid user ID"}, 404 )
    else:
        return make_response( jsonify( { "error" : "Invalid property ID"} ), 404 )
    
@app.route("/api/v1.0/homeinventory/<string:id>", methods=["PUT"])
@login_required
def edit_property(id):

    thumbnail = ''

    # Validate property id
    if len(id) != 24 or not all(c in string.hexdigits for c in id):
        return make_response( jsonify( { "error" : "Invalid property ID"} ), 404 )

    # Validate the request form data and update the matching property in the properties collection
    if request.form["thumbnail"] != '':
        thumbnail = request.form["thumbnail"]
    else:
        thumbnail = "/assets/Placeholder.png"
    if "property_name" in request.form and request.form["property_name"]:
        result = properties.update_one(
            { "_id" : ObjectId(id) },
            {
                "$set" : {
                    "property_name": request.form["property_name"],
                    "property_notes": request.form["property_notes"],
                    "thumbnail": thumbnail,
                }
            }
        )
        if result.matched_count == 1:
            edited_property_link = "http://localhost:5000/api/v1.0/homeinventory/" + id
            return make_response( jsonify( edited_property_link ), 200 )
        else:
            return make_response( jsonify( { "error" : "Invalid property ID"} ), 404 )
    else:
        return make_response( jsonify( { "error" : "Missing Form Data"} ), 404 )
    
@app.route("/api/v1.0/homeinventory/<string:id>", methods=["DELETE"])
@login_required
def delete_property(id):

    # Validate property id
    if len(id) != 24 or not all(c in string.hexdigits for c in id):
        return make_response( jsonify( { "error" : "Invalid property ID"} ), 404 )

    # Delete property with matching id
    result = properties.delete_one( { "_id" : ObjectId(id) } )
    if result.deleted_count == 1:
        return make_response( jsonify( {} ), 204 )
    else:
        return make_response( jsonify( { "error" : "Invalid property ID"} ), 404 )
    
@app.route("/api/v1.0/homeinventory/search/<string:property_name>", methods=["GET"])
@login_required
def search_all_properties(property_name):

    # Get userid from request parameters
    userid = request.args.get('userid')

    # Validate user id
    if not userid or len(userid) != 24 or not all(c in string.hexdigits for c in userid):
        return make_response( jsonify( { "error" : "Invalid user ID"} ), 404 )

    # Find all properties matching the given property name in the properties collection
    data_to_return = []
    for property in properties.find( { "property_name" :{'$regex': property_name, '$options': 'i' }} ):
        total_value = 0
        item_count = 0
        if userid in property["user_id"]:
            property["_id"] = str(property["_id"])
            for item in property["items"]:
                item["_id"] = str(item["_id"])
                # Calculate total value of items in property
                if item["estimated_value"] != '':
                    total_value = total_value + int(item["estimated_value"])
                # Calculate total value of all items in property
                item_count = item_count + 1
            property["total_value"] = total_value
            property["item_count"] = item_count
            data_to_return.append(property)

    return make_response( jsonify( data_to_return ), 200 )
    

@app.route("/api/v1.0/homeinventory/<string:id>/items", methods=["POST"])
@login_required
def add_new_item(id):

    image = ''

    # Validate property id
    if len(id) != 24 or not all(c in string.hexdigits for c in id):
        return make_response( jsonify( { "error" : "Invalid property ID"} ), 404 )

    # Validate the request form data and put it in the new item
    if request.form["item_img"] != '':
        image = request.form["item_img"]
    else:
        image = "/assets/Placeholder.png"
    if "item_name" in request.form and request.form["item_name"]:
        if property is None:
            return make_response( jsonify( { "error" : "Invalid property or item ID"} ), 404)
        else:
                new_item = {
                    "_id" : ObjectId(),
                            "item_name": request.form["item_name"],
                            "item_manufacturer": request.form["item_manufacturer"],
                            "item_model": request.form["item_model"],
                            "item_type": request.form["item_type"],
                            "item_img": image,
                            "serial_no": request.form["serial_no"],
                            "purchase_date": request.form["purchase_date"],
                            "purchase_cost": request.form["purchase_cost"],
                            "estimated_value": request.form["estimated_value"],
                            "item_notes": request.form["item_notes"]
                }
                # Update property by adding the new item
                properties.update_one(
                    { "_id" : ObjectId(id) },
                    { 
                        "$push" : { "items" : new_item },
                    }
                )
                new_item_link = "http://localhost:5000/api/v1.0/homeInventory/" + id + \
                        "/items/" + str(new_item["_id"])
        return make_response( jsonify( { "url" : new_item_link} ), 201)
    else:
        return make_response( jsonify( { "error" : "Missing Form Data"} ), 404 )

@app.route("/api/v1.0/homeinventory/<string:id>/items", methods=["GET"])
@login_required
def show_all_items(id):

    # Validate property id
    if len(id) != 24 or not all(c in string.hexdigits for c in id):
        return make_response( jsonify( { "error" : "Invalid property ID"} ), 404 )

    data_to_return = []
    property = properties.find_one(
        { "_id" : ObjectId(id) }, { "items" : 1, "_id" : 0 }
    )
    # Check if property exists
    if property is None:
        return make_response( jsonify( { "error" : "Invalid property ID"} ), 404 )
    else:
        for item in property["items"]:
            item["_id"] = str(item["_id"])
            data_to_return.append(item)
        return make_response( jsonify( data_to_return ), 200 )
    
@app.route("/api/v1.0/homeinventory/<string:id>/items/<string:item_id>", methods=["GET"])
@login_required
def show_one_item(id, item_id):

    # Validate property and item ids
    if len(id) != 24 or not all(c in string.hexdigits for c in id):
        return make_response( jsonify( { "error" : "Invalid property ID"} ), 404 )
    if len(item_id) != 24 or not all(c in string.hexdigits for c in item_id):
        return make_response( jsonify( { "error" : "Invalid item ID"} ), 404 )

    # Find matching item in the property collection
    property = properties.find_one(
        { "items._id" : ObjectId(item_id) },
        { "_id" : 0, "items.$" : 1}
    )
    if property is None:
        return make_response( jsonify( { "error" : "Invalid property or item ID"} ), 404)
    else:
        property["items"][0]["_id"] = str(property["items"][0]["_id"])
        return make_response( jsonify( property["items"][0] ), 200 )
    
@app.route("/api/v1.0/homeinventory/<string:id>/items/<string:item_id>", methods=["PUT"])
@login_required
def edit_item(id, item_id):

    image = ''

    # Validate property and item ids
    if len(id) != 24 or not all(c in string.hexdigits for c in id):
        return make_response( jsonify( { "error" : "Invalid property ID"} ), 404 )
    if len(item_id) != 24 or not all(c in string.hexdigits for c in item_id):
        return make_response( jsonify( { "error" : "Invalid item ID"} ), 404 )

    # Validate the request form data and update the matching items in the property items
    if request.form["item_img"] != '':
        image = request.form["item_img"]
    else:
        image = "/assets/Placeholder.png"
    if "item_name" in request.form and request.form["item_name"]:
        edited_item = {
            "items.$.item_name": request.form["item_name"],
            "items.$.item_manufacturer": request.form["item_manufacturer"],
            "items.$.item_model": request.form["item_model"],
            "items.$.item_type": request.form["item_type"],
            "items.$.item_img": image,
            "items.$.serial_no": request.form["serial_no"],
            "items.$.purchase_date": request.form["purchase_date"],
            "items.$.purchase_cost": request.form["purchase_cost"],
            "items.$.estimated_value": request.form["estimated_value"],
            "items.$.item_notes": request.form["item_notes"]
        }
        # Update the property with the edited item
        properties.update_one(
            { "items._id" : ObjectId(item_id) },
            { 
                "$set" : edited_item
            }
        )
        edit_item_url = "http://localhost:5000/api/v1.0/homeinventory/" + id + \
                "/items/" + item_id
        return make_response( jsonify( { "url" : edit_item_url } ), 200)
    else:
        return make_response( jsonify( { "error" : "Missing Form Data"} ), 404 )

@app.route("/api/v1.0/homeinventory/<string:id>/items/<string:item_id>", methods=["DELETE"])
@login_required
def delete_item(id, item_id):

    # Validate property and item ids
    if len(id) != 24 or not all(c in string.hexdigits for c in id):
        return make_response( jsonify( { "error" : "Invalid property ID"} ), 404 )
    if len(item_id) != 24 or not all(c in string.hexdigits for c in item_id):
        return make_response( jsonify( { "error" : "Invalid item ID"} ), 404 )

    # Update the property by removing the item
    properties.update_one(
        { "_id" : ObjectId(id) },
        { "$pull" : { "items" : { "_id" : ObjectId(item_id) } } }
    ) 
    return make_response( jsonify( {} ), 204 )

@app.route("/api/v1.0/homeinventory/<string:id>/duplicate/<string:item_id>", methods=["GET"])
@login_required
def duplicate_item(id, item_id):

    # Validate property and item ids
    if len(id) != 24 or not all(c in string.hexdigits for c in id):
        return make_response( jsonify( { "error" : "Invalid property ID"} ), 404 )
    if len(item_id) != 24 or not all(c in string.hexdigits for c in item_id):
        return make_response( jsonify( { "error" : "Invalid item ID"} ), 404 )

    # Find matching item in the property collection
    property = properties.find_one(
        { "items._id" : ObjectId(item_id) },
        { "_id" : 0, "items.$" : 1}
    )

    new_item = {
        "_id" : ObjectId(),
                "item_name": str(property["items"][0]["item_name"]),
                "item_manufacturer": str(property["items"][0]["item_manufacturer"]),
                "item_model": str(property["items"][0]["item_model"]),
                "item_type": str(property["items"][0]["item_type"]),
                "item_img": str(property["items"][0]["item_img"]),
                "serial_no": str(property["items"][0]["serial_no"]),
                "purchase_date": str(property["items"][0]["purchase_date"]),
                "purchase_cost": str(property["items"][0]["purchase_cost"]),
                "estimated_value": str(property["items"][0]["estimated_value"]),
                "item_notes": str(property["items"][0]["item_notes"]),
    }

    # Update property by adding the new item
    properties.update_one(
        { "_id" : ObjectId(id) },
        { 
            "$push" : { "items" : new_item },
        }
    )
    new_item_link = "http://localhost:5000/api/v1.0/homeInventory/" + id + \
            "/items/" + str(new_item["_id"])
    return make_response( jsonify( { "url" : new_item_link} ), 201)

@app.route("/api/v1.0/homeinventory/<string:id>/search/<string:item_name>", methods=["GET"])
@login_required
def search_items(id, item_name):

    # Validate property and item ids
    if len(id) != 24 or not all(c in string.hexdigits for c in id):
        return make_response( jsonify( { "error" : "Invalid property ID"} ), 404 )

    # Find items matching the given item name within the property in the properties collection
    data_to_return = []
    property = properties.find_one( 
        { "_id" : ObjectId(id) }, { "items" : 1, "_id" : 0 } 
    )
    for item in property["items"]:
        # Find all results that contain the search input within the item name
        if item_name.lower() in item['item_name'].lower():
            item["_id"] = str(item["_id"])
            data_to_return.append(item)

    return make_response( jsonify( data_to_return ), 200 )

@app.route("/api/v1.0/homeinventory/export", methods=["GET"])
@login_required
def export_properties():

    # Get userid from request parameters
    userid = request.args.get('userid')

    data_to_return = []

    for property in properties.find():
        total_value = 0
        item_count = 0
        if userid in property["user_id"]:
            property["_id"] = str(property["_id"])
            for item in property["items"]:
                item["_id"] = str(item["_id"])
                # Calculate total value of items in property
                if item["estimated_value"] != '':
                    total_value = total_value + int(item["estimated_value"])
                # Calculate total value of all items in property
                item_count = item_count + 1
            property["total_value"] = total_value
            property["item_count"] = item_count
            data_to_return.append(property)

    df = pd.DataFrame(list(data_to_return))
    df.to_csv('HomeInventory.csv')

    return make_response( jsonify( { "success" : "Exported HomeInventory.csv"} ), 200 )

if __name__ == "__main__":
    app.run(debug = True)