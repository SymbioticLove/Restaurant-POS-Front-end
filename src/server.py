from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # Allow CORS for all routes

@app.route('/users', methods=['GET', 'POST'])
def handle_users():
    if request.method == 'GET':
        with open('./data/users.json', 'r') as file:
            users = json.load(file)
        return jsonify(users)
    elif request.method == 'POST':
        new_user = request.json
        with open('./data/users.json', 'r') as file:
            users = json.load(file)
            users.append(new_user)
        with open('./data/users.json', 'w') as file:
            json.dump(users, file, indent=4)
        return jsonify(new_user), 201

if __name__ == '__main__':
    app.run()
