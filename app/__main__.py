import os
import pandas as pd 
from flask import Flask, jsonify
from flask_restful import Resource, Api


def get_data_file_path(relative_path):
    d = os.getcwd()
    relative_path = r'app/data/' + relative_path
    file_path = os.path.join(d, relative_path)

    return file_path

def read_dataframe(file_path):
    words_df = pd.read_csv(file_path, sep=" ",  header=None, names=[
                              "word"])
    words_df["Indexes"] = words_df["word"].str.find('m', 0)
    # result2_def =  words_df["word"].str.find('e', 4)

def readfile(address): 
    lines = [] 

    if not os.path.exists(address):
        return []
    with open(address ,encoding="utf8") as f:
        lines = f.read().splitlines()
    f.close()
    return lines

def filter_character_indexes(data_file_path, chars):
    words = readfile(data_file_path)
    temp_results = []
    results = []

    for word in words:
      if len(word) == len(chars):
        flag = False
        for index, character in enumerate(word.lower()):
            if chars[index] == "*":
              continue
            if word[index] != chars[index]:
              flag = False
              break
            else:
              flag = True
        if flag:
            results.append(word)
    
    return results

def take_inputs():
  number_of_words = int(input("Number of characters in your word: "))
  n = 0
  chars = []

  while n < number_of_words:
    chars.append(input("Input char, if unknown press *: "))
    n = n+1
  
  # print("Chars: ", chars)

  data_file_path = get_data_file_path(r'words.txt')
  # read_dataframe(file_path)
  filter_character_indexes(data_file_path, chars)

app = Flask(__name__)
api = Api(app)

@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

class Welcome(Resource):
    def get(self):
        headers = {'Content-Type': 'text/html', 'Etag': 'some-opaque-string'}
        return make_response(render_template('home.html'), 201, headers)

api.add_resource(Welcome, '/', '/hello')
