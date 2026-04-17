from flask import Flask, request, jsonify, render_template  ,session
import json

app = Flask(__name__  , template_folder='account',  static_folder='account')
app.secret_key = 'JingleBells'
# @app.route('/')
# def home():
#     return render_template("login.html")

@app.route('/')
def index():
    # This is the fucking landing page...
    return render_template("index.html")








@app.route('/login-page')
def login_page():
    # Click the log in bi=utton to go to this page
    return render_template("/login/login.html")

@app.route('/login' , methods=['POST'])
def login():
    data = request.json 

    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"status": "invalid data"}), 400
    
    try:
        with open('data.json', 'r') as f:
            db = json.load(f)
    except FileNotFoundError:
        db = {}

    if data['username'] not in db:
        return jsonify({"status" : "no user"})
    
    if db[data['username']]['password'] == data['password']:
        session['username'] = data['username']
        return jsonify({"status": "success"})
    else:
        return jsonify({"status": "wrong password"})







@app.route('/signup-page')
def signup_page():
    #clcik the sign up button to got to this page
    return render_template("/signup/signup.html")

@app.route('/signup', methods=['POST'])
def signup():
    #sign up page data sending POST request to store data in data.json
    data = request.json
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"status": "invalid data"}), 400

    try:
        with open('data.json', 'r') as f:
            db = json.load(f)
    except FileNotFoundError:
        db = {}

    if data['username'] in db:
        return jsonify({"status": "user exists"})
    
    db[data['username']] = {}
    db[data['username']]['password'] = data['password']
    db[data['username']]['parameters'] = {}
    db[data['username']]['parameters']['streak'] = 0
    db[data['username']]['personals'] = {}
    db[data['username']]['parameters']['dailyTotal'] = {}

    with open('data.json', 'w') as f:
        json.dump(db, f)

    return jsonify({"status": "success"})








@app.route('/home/home.html')
def home_page():
    #This is the home page and redirection from login page
    return render_template("/home/home.html")




@app.route('/progress/progress.html')
def progress_page():
    return render_template("/progress/progress.html")


@app.route('/workoutPlan/workoutPlan.html')
def workoutPlan_page():
    return render_template("/workoutPlan/workoutPlan.html")

@app.route('/send-user-data')
def send_user_data():
    try:
        with open('data.json', 'r') as f:
            data = json.load(f) 
            return jsonify(data[session['username']])
    except FileNotFoundError:
        return jsonify({"status": "error", "message": "File not found"}), 404



@app.route('/store-data' , methods=['POST'])
def store_data():
    data = request.json
    if not data :
        return jsonify({"status": "invalid data"}), 400

    try:
        with open('data.json', 'r') as f:
            db = json.load(f)
    except FileNotFoundError:
        db = {}


    if session['username'] not in db:
        return jsonify({"status": "user does not exists"})


    db[session['username']]['parameters'] = data

    with open('data.json', 'w') as f:
        json.dump(db, f)

    return jsonify({"status": "success"})    



@app.route('/profile/profile.html')
def profile_page():
    return render_template("/profile/profile.html")

@app.route('/store-user-profile-parameters' , methods=["POST"])
def store_user_profile_parameters():
    data = request.json
    if not data :
        return jsonify({"status": "invalid data"}), 400

    try:
        with open('data.json', 'r') as f:
            db = json.load(f)
    except FileNotFoundError:
        db = {}


    if session['username'] not in db:
        return jsonify({"status": "user does not exists"})


    db[session['username']]['personals'] = {}
    for i in data:
        db[session['username']]['personals'][i] = data[i]
    with open('data.json', 'w') as f:
        json.dump(db, f)

    return jsonify({"status": "success"})



@app.route('/trial-ai' , methods=['POST'])
def trial_ai():
    data = request.json
    print(data)
    if not data :
        return jsonify({"status": "invalid data"}), 400

    try:
        with open('data.json', 'r') as f:
            db = json.load(f)
    except FileNotFoundError:
        db = {}


    if session['username'] not in db:
        return jsonify({"status": "user does not exists"})


    db[session['username']]['parameters']['todayTasks'] = data['todayTasks']

    with open('data.json', 'w') as f:
        json.dump(db, f)

    return jsonify({"status": "success"})


if __name__ == '__main__':
    app.run(debug=True)