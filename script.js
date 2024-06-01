// script.js

document.getElementById('matrixForm1').addEventListener('submit', function(event) {
    event.preventDefault();
    generateMatrix('matrix1', 'rows1', 'cols1', 'matrix-input1');
});

document.getElementById('matrixForm2').addEventListener('submit', function(event) {
    event.preventDefault();
    generateMatrix('matrix2', 'rows2', 'cols2', 'matrix-input2');
});

document.getElementById('operationsForm').addEventListener('submit', function(event) {
    event.preventDefault();
    performOperation();
});

function generateMatrix(matrixId, rowsId, colsId, inputClass) {
    let rows = document.getElementById(rowsId).value;
    let cols = document.getElementById(colsId).value;

    let matrixDiv = document.getElementById(matrixId);
    matrixDiv.innerHTML = '';

    let table = document.createElement('table');
    matrixDiv.appendChild(table);

    let matrix = [];

    for (let i = 0; i < rows; i++) {
        let row = table.insertRow(i);
        matrix[i] = [];
        for (let j = 0; j < cols; j++) {
            let cell = row.insertCell(j);
            let input = document.createElement('input');
            input.type = 'number';
            input.value = 0;
            input.className = inputClass;
            cell.appendChild(input);
            matrix[i][j] = input;

            input.addEventListener('keydown', function(e) {
                switch(e.key) {
                    case 'ArrowUp':
                        if(i > 0) matrix[i-1][j].focus();
                        e.preventDefault();
                        break;
                    case 'ArrowDown':
                        if(i < rows - 1) matrix[i+1][j].focus();
                        e.preventDefault();
                        break;
                    case 'ArrowLeft':
                        if(j > 0) matrix[i][j-1].focus();
                        break;
                    case 'ArrowRight':
                        if(j < cols - 1) matrix[i][j+1].focus();
                        break;
                }
            });
        }
    }
}

function roundMatrix(matrix, decimals) {
    return matrix.map(row => row.map(value => parseFloat(value.toFixed(decimals))));
}

function performOperation() {
    let operation = document.getElementById('operation').value;
    let matrix1 = extractTableData('matrix1');
    let matrix2 = extractTableData('matrix2');
    let result;
    let name = "";

    try {
        switch(operation) {
            case 'Addition':
                name = "Addition of Matrix 1 and Matrix 2";
                result = addMatrices(matrix1, matrix2);
                break;
            case 'Subtraction':
                name = "Subtraction of Matrix 1 and Matrix 2";
                result = subtractMatrices(matrix1, matrix2);
                break;
            case 'Multiplication':
                name = "Multiplication of Matrix 1 and Matrix 2";
                result = multiplyMatrices(matrix1, matrix2);
                break;
            default:
                console.log("Invalid operation");
                return; // Exit if the operation is invalid
        }

        result = roundMatrix(result, 4); // Round result to 4 decimal places
        displayResult(name, result);
    } catch (error) {
        alert(error.message);
    }
}

function displayResult(name, result) {
    const formattedResult = `$$\\begin{bmatrix}${result.map(row => row.join(' & ')).join(' \\\\ ')}\\end{bmatrix}$$`;

    const outputDiv = document.createElement('div');
    outputDiv.innerHTML = name + '<br></br>' + '<p>' + formattedResult + '</p>';

    const resultDiv = document.querySelector('.result');
    while (resultDiv.firstChild) {
        resultDiv.removeChild(resultDiv.firstChild);
    }

    resultDiv.appendChild(outputDiv);

    setTimeout(() => {
        MathJax.typesetPromise().then(() => {
            console.log('MathJax typesetting complete');
        });
    }, 0);
}

document.querySelectorAll('.matrix-button1 button').forEach(button => {
    button.addEventListener('click', function() {
        const operation = this.textContent;
        const matrix = extractTableData('matrix1');
        handleMatrixOperation('Matrix 1', operation, matrix);
    });
});

document.querySelectorAll('.matrix-button2 button').forEach(button => {
    button.addEventListener('click', function() {
        const operation = this.textContent;
        const matrix = extractTableData('matrix2');
        handleMatrixOperation('Matrix 2', operation, matrix);
    });
});

function handleMatrixOperation(matrixName, operation, matrix) {
    let result;
    let name = "";

    try {
        switch(operation) {
            case 'Determinant':
                if (!isSquareMatrix(matrix)) throw new Error("Matrix must be square for determinant calculation");
                name = `Determinant of ${matrixName}`;
                result = determinant(matrix);
                break;
            case 'Inverse':
                if (!isSquareMatrix(matrix)) throw new Error("Matrix must be square for inverse calculation");
                name = `Inverse of ${matrixName}`;
                result = inverseMatrix(matrix);
                break;
            case 'Eigenvalues':
                if (!isSquareMatrix(matrix)) throw new Error("Matrix must be square for eigenvalues calculation");
                name = `Eigenvalues of ${matrixName}`;
                result = eigenvalues(matrix); // Modify eigenvalues function
                break;
            case 'Transpose':
                name = `Transpose of ${matrixName}`;
                result = transposeMatrix(matrix);
                break;
            case 'Scale':
                name = `Scaled ${matrixName}`;
                let scalar = parseFloat(prompt("Enter scalar value:"));
                result = scaleMatrix(matrix, scalar);
                break;
            default:
                console.log("Invalid operation");
                return;
        }

        if (typeof result === 'number' || (Array.isArray(result) && typeof result[0] === 'number')) {
            result = [[result]];  // Convert the result to a 1x1 matrix
        }

        result = roundMatrix(result, 4); // Round result to 4 decimal places
        displayResult(name, result);
    } catch (error) {
        alert(error.message);
    }
}

