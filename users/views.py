# IMPORTS
import logging
from datetime import datetime
from flask import Blueprint, render_template, flash, redirect, url_for, session, request
from flask_login import login_user, logout_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import data_required, Email
from werkzeug.security import check_password_hash
from app import db
from models import User
from users.forms import RegisterForm, LoginForm
from flask_login import login_required, current_user

users_blueprint = Blueprint('users', __name__, template_folder='templates')


@users_blueprint.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()

    if form.validate_on_submit():
        mycursor = db.cursor()

        existingUser = "SELECT * FROM users WHERE email = " + form.email.data

        mycursor.execute(existingUser)

        if existingUser:
            flash('An account with this email already exists')
            return render_template('register.html', form=form)

        addUser = "INSERT INTO users (email, firstName, lastName, educationLevel, dateOfBirth, password, takenCS, " \
                  "phoneNumber, role)VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) "
        userDetails = (form.email.data, form.firstName.data, form.lastName.data, form.educationLevel.data, form.dob.data, form.password.data, form.studiedCompSci.data, form.phone.data, "user")
        mycursor.execute(addUser, userDetails)
        db.commit()

        return redirect(url_for('users.login'))
    return render_template('register.html', form=form)


@users_blueprint.route('/account')
def account():  # put application's code here
    return render_template('account.html')


@users_blueprint.route('/login', methods=['GET', 'POST'])
def login():

    if not session.get('logins'):
        session['logins'] = 0
    elif session.get('logins') >= 3:
        flash("Number of incorrect login attempts exceeded")
    form = LoginForm()
    if form.validate_on_submit():
        session['logins'] +=1

        mycursor = db.cursor()
        correctUsername = "SELECT * FROM users WHERE email = " + form.email.data
        correctPassword = "SELECT * FROM users WHERE email = " + form.email.data + " AND password =" + check_password_hash(form.password.data)

        mycursor.execute(correctUsername, correctPassword)
        if not correctUsername or not correctPassword:
            if session['logins'] == 3:
                flash('Number of incorrect login attempts exceeded')
            elif session['logins'] == 2:
                flash('Please check your login details and try again. 1 login attempt remaining')
            else:
                flash('Please check your login details and try again. 2 login attempts remaining')

            return render_template('login.html', form=form)

    if current_user.role == 'admin':
        return redirect(url_for('admin.admin'))
    else:
        return redirect(url_for('users.account'))


def logout():
    logout_user()
    return redirect(url_for('index'))
