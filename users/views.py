from flask import Blueprint, render_template, request, redirect, url_for, flash
from users.forms import RegisterForm, LoginForm
from app import db
from models import User

users_blueprint = Blueprint('users', __name__, template_folder='templates')


@users_blueprint.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()

    if form.validate_on_submit():
        mycursor = db.cursor()

        existingUser = "SELECT * FROM users WHERE email = form.email.data"

        mycursor.execute(existingUser)

        if existingUser:
            flash('An account with this email already exists')
            return render_template('register.html', form=form)

        addUser = "INSERT INTO users (email, firstName, lastName, educationLevel, dateOfBirth, password, takenCS, " \
                  "phoneNumber)VALUES (%s, %s, %s, %s, %s, %s, %s, %s) "
        userDetails = (form.email.data, form.firstName.data, form.lastName.data, form.educationLevel.data, form.dob.data, form.password.data, form.studiedCompSci.data, form.phone.data)
        mycursor.execute(addUser, userDetails)
        db.commit()

        return redirect(url_for('users.login'))
    return render_template('register.html', form=form)


@users_blueprint.route('/account')
def account():  # put application's code here
    return render_template('account.html')


@users_blueprint.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        return redirect(url_for('index'))

    return render_template('login.html', form=form)
