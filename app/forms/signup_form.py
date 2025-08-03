from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, Email, Optional, ValidationError
from app.models import User

def user_exists(form, field):
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')

def username_exists(form, field):
    username = field.data
    if username:  
        user = User.query.filter(User.username == username).first()
        if user:
            raise ValidationError('Username is already in use.')

class SignUpForm(FlaskForm):
    username = StringField('username', validators=[Optional(), username_exists])  
    email = StringField('email', validators=[DataRequired(), Email(), user_exists])  
    password = PasswordField('password', validators=[DataRequired()])  

