/**
 * Juego 4 - Math Challenge Game
 * Goal: Use given numbers and operations to reach the target number
 */

class MathChallengeGame {
    constructor() {
        this.targetNumber = 0;
        this.availableNumbers = [];
        this.availableOperations = ["+", "-", "*", "/"];
        this.solution = null;
        this.maxAttempts = 100; // Max attempts to find a valid problem
    }

    /**
     * Generate a random integer between min and max (inclusive)
     */
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Generate random numbers for the challenge
     */
    generateNumbers(count = 4, min = 1, max = 20) {
        const numbers = [];
        for (let i = 0; i < count; i++) {
            numbers.push(this.getRandomInt(min, max));
        }
        return numbers;
    }

    /**
     * Generate random operations
     */
    generateOperations(count = 3) {
        const operations = [];
        const ops = ["+", "-", "*", "/"];
        for (let i = 0; i < count; i++) {
            operations.push(ops[this.getRandomInt(0, ops.length - 1)]);
        }
        return operations;
    }

    /**
     * Evaluate a mathematical expression
     */
    evaluateExpression(numbers, operations) {
        if (numbers.length !== operations.length + 1) {
            return null;
        }

        try {
            // Build expression string
            let expression = numbers[0].toString();
            for (let i = 0; i < operations.length; i++) {
                expression += operations[i] + numbers[i + 1];
            }

            // Evaluate using eval (safe in this controlled environment)
            const result = eval(expression);

            // Return only if result is a valid number and not too large
            if (isFinite(result) && !isNaN(result)) {
                return Math.round(result * 100) / 100; // Round to 2 decimals
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    /**
     * Generate all permutations of an array
     */
    permute(arr) {
        if (arr.length <= 1) return [arr];

        const result = [];
        for (let i = 0; i < arr.length; i++) {
            const current = arr[i];
            const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
            const perms = this.permute(remaining);

            for (const perm of perms) {
                result.push([current, ...perm]);
            }
        }
        return result;
    }

    /**
     * Find a solution using given numbers and operations to reach target
     */
    findSolution(target, numbers, operations) {
        // Try all permutations of numbers
        const numberPerms = this.permute(numbers);

        // Try all permutations of operations
        const opPerms = this.permute(operations);

        // Try each combination
        for (const numPerm of numberPerms) {
            for (const opPerm of opPerms) {
                const result = this.evaluateExpression(numPerm, opPerm);

                if (result !== null && Math.abs(result - target) < 0.01) {
                    // Found a solution!
                    return {
                        numbers: numPerm,
                        operations: opPerm,
                        expression: this.buildExpressionString(numPerm, opPerm),
                        result: result,
                    };
                }
            }
        }

        return null; // No solution found
    }

    /**
     * Build a readable expression string
     */
    buildExpressionString(numbers, operations) {
        let expr = numbers[0].toString();
        for (let i = 0; i < operations.length; i++) {
            expr += " " + operations[i] + " " + numbers[i + 1];
        }
        return expr;
    }

    /**
     * Generate a new challenge with a guaranteed solution
     */
    generateChallenge() {
        let attempts = 0;

        while (attempts < this.maxAttempts) {
            attempts++;

            // Generate random numbers and operations
            const numbers = this.generateNumbers(4, 1, 20);
            const operations = this.generateOperations(3);

            // Calculate what result we get with these
            const result = this.evaluateExpression(numbers, operations);

            // If valid result, use it as target and try to find solution
            if (result !== null && result > 0 && result < 1000) {
                const target = Math.round(result);
                const solution = this.findSolution(target, numbers, operations);

                if (solution) {
                    // Found a valid challenge!
                    this.targetNumber = target;
                    this.availableNumbers = numbers;
                    this.availableOperations = operations;
                    this.solution = solution;

                    return {
                        target: this.targetNumber,
                        numbers: this.availableNumbers,
                        operations: this.availableOperations,
                        solution: this.solution, // For debugging/hints
                    };
                }
            }
        }

        // Fallback: generate a simple challenge
        return this.generateSimpleChallenge();
    }

    /**
     * Generate a simple guaranteed challenge (fallback)
     */
    generateSimpleChallenge() {
        const num1 = this.getRandomInt(1, 10);
        const num2 = this.getRandomInt(1, 10);
        const num3 = this.getRandomInt(1, 10);
        const num4 = this.getRandomInt(1, 10);

        const operations = ["+", "-", "*"];

        // Calculate target: num1 * num2 + num3 - num4
        const target = num1 * num2 + num3 - num4;

        this.targetNumber = target;
        this.availableNumbers = [num1, num2, num3, num4];
        this.availableOperations = operations;

        const solution = this.findSolution(
            target,
            this.availableNumbers,
            operations
        );
        this.solution = solution;

        return {
            target: this.targetNumber,
            numbers: this.availableNumbers,
            operations: this.availableOperations,
            solution: this.solution,
        };
    }

    /**
     * Verify if a player's solution is correct
     */
    verifySolution(numbers, operations) {
        const result = this.evaluateExpression(numbers, operations);
        return result !== null && Math.abs(result - this.targetNumber) < 0.01;
    }
}

// Export for use in browser
if (typeof window !== "undefined") {
    window.MathChallengeGame = MathChallengeGame;
}

// Example usage:
/*
const game = new MathChallengeGame();
const challenge = game.generateChallenge();

console.log('Target:', challenge.target);
console.log('Numbers:', challenge.numbers);
console.log('Operations:', challenge.operations);
console.log('Solution:', challenge.solution.expression, '=', challenge.solution.result);
*/
