# Remote library imports
from flask_restful import Resource, reqparse

# Local imports
from config import app, db, api
from models import User, Recipe, Restaurant, UserRestaurant, Review
from sqlalchemy import and_
from flask import render_template, request, make_response, jsonify, session
import logging
import requests
import os 
import json
from sqlalchemy.exc import IntegrityError



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
        
class GetRestaurants(Resource):
    def get(self):
            viewed_restaurants = Restaurant.query.all()

            return make_response(jsonify([viewed_restaurant.to_dict() for viewed_restaurant in viewed_restaurants]),
            200,
            )



# UserRestaurant Routes
def favorite_yelp_restaurant(yelp_data, user_id):
        # Associate restaurant with user in UserRestaurant table
    user_restaurant = UserRestaurant.query.filter_by(user_id=user_id, restaurant_id=yelp_data['id']).first()
    if user_restaurant is None:
        user_restaurant = UserRestaurant(
            user_id=user_id,
            restaurant_id=yelp_data['id'],
            name=yelp_data['name'],
            image_url=yelp_data['image_url'],
            rating=yelp_data['rating'],
            address=' '.join(yelp_data['location']['display_address'])
        )
        db.session.add(user_restaurant)
        db.session.commit()

class GetFavoriteRestaunts(Resource):
    def get(self):
        if 'user_id' in session and session['user_id'] is not None:
            user_id = session['user_id']
            favorite_restaurants = UserRestaurant.query.filter_by(user_id=user_id).all()

            return make_response(jsonify([favorite_restaurant.to_dict() for favorite_restaurant in favorite_restaurants]),
            200,
            )
        return {'error': 'Unauthorized'}, 401


class FavoriteRestaurantResource(Resource):
    def post(self):
        data = request.get_json()
        user_id = data.pop('user_id')
        try:
            favorite_yelp_restaurant(data, user_id)
            return {'message': 'Restaurant was favorited successfully'}, 201
        except Exception as e:
            return {'message': str(e)}, 400


#
def save_yelp_restaurant(yelp_data):
    # Retrieve or create the restaurant
    restaurant = Restaurant.query.filter_by(id=yelp_data['id']).first()
    if restaurant is None:
        restaurant = Restaurant(id=yelp_data['id'])
    
    # Update restaurant details
    restaurant.name = yelp_data['name']
    restaurant.address = ' '.join(yelp_data['location']['display_address'])
    restaurant.cuisine_type = ', '.join(category['title'] for category in yelp_data.get('categories', []))
    restaurant.rating = yelp_data.get('rating')
    restaurant.image_url = yelp_data.get('image_url')
    restaurant.hours_of_operation = json.dumps(yelp_data.get('hours', []))  # Convert JSON to string
    restaurant.menu_url = yelp_data.get('attributes', {}).get('menu_url')
    restaurant.display_phone = yelp_data.get('display_phone')
    
    # Save restaurant to the database
    db.session.add(restaurant)
    db.session.commit()

class SaveRestaurantResource(Resource):
    def get(self, id):
        # Fetch restaurant details by restaurant_id
        restaurant = Restaurant.query.get(id)
        if restaurant:
            return jsonify(restaurant.to_dict())
        else:
            return {"error": "Restaurant not found"}, 404

    def post(self):
        data = request.get_json()
        try:
            save_yelp_restaurant(data)  # Pass user_id to the save function
            return {'message': 'Restaurant saved successfully'}, 201
        except Exception as e:
            return {'message': str(e)}, 400

class UpdateRestaurantResource(Resource):
    def post(self):
        yelp_data = request.json  # Get the Yelp data from the POST request
        if not yelp_data:
            return {'message': 'No data provided'}, 400
        
        try:
            save_yelp_restaurant(yelp_data)
            return {'message': 'Restaurant data updated successfully'}, 200
        except Exception as e:
            return {'message': str(e)}, 500
        

# Review Routes 

class GetAllMyReviews(Resource):
    def get(self):
        if 'user_id' in session and session['user_id'] is not None:
            user_id = session['user_id']
            my_reviews = Review.query.filter_by(user_id=user_id).all()

            return make_response(
                jsonify([reviews.to_dict() for reviews in my_reviews]), 200
            )

class CreateReview(Resource):
    def post(self):
        data = request.get_json()

        required_fields = ['recipe_id', 'title', 'comment', 'rating']
        for field in required_fields:
            if field not in data:
                return {'error': f'{field} is required'}, 422
            
        if 'user_id' not in session or session['user_id'] is None:
            return {'error': 'User must be logged in to submit a review'}, 401

        user_id = session['user_id']
        recipe_id = data.get('recipe_id')
        title = data.get('title')
        comment = data.get('comment')
        rating = data.get('rating')

        if not isinstance(rating, (int, float)) or rating < 0 or rating > 5 or rating % 0.5 != 0:
            return {'error': 'Rating must be a float between 0 and 5, in increments of 0.5'}, 422

        new_review = Review(
            user_id = user_id,
            recipe_id = recipe_id,
            title = title,
            comment = comment,
            rating = rating
        )
        try:
            db.session.add(new_review)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return {'error': 'An error occurred while saving the review. Please try again.'}, 500

        return {'message': 'Review created successfully', 'review': new_review.to_dict()}, 201
            





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
api.add_resource(UpdateRestaurantResource, '/update_restaurant')
api.add_resource(SaveRestaurantResource, '/save_yelp_restaurant')
api.add_resource(GetRestaurants, '/get_viewed_restaurants', endpoint='/get_viewed_restaurants')

#UserRestaurant Resources
api.add_resource(FavoriteRestaurantResource, '/favorite_restaurant', endpoint='/favorite_restaurant')
api.add_resource(GetFavoriteRestaunts, '/get_favorite_restaurants', endpoint='/get_favorite_restaurants')


if __name__ == '__main__':
    app.run(debug=True)