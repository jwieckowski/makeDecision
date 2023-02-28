import numpy as np
import json

import pandas as pd
from .validator import Validator

import io
from base64 import encodebytes
from PIL import Image

# should read files from json, csv, xlsx formats
class Files():
    def __init__(self):
        pass

    @staticmethod
    def get_response_image(image_path):
        pil_img = Image.open(image_path, mode='r') # reads the PIL image
        byte_arr = io.BytesIO()
        pil_img.save(byte_arr, format='PNG') # convert the PIL image to byte array
        encoded_img = encodebytes(byte_arr.getvalue()).decode('ascii') # encode as base64
        return encoded_img

    @staticmethod
    def convert_file_to_matrix(data, extension):
        # JSON file
        if 'matrix' in data:
            file = json.loads(data)
            matrix = np.array(file['matrix'])
            types = np.array(file['criteriaTypes'])

            matrix_error = Validator.validate_matrix(matrix, extension)
            if matrix_error is not None:
                return False, matrix_error, None

            types_error = Validator.validate_types(types)
            if types_error is not None:
                return False, types_error, None

            dimension_error = Validator.validate_dimensions(matrix, types)
            if dimension_error is not None:
                return False, dimension_error, None
            
            return True, matrix, types
        # XLSX file
        elif '[' in data:
            items = eval(data.split()[0])
            matrix = np.array(items[0:-2])
            types = np.array(items[-1])

            matrix_error = Validator.validate_matrix(matrix, extension)
            if matrix_error is not None:
                return False, matrix_error, None

            types_error = Validator.validate_types(types)
            if types_error is not None:
                return False, types_error, None

            dimension_error = Validator.validate_dimensions(matrix, types)
            if dimension_error is not None:
                return False, dimension_error, None
            
            return True, matrix, types
        # CSV file
        else:
            items = data.split('\r\n')
            matrix = np.array([[int(word.strip()) for word in items[i].split(',') if word != ''] for i in range(len(items)-2)])
            types = np.array([int(word.strip()) for word in items[len(items)-1].split(',') if word != ''])

            matrix_error = Validator.validate_matrix(matrix, extension)
            if matrix_error is not None:
                return False, matrix_error, None

            types_error = Validator.validate_types(types)
            if types_error is not None:
                return False, types_error, None

            dimension_error = Validator.validate_dimensions(matrix, types)
            if dimension_error is not None:
                return False, dimension_error, None
            
            return True, matrix, types

    # TODO change to read strictly from files but for different endpoint than for the GUI app
    @staticmethod
    def read_matrix_from_file(file, extension):
        """
        """

        # TODO add checking if all rows have the same length
        def read_from_csv(file):
            df = pd.read_csv(file)
            
            try:
                extension = df.iloc[-1].to_numpy()[0].lower()
            except:
                print('Last row in the .csv file should contain the extension name')
                return
            
            try:
                matrix = df.iloc[0:-2].to_numpy().astype(float)            
                if any([any(np.isnan(m)) for m in matrix]):
                    print('Matrix contains elements that are not a number')
                    return
            except:
                print('Matrix contains elements that are not a number')
                return 

            try:
                criteria_types = df.iloc[-2:-1].to_numpy().astype(float)[0]
                if any(np.isnan(criteria_types)):
                    print('Criteria types contains elements that are not a number')
                    return
            except:
                print('Criteria types contains elements that are not a number')
                return 

            matrix_error = Validator.validate_matrix(matrix, extension)
            if matrix_error is not None:
                print(matrix_error)
                return matrix_error

            types_error = Validator.validate_types(criteria_types),
            if types_error is not None:
                print(types_error)
                return types_error

            dimension_error = Validator.validate_dimensions(matrix, criteria_types)
            if dimension_error is not None:
                print(dimension_error)
                return dimension_error

        def read_from_xlsx(file):
            df = pd.read_excel(file)
            df = df.loc[:, ~df.columns.str.contains('^Unnamed')]

            try:
                extension = df.iloc[-1].to_numpy()[0].lower()
            except:
                print('Last row in the .csv file should contain the extension name')
                return
            
            try:
                matrix = df.iloc[0:-2].to_numpy().astype(float)            
                if any([any(np.isnan(m)) for m in matrix]):
                    print('Matrix contains elements that are not a number')
                    return
            except:
                print('Matrix contains elements that are not a number')
                return 

            try:
                criteria_types = df.iloc[-2:-1].to_numpy().astype(float)[0]
                if any(np.isnan(criteria_types)):
                    print('Criteria types contains elements that are not a number')
                    return
            except:
                print('Criteria types contains elements that are not a number')
                return 

            matrix_error = Validator.validate_matrix(matrix, extension)
            if matrix_error is not None:
                print(matrix_error)
                return matrix_error

            types_error = Validator.validate_types(criteria_types)
            if types_error is not None:
                print(types_error)
                return types_error

            dimension_error = Validator.validate_dimensions(matrix, criteria_types)
            if dimension_error is not None:
                print(dimension_error)
                return dimension_error

        def read_from_json(file):
            with open(file) as f:
                data = json.load(f)
            
            if not all(item in list(data.keys()) for item in ['matrix', 'criteriaTypes']):
                print('Not all required keys were in file')
                return 

            matrix = data['matrix']
            try:
                matrix = np.array(matrix)
            except:
                print('Error in matrix during converting data')
                return
            
            criteria_types = data['criteriaTypes']
            try:
                criteria_types = np.array(criteria_types)
            except:
                print('Error in criteria types during converting data')
                return

            matrix_error = Validator.validate_matrix(matrix, data['extension'])
            if matrix_error is not None:
                print(matrix_error)
                return matrix_error

            types_error = Validator.validate_types(criteria_types)
            if types_error is not None:
                print(types_error)
                return types_error

            dimension_error = Validator.validate_dimensions(matrix, criteria_types)
            if dimension_error is not None:
                print(dimension_error)
                return dimension_error



        if extension == 'csv':
            read_from_csv(file)
        
        elif extension == 'xlsx':
            read_from_xlsx(file)

        elif extension == 'json':
            read_from_json(file)
        