function isSquareMatrix(matrix) {
    return matrix.length === matrix[0].length;
}

function extractTableData(matrixId) {
    const table = document.getElementById(matrixId).getElementsByTagName('table')[0];
    const rows = table.rows;
    const matrix = [];
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].cells;
        const row = [];
        for (let j = 0; j < cells.length; j++) {
            row.push(parseFloat(cells[j].getElementsByTagName('input')[0].value));
        }
        matrix.push(row);
    }
    return matrix;
}

function addMatrices(matrix1, matrix2) {
    if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
        throw new Error("Matrices must have the same dimensions for addition");
    }
    let result = [];
    for (let i = 0; i < matrix1.length; i++) {
        result[i] = [];
        for (let j = 0; j < matrix1[i].length; j++) {
            result[i][j] = matrix1[i][j] + matrix2[i][j];
        }
    }
    return result;
}

function subtractMatrices(matrix1, matrix2) {
    if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
        throw new Error("Matrices must have the same dimensions for subtraction");
    }
    let result = [];
    for (let i = 0; i < matrix1.length; i++) {
        result[i] = [];
        for (let j = 0; j < matrix1[i].length; j++) {
            result[i][j] = matrix1[i][j] - matrix2[i][j];
        }
    }
    return result;
}

function multiplyMatrices(matrix1, matrix2) {
    if (matrix1[0].length !== matrix2.length) {
        throw new Error("Number of columns in first matrix must equal number of rows in second matrix for multiplication");
    }
    let result = [];
    for (let i = 0; i < matrix1.length; i++) {
        result[i] = [];
        for (let j = 0; j < matrix2[0].length; j++) {
            result[i][j] = 0;
            for (let k = 0; k < matrix1[0].length; k++) {
                result[i][j] += matrix1[i][k] * matrix2[k][j];
            }
        }
    }
    return result;
}

function scaleMatrix(matrix, scalar) {
    let result = [];
    for (let i = 0; i < matrix.length; i++) {
        result[i] = [];
        for (let j = 0; j < matrix[i].length; j++) {
            result[i][j] = matrix[i][j] * scalar;
        }
    }
    return result;
}

function transposeMatrix(matrix) {
    let result = [];
    for (let i = 0; i < matrix[0].length; i++) {
        result[i] = [];
        for (let j = 0; j < matrix.length; j++) {
            result[i][j] = matrix[j][i];
        }
    }
    return result;
}

function determinant(matrix) {
    if (matrix.length !== matrix[0].length) {
        throw new Error("Matrix must be square for determinant calculation");
    }
    if (matrix.length === 1) {
        return matrix[0][0];
    }
    if (matrix.length === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    let result = 0;
    for (let i = 0; i < matrix.length; i++) {
        let minor = getMinor(matrix, 0, i);
        result += Math.pow(-1, i) * matrix[0][i] * determinant(minor);
    }
    return result;
}

function getMinor(matrix, rowToRemove, colToRemove) {
    let result = [];
    for (let i = 0; i < matrix.length; i++) {
        if (i === rowToRemove) continue;
        result.push([]);
        for (let j = 0; j < matrix[i].length; j++) {
            if (j === colToRemove) continue;
            result[result.length - 1].push(matrix[i][j]);
        }
    }
    return result;
}

function inverseMatrix(matrix) {
    if (matrix.length !== matrix[0].length) {
        throw new Error("Matrix must be square for inverse calculation");
    }
    let n = matrix.length;
    let identity = [];
    for (let i = 0; i < n; i++) {
        identity[i] = [];
        for (let j = 0; j < n; j++) {
            identity[i][j] = (i === j) ? 1 : 0;
        }
    }
    let augmentedMatrix = [];
    for (let i = 0; i < n; i++) {
        augmentedMatrix[i] = matrix[i].concat(identity[i]);
    }
    for (let i = 0; i < n; i++) {
        if (augmentedMatrix[i][i] === 0) {
            let nonZeroRow = i + 1;
            while (nonZeroRow < n && augmentedMatrix[nonZeroRow][i] === 0) {
                nonZeroRow++;
            }
            if (nonZeroRow === n) {
                throw new Error("Matrix is singular and cannot be inverted");
            }
            let temp = augmentedMatrix[i];
            augmentedMatrix[i] = augmentedMatrix[nonZeroRow];
            augmentedMatrix[nonZeroRow] = temp;
        }
        let divisor = augmentedMatrix[i][i];
        for (let j = 0; j < 2 * n; j++) {
            augmentedMatrix[i][j] /= divisor;
        }
        for (let k = 0; k < n; k++) {
            if (k !== i) {
                let factor = augmentedMatrix[k][i];
                for (let j = 0; j < 2 * n; j++) {
                    augmentedMatrix[k][j] -= factor * augmentedMatrix[i][j];
                }
            }
        }
    }
    let inverse = [];
    for (let i = 0; i < n; i++) {
        inverse[i] = augmentedMatrix[i].slice(n);
    }
    return inverse;
}

function eigenvalues(matrix) {
    if (matrix.length !== matrix[0].length) {
        throw new Error("Matrix must be square for eigenvalues calculation");
    }
    try {
        let eigenvals = numeric.eig(matrix).lambda.x;
        let uniqueEigenvals = Array.from(new Set(eigenvals)); // Remove duplicates
        return [uniqueEigenvals]; // Return as a row vector
    } catch (error) {
        console.error("Error calculating eigenvalues:", error);
        if (matrix.every(row => row.every(value => value === 0))) {
            return [[0]]; // For a zero matrix, the eigenvalue is 0
        } else {
            throw new Error("Internal error calculating eigenvalues.");
        }
    }
}

