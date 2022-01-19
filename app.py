import logging
import urllib
from functools import wraps
from flask import Flask, render_template, request
from flask_login import LoginManager, current_user
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
import databaseinfo


"""
 * @author Kyle Anderson
 * @version 1
 * @since 26-11-2021
"""


params = urllib.parse.quote_plus("DRIVER={ODBC Driver 17 for SQL "
                                 "Server};SERVER=csc2033-team42-fdmgroup.database.windows.net;DATABASE"
                                 "=csc2033_team42FDMGroup;UID=csc2033_team42;PWD=" + databaseinfo.password)
engine = create_engine("mssql+pyodbc:///?odbc_connect=%s" % params)
# CONFIG
app = Flask(__name__)
app.config['SECRET_KEY'] = 'toBeChangedLater'
app.config['SQLALCHEMY_DATABASE_URI'] = "mssql+pyodbc:///?odbc_connect=%s" % params
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


# REQUIRES ROLES LOGIC
def requires_roles(*roles):
    def wrapper(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            if current_user.role not in roles:
                # Logs access attempt into the log file
                logging.warning('SECURITY - Unauthorised access attempt [%s, %s, %s]',
                                current_user.username,
                                current_user.role,
                                request.remote_addr)
                # Redirect the user to an unauthorised notice!
                return render_template('403.html')
            return f(*args, **kwargs)

        return wrapped

    return wrapper


# LOGGING
class SecurityFilter(logging.Filter):
    def filter(self, record):
        return "SECURITY" in record.getMessage()


# Setup for the logging handler
fh = logging.FileHandler('FDMWebApp.log', 'w')
fh.setLevel(logging.WARNING)
fh.addFilter(SecurityFilter())
formatter = logging.Formatter('%(asctime)s : %(message)s', '%m/%d/%Y %I:%M:%S %p')
fh.setFormatter(formatter)

logger = logging.getLogger('')
logger.propagate = False
logger.addHandler(fh)


# HOMEPAGE
@app.route('/')
def index():
    return render_template('index.html')


# ABOUT US PAGE
@app.route('/aboutUs')
def aboutUs():
    return render_template('aboutUs.html')


# ERROR PAGES
@app.errorhandler(400)
def bad_request(error):
    return render_template('400.html'), 400


@app.errorhandler(403)
def page_forbidden(error):
    return render_template('403.html'), 403


@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404


@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500


@app.errorhandler(503)
def service_unavailable(error):
    return render_template('503.html'), 503


# BLUEPRINTS
from users.views import users_blueprint
from admin.views import admin_blueprint

app.register_blueprint(users_blueprint)
app.register_blueprint(admin_blueprint)

# LOGIN MANAGER
login_manager = LoginManager()
login_manager.login_view = 'users.login'
login_manager.init_app(app)

from models import User


@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))


if __name__ == '__main__':
    app.run()
