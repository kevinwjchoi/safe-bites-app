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