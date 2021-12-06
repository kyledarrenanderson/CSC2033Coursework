from flask import Blueprint, render_template, request, flash

# CONFIG
admin_blueprint = Blueprint('admin', __name__, template_folder='templates')


@admin_blueprint.route('/admin')
def admin():
    return render_template('admin.html')