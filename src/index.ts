document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display') as HTMLInputElement;
    const errorMsgDiv = document.getElementById(
        'error-msg-div'
    ) as HTMLDivElement;
    const errorMsgSpan = document.getElementById(
        'error-msg'
    ) as HTMLSpanElement;
    const equalsButton = document.getElementById('equals') as HTMLButtonElement;
    let currentExpression: string = '';

    const MIN_VALUE: number = -9999.99;
    const MAX_VALUE: number = 9999.99;

    // Function to update the display
    const updateDisplay = (value: string) => {
        display.value = value;
    };

    // Function to validate operand range
    const isWithinOperandRange = (operand: string) => {
        const num: number = parseFloat(operand);
        return !isNaN(num) && num >= MIN_VALUE && num <= MAX_VALUE;
    };

    // Function to display an error message
    const displayError = (errorMsg: string) => {
        errorMsgDiv.style.display = 'block';
        errorMsgSpan.textContent = errorMsg;
        setTimeout(() => {
            errorMsgDiv.style.display = 'none';
            errorMsgSpan.textContent = '';
        }, 5000);
    };

    // Function to extract operands from the expression
    const extractOperands = (expression: string): string[] => {
        return expression.split(/[-+*/]/).filter(Boolean);
    };

    // Generate expression and validate it
    const generateExpression = (value: string): void => {
        // Ensure `currentExpression` reflects the latest state of the display
        currentExpression = display.value;

        const tempExpression = currentExpression + value;
        const operands = extractOperands(tempExpression);

        const isAnyOperandOutOfRange = operands.some(
            (operand) => !isWithinOperandRange(operand)
        );

        if (isAnyOperandOutOfRange) {
            displayError('Operand out of range');
            disableEqualsButton(true);
        } else {
            disableEqualsButton(false);
            currentExpression = tempExpression;
            updateDisplay(currentExpression);
        }
    };

    // Disable or enable the equals button
    const disableEqualsButton = (disabled: boolean): void => {
        equalsButton.disabled = disabled;
    };

    // Add event listeners to each button
    document.querySelectorAll('.calculator .btn').forEach((button): void => {
        const value = button.getAttribute('data-value');
        if (value) {
            button.addEventListener('click', () => {
                generateExpression(value); // Generate the expression
            });
        }
    });

    // Equals button event listener
    if (equalsButton) {
        equalsButton.addEventListener('click', () => {
            try {
                let result = eval(currentExpression);

                if (result === Infinity || result === -Infinity) {
                    throw new Error('Error: Divide by zero');
                }

                if (isNaN(result)) {
                    throw new Error('Invalid expression');
                }

                // convert to 2 decimal places
                result = result.toFixed(2);

                updateDisplay(result.toString()); // Display the result
                currentExpression = result.toString(); // Update the current expression
            } catch (error: any) {
                displayError(error.message); // Display the error
            }
        });
    }

    // Clear button event listener
    const clearButton = document.getElementById('clear') as HTMLButtonElement;
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            updateDisplay(''); // Clear the display
            currentExpression = ''; // Reset the current expression
            disableEqualsButton(false); // Re-enable the equals button
        });
    }

    // Restrict input to valid characters and avoid doubling
    display.addEventListener('input', (event): void => {
        const input = event.target as HTMLInputElement;
        const regex: RegExp = /^[0-9+\-*/.]*$/;

        if (!regex.test(input.value)) {
            input.value = input.value.replace(/[^0-9+\-*/.]/g, ''); // Remove invalid characters
        }

        let curInpValue = input.value;

        input.value = '';

        // currentExpression = '';
        // console.log('currentExpression', currentExpression);
        // console.log('input.value', input.value);
        generateExpression(curInpValue);
    });

    // Handle "Enter" key to trigger calculation
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            equalsButton?.click(); // Trigger calculation
        }
    });
});
