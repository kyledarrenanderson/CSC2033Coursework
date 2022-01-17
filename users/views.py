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
from users.forms import RegisterForm, LoginForm, UpdateInfoForm
from models import User
from app import requires_roles

users_blueprint = Blueprint('users', __name__, template_folder='templates')


@users_blueprint.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        sql_update("INSERT INTO Users (email, firstName, lastName, educationLevel, dateOfBirth, password, takenCS, " 
                  "phoneNumber, role)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ",
                   (form.email.data, form.firstName.data, form.lastName.data, form.educationLevel.data, form.dob.data,
                    generate_password_hash(form.password.data), form.studiedCompSci.data, form.phone.data, "user"))
        logging.warning('SECURITY - User registration [%s, %s]', form.email.data, request.remote_addr)
        return redirect(url_for('users.login'))
    return render_template('register.html', form=form)


@users_blueprint.route('/account')
def account():  # put application's code here
    return render_template('account.html',
                           email=current_user.email,
                           firstName=current_user.firstName,
                           lastName=current_user.lastName,
                           phoneNumber=current_user.phoneNumber,
                           dateOfBirth=current_user.dateOfBirth,
                           educationLevel=current_user.educationLevel,
                           takeCS=current_user.takenCS)


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
            logging.warning('SECURITY - Invalid Login Attempt [%s, %s]', form.email.data, request.remote_addr)
            if session['logins'] == 3:
                flash('Number of incorrect login attempts exceeded')
            elif session['logins'] == 2:
                flash('Please check your login details and try again. 1 login attempt remaining')
            else:
                flash('Please check your login details and try again. 2 login attempts remaining')

            return render_template('login.html', form=form)

        session['logins'] = 0
        login_user(user)
        logging.warning('SECURITY - Log in [%s, %s]', current_user.email, request.remote_addr)
        if current_user.role == 'admin':
            return redirect(url_for('admin.admin'))
        else:
            return redirect(url_for('users.account'))

    return render_template('login.html', form=form)



@users_blueprint.route('/learningResources')
@login_required
@requires_roles('user')
def learningResources():  # put application's code here
    return render_template('learningResources.html')


@users_blueprint.route('/leaderboard')
@login_required
@requires_roles('user')
def leaderboard():  # put application's code here

    totalValues = sql_get("SELECT TOP 10 firstName, overallScore FROM Users WHERE role = 'user' ORDER BY overallScore DESC",())
    return render_template('leaderboard.html', totalScores=totalValues)


@users_blueprint.route('/accountUpdate', methods=['GET', 'POST'])
@login_required
@requires_roles('user')
def accountUpdate():
    form = UpdateInfoForm()
    if form.validate_on_submit():
        if form.email.data:
            sql_update("INSERT INTO Users (email)VALUES(?) WHERE (userID)"+str(current_user.userID), form.email.data)
        if form.firstName.data:
            sql_update("INSERT INTO Users (firstName)VALUES(?) WHERE (userID)"+str(current_user.userID), form.firstName.data)
        if form.lastName.data:
            sql_update("INSERT INTO Users (lastName)VALUES(?) WHERE (userID)"+str(current_user.userID), form.lastName.data)
        if form.phone.data:
            sql_update("INSERT INTO Users (phoneNumber)VALUES(?) WHERE (userID)"+str(current_user.userID), form.phone.data)
        if form.password.data:
            sql_update("INSERT INTO Users (password)VALUES(?) WHERE (userID)"+str(current_user.userID), generate_password_hash(form.password.data))
        if form.educationLevel.data:
            sql_update("INSERT INTO Users (educationLevel)VALUES(?) WHERE (userID)"+str(current_user.userID), form.educationLevel.data)
        if form.studiedCompSci.data:
            sql_update("INSERT INTO Users (takenCS)VALUES(?) WHERE (userID)"+str(current_user.userID), form.studiedCompSci.data)
        return redirect(url_for('users.account'))
    return render_template("accountUpdate.html", form=form)



@users_blueprint.route("/logout")
@login_required
def logout():
    logging.warning('SECURITY - Log out [%s, %s]', current_user.email, request.remote_addr)
    logout_user()
    return redirect(url_for('index'))
