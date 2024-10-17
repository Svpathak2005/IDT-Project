from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from src.blockchain.nft import get_nft

app = Flask(__name__)
CORS(app)


def ERROR():
    return jsonify({'error': 'Unknown Error'}), 400


@app.route('/')
def index():
    return render_template('base.html')


@app.route('/log')
def log():
    return render_template('log.html')


@app.route('/nft_gallery')
def nft_gallery():
    return render_template('nft_gallery.html')


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
