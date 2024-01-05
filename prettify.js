let courseData = [];

function addRow() {
    const inputDataTable = document.getElementById("inputDataTable");
    const newRow = inputDataTable.insertRow(-1);

    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);

    cell1.innerHTML = '<input type="number" class="input-mark user-input" placeholder="e.g., 90">';
    cell2.innerHTML = '<input type="number" class="input-weight user-input" placeholder="e.g., 30">';
}

function calculateCourseAverage() {
    console.log("Calculating course average");

    const courseName = document.getElementById("courseName").value;
    const finalWeight = parseFloat(document.getElementById("finalWeight").value);

    if (isNaN(finalWeight) || finalWeight < 0 || finalWeight > 100) {
        alert("Invalid final exam weight. Please enter a value between 0 and 100.");
        return;
    }

    const inputMarks = document.querySelectorAll('.input-mark');
    const inputWeights = document.querySelectorAll('.input-weight');

    const gradesArray = Array.from(inputMarks).map(input => parseFloat(input.value.trim()));
    const weightsArray = Array.from(inputWeights).map(input => parseFloat(input.value.trim()));

    const pointsEarned = calculateCurrentPercentagePoints(gradesArray, weightsArray);
    const maxedOutGrade = calculateMaxGrade(gradesArray, weightsArray, finalWeight);

    // Validate input lengths
    if (gradesArray.length !== weightsArray.length) {
        alert("Number of marks and weights must be the same.");
        return;
    }

    // Validate percentage values
    if (gradesArray.some(grade => isNaN(grade) || grade < 0 || grade > 100)) {
        alert("Invalid percentage values. Please enter values between 0 and 100.");
        return;
    }

    // Check if the sum of weights is equal to 100
    const totalWeight = weightsArray.reduce((total, weight) => total + weight, 0) + finalWeight;
    if (totalWeight !== 100) {
        alert("Error: The sum of component weights (including the final exam weight) must be 100.");
        return;
    }

    // Check if the course already exists in the coursesData array
    const existingCourseIndex = courseData.findIndex(course => course.courseName === courseName);

    if (existingCourseIndex !== -1) {
        // Update the existing course entry
        const existingCourse = courseData[existingCourseIndex];
        existingCourse.grades = gradesArray;
        existingCourse.weights = weightsArray;
        existingCourse.finalWeight = finalWeight;
        existingCourse.pointsEarned = pointsEarned;
        existingCourse.maxGrade = maxedOutGrade;
        existingCourse.currentStanding = calculateAveragePercentage(gradesArray, weightsArray);
    } else {
        // Add a new course entry
        const currentStanding = calculateAveragePercentage(gradesArray, weightsArray);
        const courseData = {
            courseName: courseName,
            grades: gradesArray,
            weights: weightsArray,
            finalWeight: finalWeight,
            currentStanding: currentStanding,
            pointsEarned: pointsEarned,
            maxGrade: maxedOutGrade,
            finalExamGrade: null 
        };
        courseData.push(courseData);
    }

        displayResultsTable();
    
}

// ...

function displayResultsTable() {
    // Clear existing rows in the results table
    const resultsTable = document.getElementById("resultsTable");
    resultsTable.innerHTML = '';

    // Add header row
    const headerRow = resultsTable.insertRow(-1);
    const headerCell1 = headerRow.insertCell(0);
    const headerCell2 = headerRow.insertCell(1);
    const headerCell3 = headerRow.insertCell(2);
    const headerCell4 = headerRow.insertCell(3);
    const headerCell5 = headerRow.insertCell(4);
    headerCell1.innerHTML = 'Course Name';
    headerCell2.innerHTML = 'Current Standing';
    headerCell3.innerHTML = 'Balanced Percent Earned';
    headerCell4.innerHTML = 'Potential Max Grade';
    headerCell5.innerHTML = '';

    // Add data rows
    for (let i = 0; i < courseData.length; i++) {
        const course = courseData[i];
        const resultsRow = resultsTable.insertRow(-1);
        const resultsCell1 = resultsRow.insertCell(0);
        const resultsCell2 = resultsRow.insertCell(1);
        const resultsCell3 = resultsRow.insertCell(2);
        const resultsCell4 = resultsRow.insertCell(3);
        const resultsCell5 = resultsRow.insertCell(4); 
        resultsCell1.innerHTML = course.courseName;
        resultsCell2.innerHTML = course.currentStanding.toFixed(2) + '%';
        resultsCell3.innerHTML = course.pointsEarned.toFixed(2) + '%';
        resultsCell4.innerHTML = course.maxGrade.toFixed(2);

        // Add a trash can button to remove the corresponding row
        const trashButton = document.createElement('button');
        trashButton.innerText = 'Delete';
        trashButton.className = 'delete-button';
        trashButton.addEventListener('click', () => deleteRow(i));
        resultsCell5.appendChild(trashButton);
    }

}

function deleteRow(index) {
    courseData.splice(index, 1);
    displayResultsTable();
}

function calculateMaxGrade(grades, weights, finalWeight) {
    let maxGrade = 0;
    for (let i = 0; i < weights.length; i++) {
        maxGrade += (grades[i] * weights[i]) / 100;
    }
    maxGrade += finalWeight;
    return maxGrade;
}

function calculateAveragePercentage(gradesArray, weightsArray) {
    // Calculate total weighted percentage
    const totalWeightedPercentage = gradesArray.reduce((total, grade, index) => total + (grade * weightsArray[index]), 0);

    // Calculate average percentage
    const averagePercentage = totalWeightedPercentage / weightsArray.reduce((total, weight) => total + weight, 0);

    return averagePercentage;
}

function calculateRequiredFinalExamGrade(pointsEarned, finalWeight, desiredGrade) {
    // Calculate the required final exam grade to achieve the desired overall grade
    const requiredFinalExamGrade = ((desiredGrade - pointsEarned) * finalWeight) / 100;
    // Display the result as text below the form
    const resultText = `To achieve a desired grade of ${desiredGrade}%, you need ${requiredFinalExamGrade.toFixed(2)}% on the final exam.`;

    // Set the result text in a div or any other HTML element
    const resultContainer = document.getElementById("resultContainer");
    resultContainer.innerHTML = resultText;

    return requiredFinalExamGrade;
}

function calculateCurrentPercentagePoints(grades, weights) {
    let calCurrentPercentagePoints = 0;
    for (let i = 0; i < grades.length; i++) {
        calCurrentPercentagePoints += (grades[i] * weights[i]) / 100;
    }
    return calCurrentPercentagePoints;
}
