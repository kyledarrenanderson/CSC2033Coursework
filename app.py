from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def index():  # put application's code here
    return render_template('index.html')


@app.route('/account')
def account():  # put application's code here
    return render_template('account.html')


@app.route('/admin')
def admin():  # put application's code here
    return render_template('admin.html')


@app.route('/learningResources')
def learningResources():  # put application's code here
    return render_template('learningResources.html')


@app.route('/leaderboard')
def leaderboard():  # put application's code here
    return render_template('leaderboard.html')


@app.route('/aboutUs')
def aboutUs():  # put application's code here
    return render_template('aboutUs.html')


@app.route('/login')
def login():
    return render_template('login.html')


@app.route('/register')
def register():
    return render_template('register.html')


if __name__ == '__main__':
    app.run()
