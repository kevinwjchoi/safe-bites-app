# Remote library imports
from flask_restful import Resource, reqparse

# Local imports
from config import app, db, api
from models import User, Recipe, Restaurant
from sqlalchemy import and_
from flask import render_template, request, make_response, jsonify, session
import logging
import requests
import os 




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

        # Validate required fields
        if 'username' not in data or 'email' not in data or 'password' not in data:
            return {'error': 'Username, email, and password are required'}, 422

        username = data['username'].lower()
        email = data['email'].lower()
        password = data['password']
        diet = data.get('diet', [])
        intolerance = data.get('intolerance', [])
        cuisine = data.get('cuisine', [])

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
                diet_list=diet,  # Use the setter for diet_list
                intolerance_list=intolerance,  # Use the setter for intolerance_list
                cuisine_list=cuisine  # Use the setter for cuisine_list
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
        
class Login(Resource):
    def post(self):
        data = request.get_json()

        if 'username' not in data or 'password' not in data:
            return {'error': 'Username and password are required'}, 422

        username = data['username'].lower()
        password = data['password']

        if 'username' not in data or 'password' not in data:
            return {'error' : 'Username, email, password are required.'}
        
        user = User.query.filter(User.username == username).first()

        if not user:
            return {'error' : 'Username does not exist'}, 404
        
        if user:
            if user.authenticate(password): 
                session['user_id'] = user.id
                return user.to_dict(), 200

        return {'error': 'Invalid username or password'}, 401

class Logout(Resource):
    def delete(self):
        if 'user_id' in session and session['user_id']:
            session['user_id'] = None
            return {'message': 'Logged out successfully'}, 204
        else:
            return {'error': 'Unauthorized'}, 401
        
class UpdateProfile(Resource):
    def patch(self):
        data = request.get_json()

        if 'user_id' not in session:
            return {'error': 'User must be logged in'}, 401
        
        user_id = session['user_id']
        user = User.query.filter_by(id=user_id).first()

        if not user:
            return {'error': 'User not found'}, 404

        if 'new_username' not in data or 'old_password' not in data or 'new_password' not in data or 'new_email' not in data:
            return {'error': 'Username, old password, new password, and email are required'}, 422
        
        new_username = data['new_username']
        old_password = data['old_password']
        new_password = data['new_password']
        new_email = data['new_email']
        new_diet = data.get('diet', [])
        new_intolerance = data.get('intolerance', [])
        new_cuisine = data.get('cuisine', [])

        if not user.authenticate(old_password):
            return {'error': 'Old password is incorrect'}, 401

        if new_username != user.username:
            if User.query.filter_by(username=new_username).first():
                return {'error': 'Username already exists'}, 400
            user.update_username(new_username)
        
        if new_email != user.email:
            if User.query.filter_by(email=new_email).first():
                return {'error': 'Email already exists'}, 400
            user.update_email(new_email)

        if new_password:
            if old_password == new_password:
                return {'error': 'New password must be different from old password'}, 400
            user.update_password(new_password)
        
        user.diet_list = new_diet
        user.intolerance_list = new_intolerance
        user.cuisine_list = new_cuisine
        db.session.commit()

        return {'message': 'Profile updated successfully'}, 200

#Recipe routes
class RecipeSearchResource(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('query', type=str, required=True, help='Search query is required')
        parser.add_argument('cuisine', type=str, help='Cuisine type')
        parser.add_argument('intolerances', type=str, help='Comma-separated list of intolerances')
        parser.add_argument('diet', type=str, help='Diet type')
        parser.add_argument('excludeCuisine', type=str, help='Cuisine to exclude')

        args = parser.parse_args()
        print(f"Parsed arguments: {args}")

        query = args['query']
        cuisine = args.get('cuisine', '')
        intolerances = args.get('intolerances', '')
        diet = args.get('diet', '')
        exclude_cuisine = args.get('excludeCuisine', '')

        api_key = os.getenv('REACT_APP_SPOONACULAR_API_KEY')
        url = 'https://api.spoonacular.com/recipes/complexSearch'

        params = {
            'query': query,
            'cuisine': cuisine,
            'intolerances': intolerances,
            'diet': diet,
            'excludeCuisine': exclude_cuisine,
            'apiKey': api_key
        }

        print(f"Request URL: {url}")
        print(f"Request Params: {params}")

        response = requests.get(url, params=params)

        print(f"Response Status Code: {response.status_code}")
        print(f"Response Content: {response.content.decode('utf-8')}")

        if response.status_code == 200:
            data = response.json()
            return jsonify(data['results'])  # Adjust as needed to match the Spoonacular response format
        else:
            return {'error': 'Failed to fetch recipes from Spoonacular', 'details': response.content.decode('utf-8')}, response.status_code


        
class RecipeListResource(Resource):
    def get(self):
        recipes = Recipe.query.all()
        return jsonify([recipe.to_dict() for recipe in recipes])

class RecipeResource(Resource):
    def get(self, recipe_id):
        recipe = Recipe.query.get(recipe_id)
        if recipe:
            return jsonify(recipe.to_dict())
        return {'error': 'Recipe not found'}, 404

# Restaurant Routes 
class GetRestaurantNearbyResource(Resource):
    def get(self):
        location = request.args.get('location')
        term = request.args.get('term', 'restaurant')
        categories = request.args.get('categories')

        YELP_API_KEY = os.getenv('YELP_API_KEY')

        if not location:
            return {'error': 'Location parameter is required'}, 400
        
        url = 'https://api.yelp.com/v3/businesses/search'
        headers = {'Authorization': f'Bearer {YELP_API_KEY}'}
        params = {
            'location': location,
            'term': term,
            'categories': categories,
            'limit': 10  # Adjust as necessary
        }
        
        response = requests.get(url, headers=headers, params=params)
        
        if response.status_code == 200:
            data = response.json()
            return jsonify(data)
        else:
            return jsonify({'error': 'Failed to fetch data from Yelp'}), response.status_code
 



#User API Resources
api.add_resource(GetUsers, '/users', endpoint='/users')
api.add_resource(Signup, '/signup', endpoint='/signup')
api.add_resource(CheckSession, '/check_session', endpoint='/check_session')
api.add_resource(Login, '/login', endpoint='/login')
api.add_resource(Logout, '/logout', endpoint='logout')

#Recipe API Resources
api.add_resource(RecipeSearchResource, '/recipes/search')
api.add_resource(RecipeListResource, '/recipes_list')
api.add_resource(RecipeResource, '/recipe')

#Restaurant API Resources 
api.add_resource(GetRestaurantNearbyResource, '/restaurants/nearby')

if __name__ == '__main__':
    app.run(debug=True)