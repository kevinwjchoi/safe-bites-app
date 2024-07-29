
# Standard library imports
from random import choice

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import User
from config import db

if __name__ == '__main__':

    fake = Faker()

    with app.app_context():

        print("--Deleting all records--")
        # Delete existing data
        # User.query.delete()
        
        print("--Creating users--")
        users = []
        usernames = set()

        for _ in range(10):
            username = fake.first_name().lower()
            while username in usernames:
                username = fake.first_name().lower()
            usernames.add(username)

            email = fake.email()
            password = username + 'password'
            allergies = ', '.join(fake.words(nb=3))  
            restrictions = ', '.join(fake.words(nb=2))  

            user = User(
                username=username,
                email=email,
                allergies=allergies,
                restrictions=restrictions
            )

            user.password_hash = password 

            users.append(user)

        db.session.add_all(users)
        db.session.commit()

        print("--Seeding complete--")