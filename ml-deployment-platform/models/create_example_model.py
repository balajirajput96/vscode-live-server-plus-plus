"""
Example Model Creation Script
Create sample ML models for testing the deployment platform
"""

import numpy as np
import joblib
from sklearn.datasets import load_iris, load_wine, load_breast_cancer
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

print("🤖 Creating Example ML Models...\n")

# Model 1: Iris Classification
print("1. Creating Iris Classification Model...")
X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

iris_model = RandomForestClassifier(n_estimators=100, random_state=42)
iris_model.fit(X_train, y_train)

iris_accuracy = accuracy_score(y_test, iris_model.predict(X_test))
print(f"   ✅ Accuracy: {iris_accuracy:.2%}")

joblib.dump(iris_model, 'iris_classifier.pkl')
print("   💾 Saved as: iris_classifier.pkl")
print("   📊 Features: 4 (sepal length, sepal width, petal length, petal width)")
print("   🎯 Classes: 3 (setosa, versicolor, virginica)\n")

# Model 2: Wine Classification
print("2. Creating Wine Classification Model...")
X, y = load_wine(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

wine_model = RandomForestClassifier(n_estimators=100, random_state=42)
wine_model.fit(X_train, y_train)

wine_accuracy = accuracy_score(y_test, wine_model.predict(X_test))
print(f"   ✅ Accuracy: {wine_accuracy:.2%}")

joblib.dump(wine_model, 'wine_classifier.pkl')
print("   💾 Saved as: wine_classifier.pkl")
print("   📊 Features: 13 (alcohol, malic acid, ash, etc.)")
print("   🎯 Classes: 3 (class 0, 1, 2)\n")

# Model 3: Breast Cancer Classification
print("3. Creating Breast Cancer Classification Model...")
X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

cancer_model = LogisticRegression(max_iter=10000, random_state=42)
cancer_model.fit(X_train, y_train)

cancer_accuracy = accuracy_score(y_test, cancer_model.predict(X_test))
print(f"   ✅ Accuracy: {cancer_accuracy:.2%}")

joblib.dump(cancer_model, 'cancer_classifier.pkl')
print("   💾 Saved as: cancer_classifier.pkl")
print("   📊 Features: 30 (mean radius, mean texture, etc.)")
print("   🎯 Classes: 2 (malignant, benign)\n")

print("="*60)
print("🎉 All models created successfully!")
print("="*60)
print("\n📝 Test Predictions:\n")

# Test predictions
print("Iris Model Test:")
test_features_iris = np.array([[5.1, 3.5, 1.4, 0.2]])
prediction = iris_model.predict(test_features_iris)
probabilities = iris_model.predict_proba(test_features_iris)
print(f"   Input: {test_features_iris[0]}")
print(f"   Prediction: {prediction[0]}")
print(f"   Probabilities: {probabilities[0]}")
print(f"   Confidence: {np.max(probabilities[0]):.2%}\n")

print("Wine Model Test:")
test_features_wine = X_test[0].reshape(1, -1)
prediction = wine_model.predict(test_features_wine)
probabilities = wine_model.predict_proba(test_features_wine)
print(f"   Input: {test_features_wine[0][:5]}... (showing first 5 features)")
print(f"   Prediction: {prediction[0]}")
print(f"   Probabilities: {probabilities[0]}")
print(f"   Confidence: {np.max(probabilities[0]):.2%}\n")

print("Cancer Model Test:")
test_features_cancer = X_test[0].reshape(1, -1)
prediction = cancer_model.predict(test_features_cancer)
probabilities = cancer_model.predict_proba(test_features_cancer)
print(f"   Input: {test_features_cancer[0][:5]}... (showing first 5 features)")
print(f"   Prediction: {prediction[0]} ({'Malignant' if prediction[0] == 0 else 'Benign'})")
print(f"   Probabilities: {probabilities[0]}")
print(f"   Confidence: {np.max(probabilities[0]):.2%}\n")

print("="*60)
print("✨ Ready to Deploy!")
print("="*60)
print("\nNext Steps:")
print("1. Start the API server: cd backend && uvicorn main:app --reload")
print("2. Open the dashboard: frontend/index.html")
print("3. Upload one of these models:")
print("   - iris_classifier.pkl")
print("   - wine_classifier.pkl")
print("   - cancer_classifier.pkl")
print("\n🚀 Happy Deploying!")
