from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates, relationship
import re

from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    #add serialize_rules later 
    
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    username = db.Column(db.String(25), nullable=False, unique=True)
    email = db.Column(db.String(40), nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)
    allergies = db.Column(db.String)
    restrictions = db.Column(db.String)

    @validates('username')
    def validate_username(self, key, username):
        if User.query.filter_by(username=username).first():
            raise ValueError('Username already exists')
        if not (3 <= len(username) <= 25):
            raise ValueError('Username must be between 3 and 25 characters long')
        return username

    @validates('email')
    def validate_email(self, key, email):
        if not re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
            raise ValueError('Invalid email format')
        if User.query.filter_by(email=email).first():
            raise ValueError('Email already exists')
        return email
    
    @validates('_password_hash')
    def validate_password(self, key, password):
        if len(password) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', password):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', password):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', password):
            raise ValueError('Password must contain at least one number')
        if not re.search(r'[@$!%*?&#]', password):
            raise ValueError('Password must contain at least one special character (@$!%*?&#)')
        return password
    
    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(password.encode('utf-8')).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def update_password(self, new_password):
        self.password_hash = new_password 
        db.session.commit()

    def update_username(self, new_username):
        if User.query.filter_by(username=new_username).first():
            raise ValueError('Username already exists')
        self.username = new_username
        db.session.commit()

    def update_email(self, new_email):
        if User.query.filter_by(email=new_email).first():
            raise ValueError('Email already exists')
        if not re.match(r'^[^@]+@[^@]+\.[^@]+$', new_email):
            raise ValueError('Invalid email format')
        self.email = new_email
        db.session.commit()

    def __repr__(self):
        return f'ID: {self.id}, User: {self.username}, Email: {self.email}'