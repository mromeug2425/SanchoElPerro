class MathChallengeGame {
    constructor() {
        this.targetNumber = 0;
        this.correctNumbers = [];
        this.correctOperations = [];
        this.allNumbers = [];
        this.allOperations = [];
        this.decoyIndices = {
            numbers: [],
            operations: [],
        };
        this.maxAttempts = 50;
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    isInteger(value) {
        return Number.isInteger(value);
    }

    shuffleArray(array) {
        // Fisher-Yates shuffle
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    evaluateExpression(numbers, operations) {
        if (numbers.length !== operations.length + 1) {
            return null;
        }

        try {
            let expression = numbers[0].toString();
            for (let i = 0; i < operations.length; i++) {
                expression += operations[i] + numbers[i + 1];
            }

            const result = eval(expression);

            if (isFinite(result) && !isNaN(result)) {
                return result;
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    generateValidExpression() {
        let attempts = 0;

        while (attempts < this.maxAttempts) {
            attempts++;

            // Generate 4 numbers and 3 operations
            const numbers = [];
            for (let i = 0; i < 4; i++) {
                numbers.push(this.getRandomInt(1, 12));
            }

            const operations = [];
            const ops = ["+", "-", "*", "/"];
            for (let i = 0; i < 3; i++) {
                operations.push(ops[this.getRandomInt(0, ops.length - 1)]);
            }

            // Check for division by zero
            let hasDivisionByZero = false;
            for (let i = 0; i < operations.length; i++) {
                if (operations[i] === "/" && numbers[i + 1] === 0) {
                    hasDivisionByZero = true;
                    break;
                }
            }

            if (hasDivisionByZero) continue;

            // Evaluate the expression
            const result = this.evaluateExpression(numbers, operations);

            // Check if result is an integer and within bounds (-200 to 200)
            if (
                result !== null &&
                this.isInteger(result) &&
                result >= -200 &&
                result <= 200
            ) {
                return {
                    numbers: numbers,
                    operations: operations,
                    target: result,
                };
            }
        }

        // Fallback: use only addition and subtraction if max attempts reached
        console.log("Using fallback generation (no division/multiplication)");
        let fallbackAttempts = 0;

        while (fallbackAttempts < 20) {
            fallbackAttempts++;

            const numbers = [];
            for (let i = 0; i < 4; i++) {
                numbers.push(this.getRandomInt(1, 50));
            }

            const operations = [];
            const simpleOps = ["+", "-"];
            for (let i = 0; i < 3; i++) {
                operations.push(
                    simpleOps[this.getRandomInt(0, simpleOps.length - 1)]
                );
            }

            const result = this.evaluateExpression(numbers, operations);

            // Check if fallback result is also within bounds
            if (result !== null && result >= -200 && result <= 200) {
                return {
                    numbers: numbers,
                    operations: operations,
                    target: result,
                };
            }
        }

        // Ultimate fallback: simple addition
        const numbers = [10, 20, 30, 40];
        const operations = ["+", "+", "+"];
        const result = this.evaluateExpression(numbers, operations);

        return {
            numbers: numbers,
            operations: operations,
            target: result,
        };
    }

    generateDecoys(existingNumbers, existingOperations) {
        // Generate 2 decoy numbers
        const decoyNumbers = [];
        for (let i = 0; i < 2; i++) {
            decoyNumbers.push(this.getRandomInt(1, 12));
        }

        // Generate 1 decoy operation
        const ops = ["+", "-", "*", "/"];
        const decoyOperation = ops[this.getRandomInt(0, ops.length - 1)];

        return {
            numbers: decoyNumbers,
            operation: decoyOperation,
        };
    }

    generateChallenge() {
        // Step 1: Generate valid expression with integer result
        const expression = this.generateValidExpression();

        // Store the correct solution
        this.correctNumbers = [...expression.numbers];
        this.correctOperations = [...expression.operations];
        this.targetNumber = expression.target;

        // Step 2: Generate decoys
        const decoys = this.generateDecoys(
            expression.numbers,
            expression.operations
        );

        // Step 3: Combine and track indices before shuffling
        const numbersWithIndices = expression.numbers.map((num, idx) => ({
            value: num,
            originalIdx: idx,
            isDecoy: false,
        }));
        const decoyNumbersWithIndices = decoys.numbers.map((num, idx) => ({
            value: num,
            originalIdx: 4 + idx,
            isDecoy: true,
        }));
        const allNumbersWithIndices = [
            ...numbersWithIndices,
            ...decoyNumbersWithIndices,
        ];

        const operationsWithIndices = expression.operations.map((op, idx) => ({
            value: op,
            originalIdx: idx,
            isDecoy: false,
        }));
        const decoyOperationWithIndex = {
            value: decoys.operation,
            originalIdx: 3,
            isDecoy: true,
        };
        const allOperationsWithIndices = [
            ...operationsWithIndices,
            decoyOperationWithIndex,
        ];

        // Step 4: Shuffle
        const shuffledNumbers = this.shuffleArray(allNumbersWithIndices);
        const shuffledOperations = this.shuffleArray(allOperationsWithIndices);

        // Step 5: Extract values and decoy indices
        this.allNumbers = shuffledNumbers.map((item) => item.value);
        this.allOperations = shuffledOperations.map((item) => item.value);

        this.decoyIndices.numbers = shuffledNumbers
            .map((item, idx) => (item.isDecoy ? idx : -1))
            .filter((idx) => idx !== -1);

        this.decoyIndices.operations = shuffledOperations
            .map((item, idx) => (item.isDecoy ? idx : -1))
            .filter((idx) => idx !== -1);

        console.log("Challenge generated!");
        console.log("Target:", this.targetNumber);
        console.log(
            "Correct solution:",
            this.correctNumbers.join(" "),
            "with operations:",
            this.correctOperations.join(" ")
        );

        return {
            target: this.targetNumber,
            numbers: this.allNumbers,
            operations: this.allOperations,
            decoyIndices: this.decoyIndices,
        };
    }

    verifySolution(numbers, operations) {
        const result = this.evaluateExpression(numbers, operations);
        return result !== null && result === this.targetNumber;
    }
}

if (typeof window !== "undefined") {
    window.MathChallengeGame = MathChallengeGame;
}
