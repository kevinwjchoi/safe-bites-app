# Remote library imports
from flask_restful import Resource

# Local imports
from config import app, db, api
from models import User
from sqlalchemy import and_
from flask import render_template, request, make_response, jsonify, session
import logging

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.route('/')
def index(id=0):
    return render_template("index.html")

#User routes 
class GetUsers(Resource):
    def get(self):
        users = User.query.all()

        if not users: 
            return {'error': 'No users were found'}, 404
        
        return make_response(
            jsonify([user.to_dict() for user in users]), 200
        )
    
class Signup(Resource):
    def post(self):
        data = request.get_json()

        if 'username' not in data or 'email' not in data or 'password' not in data:
            return {'error': 'Username, email, and password are required'}, 422

        username = data['username'].lower()
        email = data['email'].lower()
        password = data['password']
        allergies = data.get('allergies', '')
        restrictions = data.get('restrictions', '')

        username_exists = User.query.filter_by(username=username).first()
        email_exists = User.query.filter_by(email=email).first()

        if username_exists:
            return {'error': 'An account with this username already exists'}, 409
        if email_exists:
            return {'error': 'An account with this email already exists'}, 409
        
        try:
            new_user = User(
                username=username,
                email=email,
                allergies=allergies,
                restrictions=restrictions
            )
            new_user.password_hash = password 
            db.session.add(new_user)
            db.session.commit()
        except ValueError as e:
            return {'error': str(e)}, 400

        return new_user.to_dict(), 201

class CheckSession(Resource):
    def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()

        if user:
            return user.to_dict(), 201
        else:
            return {"error": "Unauthorized"}, 401