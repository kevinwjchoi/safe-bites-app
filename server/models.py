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