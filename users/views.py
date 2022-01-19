# IMPORTS
import logging

from flask import Blueprint, render_template, redirect, url_for, request
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash, generate_password_hash

from app import requires_roles
from models import User
from sql_handler import sql_update, sql_get
from users.forms import RegisterForm, LoginForm, UpdateInfoForm

users_blueprint = Blueprint('users', __name__, template_folder='templates')


# REGISTER PAGE
@users_blueprint.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    # Takes user inputs from form and adds it to database as a new row
    if form.validate_on_submit():
        sql_update("INSERT INTO Users (email, firstName, lastName, educationLevel, dateOfBirth, password, takenCS, "
                   "phoneNumber, role)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ",
                   (form.email.data, form.firstName.data, form.lastName.data, form.educationLevel.data, form.dob.data,
                    generate_password_hash(form.password.data), form.studiedCompSci.data, form.phone.data, "user"))
        logging.warning('SECURITY - User registration [%s, %s]', form.email.data, request.remote_addr)
        return redirect(url_for('users.login'))
    return render_template('register.html', form=form)


#ACCOUNT PAGE
@users_blueprint.route('/account')
def account():
    # Takes information about user from Model and displays it
    return render_template('account.html',
                           email=current_user.email,
                           firstName=current_user.firstName,
                           lastName=current_user.lastName,
                           phoneNumber=current_user.phoneNumber,
                           dateOfBirth=current_user.dateOfBirth,
                           educationLevel=current_user.educationLevel,
                           takeCS=current_user.takenCS)


#LOGIN PAGE
@users_blueprint.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    # Checks if values from form are a matching username and password, if they are not it will not log the user in
    if form.validate_on_submit():

        user = User.query.filter_by(email=form.email.data).first()
        if not user or not check_password_hash(user.password, form.password.data):
            logging.warning('SECURITY - Invalid Login Attempt [%s, %s]', form.email.data, request.remote_addr)

            return render_template('login.html', form=form)

        login_user(user)
        logging.warning('SECURITY - Log in [%s, %s]', current_user.email, request.remote_addr)
        # Checks to see if the user is an admin or not and redirects them to the right page
        if current_user.role == 'admin':
            return redirect(url_for('admin.admin'))
        else:
            return redirect(url_for('users.account'))

    return render_template('login.html', form=form)


# LEARNING RESOURCES PAGE
@users_blueprint.route('/learningResources')
@login_required
@requires_roles('user')
def learningResources():
    return render_template('learningResources.html')


#LEADERBOARD PAGE
@users_blueprint.route('/leaderboard')
@login_required
@requires_roles('user')
def leaderboard():
    # Gets the top 10 scoring users from the User tabel to display as an overall leaderboard
    totalValues = sql_get(
        "SELECT TOP 10 firstName, overallScore FROM Users WHERE role = 'user' ORDER BY overallScore DESC", ())
    # Gets the top 10 scoring users from the Asteroids Game
    asteroidsValues = sql_get(
        "SELECT TOP 10 u.firstName, a.hiScore " +
        "FROM Users u, Asteroids a " +
        "WHERE u.userID = a.userID AND NOT u.role = 'admin'" +
        "ORDER BY a.hiScore DESC"
        , ())
    # Gets the top 10 scoring users from the quiz game
    quizValues = sql_get(
        "SELECT TOP 10 u.firstName, a.hiScore " +
        "FROM Users u, Quiz a " +
        "WHERE u.userID = a.userID AND NOT u.role = 'admin'" +
        "ORDER BY a.hiScore DESC"
        , ())
    # Gets the top 10 scoring users from the hangman game
    hangmanValues = sql_get(
        "SELECT TOP 10 u.firstName, a.hiScore " +
        "FROM Users u, HangMan a " +
        "WHERE u.userID = a.userID AND NOT u.role = 'admin'" +
        "ORDER BY a.hiScore DESC"
        , ())
    # Gets the top 10 scoring users from choose path game
    choosePathValues = sql_get(
        "SELECT TOP 10 u.firstName, a.hiScore " +
        "FROM Users u, ChoosePath a " +
        "WHERE u.userID = a.userID AND NOT u.role = 'admin'" +
        "ORDER BY a.hiScore DESC"
        , ())
    return render_template('leaderboard.html', totalScores=totalValues, asteroidsScores=asteroidsValues,
                           quizScores=quizValues, hangmanScores=hangmanValues, choosePathScores=choosePathValues)


