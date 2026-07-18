import sys
import json
import pandas as pd
import numpy as np
import joblib
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
import warnings

warnings.filterwarnings("ignore", category=UserWarning)

# Load the training data
def load_training_data(path):
    df = pd.read_csv(path)
    X = df.drop(columns=['Name', 'Profile URL', 'Website', 'Signal'])
    return X

# Build preprocessing transformer (for reference only, not used in predict)
def build_preprocessor(X):
    numeric_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
    categorical_cols = X.select_dtypes(include=['object', 'category']).columns.tolist()

    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='mean')),
        ('scaler', StandardScaler())
    ])

    categories = [
        X[col].dropna().unique().tolist() for col in categorical_cols
    ]
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
        ('onehot', OneHotEncoder(drop='first', categories=categories, handle_unknown='ignore'))
    ])

    preprocessor = ColumnTransformer(transformers=[
        ('num', numeric_transformer, numeric_cols),
        ('cat', categorical_transformer, categorical_cols)
    ], remainder='drop')

    return preprocessor, numeric_cols, categorical_cols

# Location-specific latitude/longitude lookup
def get_location_coords(location, X_train):
    location_coords = {
        'San Francisco': (37.7749, -122.4194),
        'Bangalore': (12.9716, 77.5946),
        'Delhi': (28.7041, 77.1025),
        'New York': (40.7128, -74.0060)
    }
    return location_coords.get(location, (X_train['latitude'].mean(), X_train['longitude'].mean()))

# Map input categories
def map_categories(input_data, X_train):
    category_map = {
        'Internet of Things': 'Internet of Things',
        'IoT': 'Internet of Things',
        'Environment': 'Clean Technology',
        'Health': 'Health Tech',
        'Education': 'K-12 Education'
    }
    input_data['Category'] = category_map.get(input_data.get('Category', 'Internet of Things'), 'Internet of Things')

    location_map = {
        'San Francisco, CA': 'San Francisco',
        'New York, NY': 'New York',
        'Austin, TX': 'Austin',
        'Bengaluru, Karnataka': 'Bangalore',
        'Bangalore, Karnataka': 'Bangalore',
        'New Delhi, India': 'Delhi'
    }
    input_data['Location'] = location_map.get(input_data.get('Location', 'San Francisco'), 'San Francisco')

    input_data['Stage'] = input_data.get('Stage', 'Series A')

    return input_data

# Impute missing columns and handle revenue growth
def impute_missing_columns(input_data, training_columns, numeric_cols, categorical_cols, X_train):
    field_mapping = {
        'Category': 'Market',
        'Funding Raised (INR)': 'Total Raised',
        'Team Size': 'Employees',
        'Location': 'Location',
        'Founding Year': 'Joining_Year',
        'Stage': 'Stage'
    }
    
    mapped_data = {}
    for input_key, value in input_data.items():
        mapped_key = field_mapping.get(input_key, input_key)
        mapped_data[mapped_key] = value

    # Add revenue growth feature
    revenue_growth = input_data.get('Revenue Growth Over Time (Revenue VS Expenses)', 0)
    mapped_data['Revenue_Growth_Scaled'] = np.log1p(max(0, revenue_growth)) if revenue_growth > 0 else -np.log1p(abs(revenue_growth))

    # Initialize input_df with all training columns
    input_df = pd.DataFrame(columns=training_columns)
    input_df.loc[0] = [np.nan] * len(training_columns)
    
    # Populate provided columns
    for key, value in mapped_data.items():
        if key in training_columns:
            input_df[key] = [value]

    # Impute missing numeric columns
    for col in numeric_cols:
        if col not in input_df.columns or pd.isna(input_df[col].iloc[0]):
            if col == 'latitude' or col == 'longitude':
                lat, lon = get_location_coords(mapped_data.get('Location', 'San Francisco'), X_train)
                input_df['latitude'] = lat
                input_df['longitude'] = lon
            elif col == 'Revenue_Growth_Scaled':
                input_df[col] = mapped_data.get('Revenue_Growth_Scaled', 0)
            else:
                input_df[col] = X_train[col].mean() if col in X_train.columns else 0

    # Impute missing categorical columns
    for col in categorical_cols:
        if col not in input_df.columns or pd.isna(input_df[col].iloc[0]):
            mode_value = X_train[col].mode().iloc[0] if not X_train[col].mode().empty else 'missing'
            input_df[col] = mode_value

    print("Columns in input_df:", input_df.columns.tolist())
    print("Columns expected by training:", training_columns)
    
    return input_df

# Global variables for model and data
model_path = 'xgb_model.joblib'
data_path = 'AngelList_Startups.csv'
print("Loading model and training data...")
global_model = joblib.load(model_path)
global_X_train = load_training_data(data_path)
global_training_columns = global_X_train.columns.tolist()
_, global_numeric_cols, global_categorical_cols = build_preprocessor(global_X_train)
print("Model and training data loaded successfully.")

# Main prediction function
def predict(input_data):
    try:
        X_train = global_X_train
        model = global_model
        training_columns = list(global_training_columns)
        numeric_cols = list(global_numeric_cols)
        categorical_cols = list(global_categorical_cols)
        
        print("Unique Markets:", X_train['Market'].unique().tolist())
        print("Unique Locations:", X_train['Location'].unique().tolist())
        print("Unique Stages:", X_train['Stage'].unique().tolist())
        
        input_data = map_categories(input_data, X_train)
        print("Mapped input data:", input_data)
        
        # Ensure Revenue_Growth_Scaled is in numeric_cols
        if 'Revenue_Growth_Scaled' not in numeric_cols:
            numeric_cols.append('Revenue_Growth_Scaled')
        if 'Revenue_Growth_Scaled' not in training_columns:
            training_columns.append('Revenue_Growth_Scaled')
        
        input_df = impute_missing_columns(input_data, training_columns, numeric_cols, categorical_cols, X_train)
        print("Input DataFrame:", input_df.to_dict())
        
        # Verify all training columns are present
        missing_cols = [col for col in training_columns if col not in input_df.columns]
        if missing_cols:
            raise ValueError(f"Missing columns in input_df: {missing_cols}")
        
        input_df = input_df[training_columns]
        
        # Use the model's pipeline to preprocess and predict
        print("Making prediction...")
        prediction = model.predict(input_df)[0]
        
        return {'prediction': float(prediction)*2}
    except Exception as e:
        return {'error': str(e)}

if __name__ == '__main__':
    if len(sys.argv) > 1:
        input_json = sys.argv[1]
        print(json.dumps(predict(json.loads(input_json))))