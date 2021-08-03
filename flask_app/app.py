from flask import Flask, request, jsonify
from flask_cors import cross_origin
from main import api_admin, api_client
import sys

app = Flask(__name__)
# app.debug = True

@app.route('/admin')
@cross_origin()
def admin():
    username = request.args.get('username')
    start = request.args.get('start')
    try:
        api_admin(username, start)
        return "Success"
    except:
        print(sys.exc_info())
        return "error"

@app.route('/client')
@cross_origin()
def client():
    username = request.args.get('username')
    start = request.args.get('start')
    end = request.args.get('end')

    try:
        sentiments = api_client(username, start, end)
        return jsonify(sentiments)
    except:
        return "error"


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug = True)