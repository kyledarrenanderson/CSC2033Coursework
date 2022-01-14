# IMPORTS
import logging
from datetime import datetime
from flask import Blueprint, render_template, flash, redirect, url_for, session, request
from flask_login import login_user, logout_user, login_required, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import data_required, Email
from werkzeug.security import check_password_hash, generate_password_hash
from sql_handler import sql_update, sql_get
from users.forms import RegisterForm, LoginForm
from models import User

users_blueprint = Blueprint('users', __name__, template_folder='templates')


@users_blueprint.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        sql_update("INSERT INTO Users (email, firstName, lastName, educationLevel, dateOfBirth, password, takenCS, " 
                  "phoneNumber, role)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ",
                   (form.email.data, form.firstName.data, form.lastName.data, form.educationLevel.data, form.dob.data,
                    generate_password_hash(form.password.data), form.studiedCompSci.data, form.phone.data, "user"))
        return redirect(url_for('users.login'))
    print(form.errors)
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
        session['logins'] += 1

        user = User.query.filter_by(email=form.email.data).first()
        if not user or not check_password_hash(user.password, form.password.data):
            print("invalid login")
            if session['logins'] == 3:
                flash('Number of incorrect login attempts exceeded')
            elif session['logins'] == 2:
                flash('Please check your login details and try again. 1 login attempt remaining')
            else:
                flash('Please check your login details and try again. 2 login attempts remaining')

            return render_template('login.html', form=form)


        session['logins'] = 0
        login_user(user)

        if current_user.role == 'admin':
            return redirect(url_for('admin.admin'))
        else:
            return redirect(url_for('users.account'))

    return render_template('login.html', form=form)

def logout():
    logout_user()
    return redirect(url_for('index'))
