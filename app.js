class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement, previewResultTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.previewResultTextElement = previewResultTextElement;
        this.clickSound = document.getElementById('clickSound');
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.equalPressed = false;
        this.updateDisplay();
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        this.updateDisplay();
    }

    appendNumber(number) {
        if (this.equalPressed) {
            this.currentOperand = number.toString();
            this.equalPressed = false;
        } else {
            if (number === '.' && this.currentOperand.includes('.')) return;
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.equalPressed = false;
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.equalPressed = true;
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;

            // Calculate and display preview result
            let previewComputation;
            const prev = parseFloat(this.previousOperand);
            const current = parseFloat(this.currentOperand);

            if (!isNaN(prev) && !isNaN(current)) {
                switch (this.operation) {
                    case '+': previewComputation = prev + current; break;
                    case '-': previewComputation = prev - current; break;
                    case '×': previewComputation = prev * current; break;
                    case '÷': previewComputation = prev / current; break;
                    default: previewComputation = '';
                }
                this.previewResultTextElement.innerText = this.getDisplayNumber(previewComputation);
            } else if (!isNaN(prev) && (this.currentOperand === '' || this.currentOperand === '-')) {
                // Show previous operand if only it's available and current is empty/negative sign
                this.previewResultTextElement.innerText = this.getDisplayNumber(prev);
            }
            else {
                this.previewResultTextElement.innerText = '';
            }

        } else {
            this.previousOperandTextElement.innerText = '';
            this.previewResultTextElement.innerText = ''; // Clear preview when no operation or after equals
        }
    }

    playSound() {
        if (this.clickSound) {
            this.clickSound.currentTime = 0; // Rewind to start
            this.clickSound.play().catch(e => console.error('Audio play failed:', e));
        }
    }
}

// --- Splash Screen Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const appContainer = document.getElementById('app-container');

    setTimeout(() => {
        splashScreen.classList.add('hidden');
        splashScreen.addEventListener('transitionend', () => {
            splashScreen.style.display = 'none';
            appContainer.classList.add('visible');
        }, { once: true });
    }, 3000);

    // --- Calculator Logic ---
    const numberButtons = document.querySelectorAll('[data-number]');
    const operationButtons = document.querySelectorAll('[data-operation]');
    const equalsButton = document.querySelector('[data-equals]');
    const deleteButton = document.querySelector('[data-delete]');
    const allClearButton = document.querySelector('[data-all-clear]');
    const previousOperandTextElement = document.querySelector('[data-previous-operand]');
    const currentOperandTextElement = document.querySelector('[data-current-operand]');
    const previewResultTextElement = document.querySelector('[data-preview-result]');

    const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement, previewResultTextElement);

    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.innerText);
            calculator.playSound();
            calculator.updateDisplay(); // Update display for instant preview
        });
    });

    operationButtons.forEach(button => {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.innerText);
            calculator.playSound();
            calculator.updateDisplay(); // Update display for instant preview
        });
    });

    equalsButton.addEventListener('click', button => {
        calculator.compute();
        calculator.playSound();
        calculator.updateDisplay();
    });

    allClearButton.addEventListener('click', button => {
        calculator.clear();
        calculator.playSound();
    });

    deleteButton.addEventListener('click', button => {
        calculator.delete();
        calculator.playSound();
    });

    document.addEventListener('keydown', e => {
        if (e.key >= '0' && e.key <= '9' || e.key === '.') {
            calculator.appendNumber(e.key);
        } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            let op = e.key;
            if (op === '*') op = '×';
            if (op === '/') op = '÷';
            calculator.chooseOperation(op);
        } else if (e.key === 'Enter' || e.key === '=') {
            calculator.compute();
        } else if (e.key === 'Backspace') {
            calculator.delete();
        } else if (e.key === 'Escape') {
            calculator.clear();
        }
        calculator.playSound();
        calculator.updateDisplay();
    });
});
