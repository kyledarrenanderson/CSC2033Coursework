from flask import Flask, render_template

import databaseinfo
import sql_handler
from flask_sqlalchemy import SQLAlchemy
import urllib

connection_string = (
    'DRIVER={ODBC Driver 17 for SQL Server};'
    'SERVER=csc2033-team42-fdmgroup.database.windows.net;'
    'PORT=1433;'
    'DATABASE=csc2033_team42FDMGroup;'
    'USERNAME=csc2033_team42;'
    'PWD='+databaseinfo.password+';'
    'charset=utf8mb4;'
)
params = urllib.parse.quote_plus(connection_string)

# CONFIG
app = Flask(__name__)
app.config['SECRET_KEY'] = 'toBeChangedLater'
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pyodbc:///?odbc_connect=%s" % params
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

@app.route('/')
def index():  # put application's code here
    return render_template('index.html')


@app.route('/learningResources')
def learningResources():  # put application's code here
    return render_template('learningResources.html')


@app.route('/leaderboard')
def leaderboard():  # put application's code here
    return render_template('leaderboard.html')


@app.route('/aboutUs')
def aboutUs():  # put application's code here
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

if __name__ == '__main__':
    app.run()
