document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display') as HTMLInputElement;
    const errorMsgDiv = document.getElementById(
        'error-msg-div'
    ) as HTMLDivElement;
    const errorMsgSpan = document.getElementById(
        'error-msg'
    ) as HTMLSpanElement;
    let currentExpression = '';

    const MIN_VALUE = -9999.99;
    const MAX_VALUE = 9999.99;

    // Function to update the display
    const updateDisplay = (value: string) => {
        display.value = value;
    };

    // Function to validate operand values
    const isWithinOperandRange = (operand: string) => {
        console.log('inside isWithinOperandRange', operand);
        const num = parseFloat(operand);
        if (!isNaN(num)) {
            return num >= MIN_VALUE && num <= MAX_VALUE;
        }
        return false;
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

    // Function to extract operands from expression
    const extractOperands = (expression: string) => {
        return expression.split(/[-+*/]/).filter(Boolean);
    };

    // Add event listeners to each button
    document.querySelectorAll('.calculator .btn').forEach((button) => {
        const value = button.getAttribute('data-value');
        if (value) {
            button.addEventListener('click', () => {
                // Temporary expression to check validity
                const tempExpression = currentExpression + value;
                const operands = extractOperands(tempExpression);

                console.log('x:', operands);

                // Check if any operand is out of range
                let isAnyOperandOutOfRange = operands.some(
                    (operand) => !isWithinOperandRange(operand)
                );

                if (isAnyOperandOutOfRange) {
                    displayError('Operand out of range');
                    disableEqualsButton(true);
                } else {
                    disableEqualsButton(false);
                }

                // continue updating the expression
                currentExpression += value;
                updateDisplay(currentExpression);
            });
        }
    });

    // Equals button event listener
    const equalsButton = document.getElementById('equals');
    if (equalsButton) {
        equalsButton.addEventListener('click', () => {
            try {
                const result = eval(currentExpression);

                // if infinity then throw error of divide by zero
                if (result === Infinity || result === -Infinity) {
                    throw new Error('Error: Divide by zero');
                }

                if (isNaN(result)) {
                    throw new Error('Invalid expression');
                }

                // if (result < MIN_VALUE || result > MAX_VALUE) {
                //     throw new Error('Result out of range');
                // }

                currentExpression = result.toString();
                updateDisplay(currentExpression);
            } catch (error: any) {
                currentExpression = '';
                // alert(error.message);
                displayError(error.message);
            }
        });
    }

    // Clear button event listener
    const clearButton = document.getElementById('clear');
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            currentExpression = '';
            updateDisplay('');
            disableEqualsButton(false);
        });
    }

    const disableEqualsButton = (disabled: boolean) => {
        const equalsButton = document.getElementById(
            'equals'
        ) as HTMLButtonElement;

        if (equalsButton) {
            equalsButton.disabled = disabled;
        }
    };
});
