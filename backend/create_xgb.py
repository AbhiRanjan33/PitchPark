import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.model_selection import train_test_split, GridSearchCV
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error
import joblib
from sklearn.metrics import r2_score,accuracy_score

# Load and preprocess data
def load_data(path):
    df = pd.read_csv(path)
    y = pd.to_numeric(df['Signal'], errors='coerce').fillna(df['Signal'].median())
    X = df.drop(columns=['Name', 'Profile URL', 'Website', 'Signal'])
    # Add Revenue_Growth_Scaled (placeholder, replace with actual data if available)
    X['Revenue_Growth_Scaled'] = np.log1p(X['Total Raised'].clip(lower=0))
    return X, y

# Build preprocessing transformer
def build_preprocessor(X):
    numeric_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist() + ['Revenue_Growth_Scaled']
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

    return preprocessor

# Main execution
if __name__ == '__main__':
    X, y = load_data('AngelList_Startups.csv')
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    xgb = XGBRegressor(objective='reg:squarederror', random_state=42)
    preprocessor = build_preprocessor(X_train)
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', xgb)
    ])

    param_grid = {
        'regressor__n_estimators': [100, 200, 300, 500],
        'regressor__learning_rate': [0.01, 0.05, 0.1, 0.3],
        'regressor__max_depth': [3, 5, 7, 10],
        'regressor__subsample': [0.7, 0.9, 1.0],
        'regressor__colsample_bytree': [0.7, 1.0]
    }
    grid = GridSearchCV(pipeline, param_grid, cv=5, scoring='neg_mean_squared_error', n_jobs=-1)
    grid.fit(X_train, y_train)

    mse = mean_squared_error(y_test, grid.predict(X_test))
    print(f'Best XGB params: {grid.best_params_}')
    print(f'MSE tuned XGB: {mse}')

    r2 = r2_score(y_test, grid.predict(X_test))
    print(f'R² score: {r2:.4f}')

    feature_importance = grid.best_estimator_.named_steps['regressor'].feature_importances_
    print(f'Feature importance: {feature_importance.tolist()}')

    model_filename = 'xgb_model.joblib'
    joblib.dump(grid.best_estimator_, model_filename)
    print(f'Model saved as {model_filename}')
    print(accuracy_score(y_test, grid.predict(X_test)))