# ASTEROID PAGES
@users_blueprint.route('/asteroidsSoftwareTesting')
@login_required
@requires_roles('user')
def asteroidsSoftwareTesting():
    return render_template('asteroidsSoftwareTesting.html')


@users_blueprint.route('/asteroidsBusinessIntelligence')
@login_required
@requires_roles('user')
def asteroidsBusinessIntelligence():
    return render_template('asteroidsBusinessIntelligence.html')


@users_blueprint.route('/asteroidsTechnicalOperations')
@login_required
@requires_roles('user')
def asteroidsTechnicalOperations():
    return render_template('asteroidsTechnicalOperations.html')


# HANGMAN PAGES
@users_blueprint.route('/hangmanSoftwareTesting')
@login_required
@requires_roles('user')
def hangmanSoftwareTesting():
    return render_template('hangmanSoftwareTesting.html')


@users_blueprint.route('/hangmanBusinessIntelligence')
@login_required
@requires_roles('user')
def hangmanBusinessIntelligence():
    return render_template('hangmanBusinessIntelligence.html')


@users_blueprint.route('/hangmanTechnicalOperations')
@login_required
@requires_roles('user')
def hangmanTechnicalOperations():
    return render_template('hangmanTechnicalOperations.html')


# QUIZ PAGES
@users_blueprint.route('/quizSoftwareTesting')
@login_required
@requires_roles('user')
def quizSoftwareTesting():
    return render_template('quizSoftwareTesting.html')


@users_blueprint.route('/quizBusinessIntelligence')
@login_required
@requires_roles('user')
def quizBusinessIntelligence():
    return render_template('quizBusinessIntelligence.html')


@users_blueprint.route('/quizTechnicalOperations')
@login_required
@requires_roles('user')
def quizTechnicalOperations():
    return render_template('quizTechnicalOperations.html')


# UPDATE ACCOUNT PAGE
@users_blueprint.route('/accountUpdate', methods=['GET', 'POST'])
@login_required
@requires_roles('user')
def accountUpdate():
    form = UpdateInfoForm()
    if form.validate_on_submit and check_password_hash(current_user.password, form.password.data):
        if form.email.data:
            sql_update("UPDATE Users SET email =" + form.email.data + " WHERE userID = " + str(current_user.userID))
        if form.firstName.data:
            sql_update("UPDATE Users SET firstName =" + form.firstName.data + " WHERE userID = " + str(current_user.userID))
        if form.lastName.data:
            sql_update("UPDATE Users SET lastName =" + form.lastName.data + " WHERE userID = " + str(current_user.userID))
        if form.phone.data:
            sql_update("UPDATE Users SET phoneNumber =" + form.phone.data + " WHERE userID = " + str(current_user.userID))
        if form.password.data:
            sql_update("UPDATE Users SET password =" + generate_password_hash(form.password.data) + " WHERE userID = " + str(current_user.userID))
        if form.educationLevel.data:
            sql_update("UPDATE Users SET educationLevel =" + form.educationLevel.data + " WHERE userID = " + str(current_user.userID))
        if form.studiedCompSci.data:
            sql_update("UPDATE Users SET takenCS =" + form.studiedCompSci.data + " WHERE userID = " + str(current_user.userID))
        return redirect(url_for('users.account'))
    return render_template("accountUpdate.html", form=form)


# LOGOUT FUNCTION
@users_blueprint.route("/logout")
@login_required
def logout():
    logging.warning('SECURITY - Log out [%s, %s]', current_user.email, request.remote_addr)
    logout_user()
    return redirect(url_for('index'))
