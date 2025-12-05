import pandas as pd
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
import base64

def run_decision_tree_analysis():
    """
    Find best Decision Tree depth, plot error graph, and return best tree visualization.
    Returns base64-encoded error graph and best decision tree.
    """
    
    data = pd.read_csv('/dataset_sessions.csv')

    feature_cols = [
        'username', 'user_age', 'user_job', 'user_coins_total',
        'user_coins_spent_total', 'user_upgrades_levels', 'session_coins_spent',
        'game_name', 'game_coins_won', 'game_coins_lost',
        'question_id', 'user_answer', 'correct_answer'
    ]
    target_col = 'correct'

    X = data[feature_cols].copy()
    y = data[target_col].copy()

    for col in X.select_dtypes(include=['object']):
        le = LabelEncoder()
        X.loc[:, col] = le.fit_transform(X[col].astype(str))

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=0, stratify=y
    )

    train_errors = []
    test_errors = []
    depths = range(1, 10)

    for d in depths:
        dt = DecisionTreeClassifier(max_depth=d, random_state=0)
        dt.fit(X_train, y_train)
        
        train_acc = accuracy_score(y_train, dt.predict(X_train))
        test_acc = accuracy_score(y_test, dt.predict(X_test))
        
        train_errors.append(1 - train_acc)
        test_errors.append(1 - test_acc)

    # Plot error graph
    plt.figure(figsize=(10, 6))
    plt.plot(depths, train_errors, marker='o', label='Training Error')
    plt.plot(depths, test_errors, marker='s', label='Test Error')
    plt.xlabel('Tree Depth (max_depth)')
    plt.ylabel('Classification Error')
    plt.title('Error vs Tree Depth')
    plt.legend()
    plt.grid(True)
    
    buf_error = io.BytesIO()
    plt.savefig(buf_error, format='png', dpi=150, bbox_inches='tight')
    buf_error.seek(0)
    error_graph_base64 = base64.b64encode(buf_error.read()).decode('utf-8')
    plt.close()
    buf_error.close()

    best_depth = depths[test_errors.index(min(test_errors))]

    best_model = DecisionTreeClassifier(max_depth=best_depth, random_state=0)
    best_model.fit(X_train, y_train)

    plt.figure(figsize=(30, 15))
    plot_tree(
        best_model,
        feature_names=feature_cols,
        class_names=["Incorrect", "Correct"],
        filled=True,
        rounded=True,
        fontsize=8
    )
    plt.title(f"Best Decision Tree (max_depth={best_depth})", fontsize=16)
    
    buf_tree = io.BytesIO()
    plt.savefig(buf_tree, format='png', dpi=300, bbox_inches='tight')
    buf_tree.seek(0)
    tree_image_base64 = base64.b64encode(buf_tree.read()).decode('utf-8')
    plt.close()
    buf_tree.close()

    return {
        'error_graph_base64': error_graph_base64,
        'tree_image_base64': tree_image_base64,
    }
