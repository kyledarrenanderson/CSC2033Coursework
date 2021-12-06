from flask import Blueprint, render_template, request, redirect, url_for
from users.forms import RegisterForm, LoginForm

users_blueprint = Blueprint('users', __name__, template_folder='templates')


@users_blueprint.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()

    if form.validate_on_submit():

        return login()
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
