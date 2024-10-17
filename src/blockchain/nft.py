import hashlib

import requests

from keys import ALCHEMY_API_KEY


def get_nft(address: str, page_size: int = 100, pageKey: str = '') -> dict:
    base_url = 'https://eth-mainnet.g.alchemy.com/nft/v3/'
    getOwner = '/getNFTsForOwner?owner='
    meta = '&withMetadata=true&pageSize='
    page_size = str(page_size)

    url = base_url + ALCHEMY_API_KEY + getOwner + address + meta + page_size
    if pageKey:
        url += '&pageKey=' + pageKey
    response = requests.get(url).json()

    content = {'total-nfts': response.get('totalCount'),
               'nfts': [], 'pageKey': response.get('pageKey')}
    response = response.get('ownedNfts')
    image_hash = {}
    if response:
        for i in range(len(response)):
            value = {'title': response[i]['name'],
                     'description': response[i]['description'], 'imageUrl': response[i]['image']['originalUrl']}
            if response[i]['image']['originalUrl']:
                current_hash = hashlib.sha256(
                    value['imageUrl'].encode()).hexdigest()
                if not image_hash.get(current_hash):
                    content['nfts'].append(value)
                    image_hash[current_hash] = True
        return content
    else:
        return False
