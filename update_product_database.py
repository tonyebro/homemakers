import csv
import time
import os
import sys
from decimal import *
import requests

def find_image(path, filename):
    for root, dirs, files in os.walk(path):
        if filename in files:
            return os.path.join(root, filename)
    return ''

def load_csv_file(filename):
    with open(filename, 'rb') as csvfile:
        csvreader = csv.DictReader(csvfile, delimiter=',')
        getcontext().prec = 2
        for row in csvreader:
            image_name = hex(int(time.time() + hash(row['Supplier ID'])))[2:]
            old_image = find_image('Homemakers_Pics', row['Supplier ID']+'.JPG')
            if (old_image != ''):
                print('cp {} media/products/{}.jpg'.format(old_image, image_name))
                os.system('cp {} media/products/{}.jpg'.format(old_image, image_name))
            product = { 'name' : 'Placeholder', 'description' : row['Description'], 
            'category': row['Category'].lower(), 'price' : 0.00, 'cost' : float(row['Unit Price']), 'supplier_product_id' : row['Supplier ID'],
                'quantity' : row['Units'], 'image' : 'products/{}.jpg'.format(image_name), 'supplierId' : 1
            }
            print product
            r = requests.post('http://18.208.126.214:8080/api/Products', data=product)
            print r.status_code
    

if __name__ == "__main__":
    load_csv_file(sys.argv[1])