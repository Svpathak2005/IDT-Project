from flask import Flask, jsonify, render_template, request, session, redirect, url_for
from flask_cors import CORS
from src.blockchain.nft import get_nft
from keys import FLASK_SESSION_KEY

app = Flask(__name__)
app.secret_key = FLASK_SESSION_KEY
CORS(app)


def ERROR():
    return jsonify({'error': 'Unknown Error'}), 400


@app.route('/')
def index():
    if session.get('email'):
        return render_template('base.html', home="active")
    else:
        return redirect(url_for('login'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if (request.method == 'GET'):
        return render_template('login.html')

    else:
        email = request.form.get('email')
        password = request.form.get('password')
        session['email'] = email
        return redirect(url_for('index'))


@app.route('/sign-up')
def sign_up():
    return render_template('sign-up.html')


@app.route('/log')
def log():
    return render_template('log.html', log='active')


@app.route('/nft_gallery')
def nft_gallery():
    return render_template('nft_gallery.html', nft_gallery='active')


@app.route('/fetch_nfts/<string:address>', methods=['GET'])
def fetch_nfts(address: str):
    page_size = request.args.get('page_size')
    pageKey = request.args.get('pageKey')
    result = get_nft(address=address,
                     page_size=page_size, pageKey=pageKey)
    if (result):
        return jsonify(result)
    else:
        return ERROR()
