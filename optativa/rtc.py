import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import confusion_matrix, accuracy_score
import matplotlib.pyplot as plt

# Load CSV
data = pd.read_csv('dataset_sessions.csv')

# Define features and target
feature_cols = [
    'username', 'user_age', 'user_job', 'user_coins_total',
    'user_coins_spent_total', 'user_upgrades_levels', 'session_coins_spent',
    'game_name', 'game_coins_won', 'game_coins_lost',
    'question_id', 'user_answer', 'correct_answer'
]
target_col = 'correct'

X = data[feature_cols]
y = data[target_col]

# Encode categorical features
for col in X.select_dtypes(include=['object']):
    le = LabelEncoder()
    X.loc[:, col] = le.fit_transform(X[col].astype(str))

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=0, stratify=y
)

# ============================
#  RANDOM FOREST
# ============================
rf_model = RandomForestClassifier(
    n_estimators=100,
    max_depth=5,
    random_state=0,
    n_jobs=-1
)
rf_model.fit(X_train, y_train)

# Predictions
y_pred_rf = rf_model.predict(X_test)

# Metrics
acc_rf = accuracy_score(y_test, y_pred_rf)
cm_rf = confusion_matrix(y_test, y_pred_rf)

print("\n==== RANDOM FOREST ====")
print(f"Accuracy: {acc_rf:.4f}")
print("Confusion Matrix:")
print(cm_rf)

# ============================
#  DECISION TREE
# ============================
dt_model = DecisionTreeClassifier(
    max_depth=5,
    random_state=0
)
dt_model.fit(X_train, y_train)

# Predictions
y_pred_dt = dt_model.predict(X_test)

# Metrics
acc_dt = accuracy_score(y_test, y_pred_dt)
cm_dt = confusion_matrix(y_test, y_pred_dt)

print("\n==== DECISION TREE ====")
print(f"Accuracy: {acc_dt:.4f}")
print("Confusion Matrix:")
print(cm_dt)

# ============================
#  PLOT DECISION TREE
# ============================

plt.figure(figsize=(30, 15))
plot_tree(
    dt_model,
    feature_names=feature_cols,
    class_names=["Incorrect", "Correct"],
    filled=True,
    rounded=True,
    fontsize=8
)
plt.title("Decision Tree Visualization (max_depth=5)")
plt.savefig("decision_tree.png", dpi=300, bbox_inches="tight")
plt.show()

print("\nDecision tree saved as: decision_tree.png")
