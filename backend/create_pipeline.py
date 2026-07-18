from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, FunctionTransformer
from sklearn.linear_model import Ridge
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import numpy as np
import pandas as pd
import joblib

# Custom transformer to clip negative values
def clip_negative(x):
    return np.maximum(x, 0)

# Load the dataset
print("Loading startup_dataset.csv...")
try:
    df = pd.read_csv("startup_dataset.csv")
except Exception as e:
    print(f"Error loading CSV: {e}")
    raise

print("Dataset loaded successfully. Columns:", df.columns.tolist())
print("Number of rows:", len(df))

# Verify required columns
required_columns = ["Invest or Not Score", "Title", "Description", "Image URL", 
                    "Annual Revenue (INR)", "Funding Raised (INR)", "Team Size", 
                    "Startup Valuation (INR)", "Revenue Growth Over Time (Revenue VS Expenses)", 
                    "Revenue by Product/Service", "Category", "Location", "Funding Sources"]
missing_columns = [col for col in required_columns if col not in df.columns]
if missing_columns:
    raise ValueError(f"Missing required columns: {missing_columns}")

# Prepare features and target
X = df.drop(columns=["Invest or Not Score", "Title", "Description", "Image URL"])
y = df["Invest or Not Score"]

# Split the data
print("Splitting data into train and test sets...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"Training set size: {len(X_train)} rows")
print(f"Test set size: {len(X_test)} rows")

# Define the preprocessor
preprocessor = ColumnTransformer(
    transformers=[
        ("num", Pipeline([
            ("clip_negative", FunctionTransformer(clip_negative, validate=True)),
            ("log_transform", FunctionTransformer(np.log1p, validate=True)),
            ("scaler", StandardScaler())
        ]), ["Annual Revenue (INR)", "Funding Raised (INR)", "Team Size", "Startup Valuation (INR)", 
             "Revenue Growth Over Time (Revenue VS Expenses)", "Revenue by Product/Service"]),
        ("cat", OneHotEncoder(handle_unknown='ignore', sparse_output=False), ["Category", "Location", "Funding Sources"])
    ],
    remainder="drop"
)

# Create the pipeline
pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("regressor", Ridge(alpha=1.0))
])

# Train the pipeline
print("Training pipeline...")
try:
    pipeline.fit(X_train, y_train)
except Exception as e:
    print(f"Error training pipeline: {e}")
    raise

print("Pipeline trained successfully.")

# Save the pipeline
print("Saving pipeline to ridge_pipeline.pkl...")
try:
    joblib.dump(pipeline, "ridge_pipeline.pkl")
except Exception as e:
    print(f"Error saving pipeline: {e}")
    raise

print("Pipeline saved successfully.")

# Verify the saved file by loading it
print("Verifying saved pipeline...")
try:
    loaded_pipeline = joblib.load("ridge_pipeline.pkl")
    print("Pipeline loaded successfully for verification.")
except Exception as e:
    print(f"Error loading pipeline for verification: {e}")
    raise