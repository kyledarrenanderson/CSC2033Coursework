from flask import Blueprint, render_template
from flask_login import login_required
from models import User
from app import requires_roles

# CONFIG
admin_blueprint = Blueprint('admin', __name__, template_folder='templates')


# ROUTES
@admin_blueprint.route('/admin')
@login_required
@requires_roles('admin')
def admin():
    with open("FDMWebApp.log", "r") as f:
        content = f.read().splitlines()[-50:]
        content.reverse()

    return render_template('logPage.html', logs=content)
