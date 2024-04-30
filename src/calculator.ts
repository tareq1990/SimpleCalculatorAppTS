document.addEventListener('DOMContentLoaded', () => {
    // lets initialize all the components
    const display = document.getElementById('display') as HTMLInputElement;
    const errorMsgDiv = document.getElementById(
        'error-msg-div'
    ) as HTMLDivElement;
    const errorMsgSpan = document.getElementById(
        'error-msg'
    ) as HTMLSpanElement;
    const equalsButton = document.getElementById('equals') as HTMLButtonElement;
    const clearButton = document.getElementById('clear') as HTMLButtonElement;

    // Initialize the current expression
    let currentExpression: string = '';

    // constant variables
    const OPERATORS = ['+', '-', '*', '/'];
    const MIN_VALUE: number = -9999.99;
    const MAX_VALUE: number = 9999.99;

    // Function to update the display
    function updateDisplay(value: string): void {
        display.value = value;
    }

    // Function to validate operand range
    function isWithinOperandRange(operand: string): boolean {
        const num: number = parseFloat(operand);
        return !isNaN(num) && num >= MIN_VALUE && num <= MAX_VALUE;
    }

    // Function to display an error message
    function displayError(errorMsg: string): void {
        errorMsgDiv.style.display = 'block';
        errorMsgSpan.textContent = errorMsg;

        // Hide the error message after 5 seconds
        setTimeout(() => {
            errorMsgDiv.style.display = 'none';
            errorMsgSpan.textContent = '';
        }, 5000);
    }

    // Function to extract operands from the expression
    function extractOperands(expression: string): string[] {
        return expression.split(/[-+*/]/).filter(Boolean);
    }

    /**
     * Appends a given value to the current expression and validates it.
     * If the resulting expression is valid, it updates the display and current expression.
     * If the expression contains invalid operands, it displays an error message and disables the equals button.
     *
     * @param value - The character or string to append to the current expression.
     */
    function generateExpression(value: string): void {
        // Ensure currentExpression reflects the display's current value
        currentExpression = display.value;

        // Append the new value to build the updated expression
        const tempExpression = currentExpression + value;

        // Extract operands from the updated expression
        const operands = extractOperands(tempExpression);

        // Check if any of the operands are out of the acceptable range
        const isAnyOperandOutOfRange = operands.some(
            (operand) => !isWithinOperandRange(operand)
        );

        console.log(isAnyOperandOutOfRange);

        if (isAnyOperandOutOfRange) {
            // If an operand is out of range, show an error message and disable the equals button
            displayError('Operand out of range');
            disableEqualsButton(true);
        } else {
            // If all operands are within the valid range, update currentExpression and the display
            disableEqualsButton(false); // Ensure equals button is enabled
            currentExpression = tempExpression; // Update the current expression
            updateDisplay(currentExpression); // Update the display with the valid expression
        }
    }

    // Disable or enable the equals button
    function disableEqualsButton(disabled: boolean): void {
        equalsButton.disabled = disabled;
    }

    /**
     * Add event listeners to each calculator button, allowing interaction with the calculator's display.
     * This function handles operators and digits separately, ensuring that invalid operations are prevented,
     * such as consecutive operators or redundant decimal points.
     */
    document.querySelectorAll('.calculator .btn').forEach((button): void => {
        const value = button.getAttribute('data-value'); // Get the button's value
        console.log('value on button:', value);
        if (value) {
            // If the value is a decimal point, ensure the display starts with a zero if blank
            if (value === '.') {
                if (display.value === '') {
                    display.value = '0'; // Prepend zero if display is empty
                }
            }

            // Add a click event listener to the button
            button.addEventListener('click', () => {
                // Handle operators
                if (OPERATORS.includes(value)) {
                    const len = display.value.length; // Length of the current display value

                    if (len == 0 && (value == '*' || value == '/')) {
                        // If the display is empty and the new value is an operator[* or /], do not add the operator
                        return;
                    }

                    if (len > 1) {
                        const lastChar = display.value[len - 1]; // Last character in the display
                        const lastCharIsOperator = OPERATORS.includes(lastChar); // Check if it's an operator
                        const currCharIsOperator = OPERATORS.includes(value); // Is the new value an operator?

                        // If both the last character and the new value are operators, prevent adding
                        if (lastCharIsOperator && currCharIsOperator) {
                            return; // Do not add the operator
                        } else {
                            display.value += value; // Append the operator
                        }
                    } else {
                        display.value += value;
                    }

                    generateExpression(''); // Validate and update the expression
                } else {
                    // If it's a digit, update the expression directly
                    generateExpression(value);
                }
            });
        } else {
            display.value = '';
        }
    });

    /**
     * Event listener for the equals button, which triggers the evaluation of the current expression.
     * This function handles potential errors like division by zero and invalid expressions, displays results
     * with two decimal places, and updates the calculator's display and current expression.
     */
    equalsButton.addEventListener('click', function (): void {
        try {
            // Evaluate the current expression and assign the result
            let result = eval(currentExpression);

            // Handle division by zero
            if (result === Infinity || result === -Infinity) {
                throw new Error('Error: Divide by zero');
            }

            // Handle invalid expressions resulting in NaN
            if (isNaN(result)) {
                throw new Error('Invalid expression');
            }

            // Format the result to two decimal places
            result = result.toFixed(2);

            // Display the result in the calculator's display
            updateDisplay(result.toString());

            // Update the current expression to reflect the new result
            currentExpression = result.toString();
        } catch (error: any) {
            // Handle errors by displaying an appropriate message
            displayError(error.message);
        }
    });

    // Clear button event listener
    /**
     * Event listener for the "clear" button.
     * When clicked, this function resets the calculator's display, clears the current expression, and re-enables the equals button.
     */

    clearButton.addEventListener('click', function (): void {
        // Clear the calculator's display
        updateDisplay(''); // Sets the display's value to an empty string

        // Reset the current expression to start fresh
        currentExpression = '';

        // Re-enable the equals button to allow new calculations
        disableEqualsButton(false);
    });

    /**
     * Restrict input to valid characters and ensure the display does not contain invalid expressions or double operators.
     * This event listener sanitizes the input and removes invalid characters. Additionally, it checks for consecutive
     * operators and removes the last one if two operators are in succession.
     */
    display.addEventListener('input', function (event): void {
        const input = event.target as HTMLInputElement; // Get the input box
        const regex: RegExp = /^[0-9+\-*/.]*$/; // Allowed characters: digits, operators, and decimal points

        // Sanitize the input by removing any characters not allowed by the regex
        if (!regex.test(input.value)) {
            input.value = input.value.replace(/[^0-9+\-*/.]/g, ''); // Clean the invalid characters
        }

        // If the input has more than 2 characters and the last two are operators, remove the last one
        const len = input.value.length;
        if (len > 1) {
            const lastOneIsOperator = OPERATORS.includes(input.value[len - 1]); // Check if the last character is an operator
            const lastSecondIsOperator = OPERATORS.includes(
                input.value[len - 2]
            ); // Check if the second-to-last character is also an operator

            // If both are operators, remove the last one to avoid consecutive operators
            if (lastOneIsOperator && lastSecondIsOperator) {
                input.value = input.value.slice(0, -1); // Remove the last character
            }
        } else if (len == 1 && (input.value == '*' || input.value == '/')) {
            // If the input only has one character and it's an operator[* or /], dont add it
            input.value = '';
        }

        console.log('inputed:', input.value); // Debugging: log the sanitized input

        // Generate the expression with the sanitized and corrected input
        generateExpression('');
    });

    /**
     * Event listener for the "keydown" event, handling specific calculator key inputs.
     * This function processes key presses, handling "Enter" to trigger calculation and ensuring
     * appropriate handling of decimal points, such as prepending a zero if needed.
     */
    document.addEventListener('keydown', function (event: KeyboardEvent): void {
        // If "Enter" is pressed, trigger the equals button to perform the calculation
        if (event.key === 'Enter') {
            equalsButton?.click(); // Trigger calculation
            return; // Exit early, no further processing needed
        }

        // Handle the decimal point key
        if (event.key === '.') {
            event.preventDefault(); // Prevent the default behavior, prevent input and then manually add . by conditional logic
            // If the display is empty, prepend a zero to ensure a valid decimal format
            if (display.value === '') {
                display.value = '0.'; // Prepend zero before the decimal point
            } else {
                // If the display is not empty, just add the decimal point
                display.value += '.';
            }
        }
    });
});
