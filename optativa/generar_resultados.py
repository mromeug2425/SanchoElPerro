# generate_game_data_sessions.py
import random
import json
import datetime

NUM_LINES = 1000
000
OUTPUT_PATH = "dataset_sessions.jsonl"

first_names = [
    "Ava", "Liam", "Noah", "Emma", "Olivia",
    "Ethan", "Mia", "Lucas", "Sophia", "Mason",
    "Harper", "Logan", "Isabella", "James", "Amelia",
    "Benjamin", "Charlotte", "Elijah", "Evelyn", "Henry",
    "Abigail", "Alexander", "Ella", "Michael", "Avery",
    "Daniel", "Scarlett", "Matthew", "Grace", "Jackson",
    "Chloe", "Sebastian", "Nora", "Jack", "Luna",
    "William", "Zoe", "Owen", "Riley", "Gabriel",
    "Hannah", "Caleb", "Layla", "Isaac", "Penelope",
    "Samuel", "Aubrey", "Carter", "Stella", "Wyatt"
]

surnames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones",
    "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
    "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris",
    "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright",
    "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall",
    "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"
]

# Games in order with fixed question counts
game_order = ["Juego 1", "Juego 2", "Juego 3", "Juego 4"]
questions_per_game = {"Juego 1": 10, "Juego 2": 15, "Juego 3": 5, "Juego 4": 4}

random.seed(42)

def seconds_to_hhmmss(s):
    return str(datetime.timedelta(seconds=int(s)))

def pick_username():
    return random.choice(first_names) + random.choice(surnames)

def make_user():
    username = pick_username()
    age = random.randint(10,14)
    job = None
    coins_total = random.randint(0, 5000)
    coins_spent_total = random.randint(0, min(3000, coins_total))
    n_upgrades = random.randint(0, 4)
    upgrades_levels = [random.randint(1,3) for _ in range(n_upgrades)]
    base_skill = 0.3 + 0.15*(age-10) + random.uniform(0,0.2)
    return {
        "username": username,
        "user_age": age,
        "user_job": job,
        "user_coins_total": coins_total,
        "user_coins_spent_total": coins_spent_total,
        "user_upgrades_levels": upgrades_levels,
        "_skill": min(base_skill, 0.98)
    }

rows_written = 0
users = [make_user() for _ in range(300)]
records = []
question_global_counter = 0

# Weighted probability for number of sessions per user
session_choices = [1,2,3,4,5]
session_weights = [0.4,0.3,0.15,0.1,0.05]

while rows_written < NUM_LINES:
    user = random.choice(users)
    num_sessions = random.choices(session_choices, weights=session_weights, k=1)[0]

    for _ in range(num_sessions):
        if rows_written >= NUM_LINES:
            break

        session_duration_seconds = 0
        age_modifier = max(0.5, 1.5 - (user["user_age"]-10)*0.15)
        session_coins_spent = 0
        session_start_time = datetime.datetime.utcnow() - datetime.timedelta(days=random.randint(0,90), hours=random.randint(0,23), minutes=random.randint(0,59))
        session_start_str = session_start_time.strftime("%Y-%m-%d %H:%M:%S")

        # Start with only Juego 1 unlocked
        unlocked_games = {"Juego 1"}
        max_unlock_index = 0
        games_in_session = random.randint(1, 5)  # number of games played this session

        for _ in range(games_in_session):
            if rows_written >= NUM_LINES:
                break

            # Weighted choice: favor higher unlocked games slightly
            available_games = list(unlocked_games)
            weights = []
            for g in available_games:
                idx = game_order.index(g)
                weights.append(1 + 0.3*idx)
            game_name = random.choices(available_games, weights=weights, k=1)[0]

            q_count = questions_per_game[game_name]
            skill = user["_skill"] + random.uniform(-0.05, 0.05)
            skill = max(0.1, min(0.98, skill))
            correct_count = 0
            game_duration_seconds = random.randint(20, 5*60)
            questions = []

            for _ in range(q_count):
                if rows_written >= NUM_LINES:
                    break
                question_global_counter += 1
                question_id = f"Q{question_global_counter}"
                correct_answer = random.randint(1,4)

                if random.random() < skill:
                    user_answer = correct_answer
                    correct = True
                else:
                    wrong_choices = [o for o in [1,2,3,4] if o != correct_answer]
                    user_answer = random.choice(wrong_choices)
                    correct = False

                if correct:
                    correct_count += 1

                record = {
                    "username": user["username"],
                    "user_age": user["user_age"],
                    "user_job": user["user_job"],
                    "user_coins_total": user["user_coins_total"],
                    "user_coins_spent_total": user["user_coins_spent_total"],
                    "user_upgrades_levels": user["user_upgrades_levels"],
                    "session_start": session_start_str,
                    "session_duration": None,
                    "session_coins_spent": None,
                    "game_name": game_name,
                    "game_duration": None,
                    "game_coins_won": None,
                    "game_coins_lost": None,
                    "game_won": None,
                    "question_id": question_id,
                    "user_answer": user_answer,
                    "correct_answer": correct_answer,
                    "correct": correct
                }
                questions.append(record)
                rows_written += 1

            # Game-level calculations
            win_threshold = 0.6 + random.uniform(-0.05, 0.05)
            game_won = (correct_count / q_count) >= win_threshold
            reward_per_correct = random.randint(5, 20)
            penalty_per_wrong = random.randint(0, 5)
            bonus_if_win = random.randint(10, 50) if game_won else 0
            game_coins_won = correct_count * reward_per_correct + bonus_if_win
            game_coins_lost = (q_count - correct_count) * penalty_per_wrong
            game_entry_fee = int(random.choice([0,0,0,5,10]) * age_modifier)
            session_coins_spent += game_entry_fee
            session_duration_seconds += game_duration_seconds
            game_duration_str = str(datetime.timedelta(seconds=game_duration_seconds))

            for rec in questions:
                rec["session_duration"] = str(datetime.timedelta(seconds=session_duration_seconds))
                rec["session_coins_spent"] = session_coins_spent
                rec["game_duration"] = game_duration_str
                rec["game_coins_won"] = game_coins_won
                rec["game_coins_lost"] = game_coins_lost
                rec["game_won"] = game_won
                records.append(rec)

            # Unlock the next game if this one was won
            if game_won:
                current_idx = game_order.index(game_name)
                if current_idx + 1 < len(game_order):
                    unlocked_games.add(game_order[current_idx + 1])

records = records[:NUM_LINES]

with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    for rec in records:
        f.write(json.dumps(rec, ensure_ascii=False) + "\n")

print(f"Generated {len(records)} lines -> {OUTPUT_PATH}")
