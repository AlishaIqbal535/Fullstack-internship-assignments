document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const studentListDiv = document.getElementById('studentList');
    let students = []; // Array to store student objects

    // Function to render the student list
    const renderStudents = () => {
        studentListDiv.innerHTML = ''; // Clear the current list
        if (students.length === 0) {
            studentListDiv.innerHTML = '<p>No students have been registered yet.</p>';
            return;
        }

        students.forEach((student, index) => {
            const card = document.createElement('div');
            card.className = 'student-card';

            const img = document.createElement('img');
            img.src = student.image;
            img.alt = student.name;

            const details = document.createElement('div');
            details.className = 'student-details';
            details.innerHTML = `
                <p><strong>Name:</strong> ${student.name}</p>
                <p><strong>Roll No:</strong> ${student.rollNumber}</p>
                <p><strong>Department:</strong> ${student.department}</p>
            `;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => deleteStudent(index);

            card.appendChild(img);
            card.appendChild(details);
            card.appendChild(deleteBtn);
            studentListDiv.appendChild(card);
        });
    };

    // Function to handle form submission
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const rollNumber = document.getElementById('rollNumber').value;
        const department = document.getElementById('department').value;
        const imageFile = document.getElementById('image').files[0];

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const student = {
                    name,
                    rollNumber,
                    department,
                    image: e.target.result, // Data URL of the image
                };
                students.push(student);
                renderStudents();
                form.reset(); // Clear the form fields
            };
            reader.readAsDataURL(imageFile);
        }
    });

    // Function to delete a student
    const deleteStudent = (index) => {
        if (confirm('Are you sure you want to delete this student?')) {
            students.splice(index, 1);
            renderStudents();
        }
    };

    // Initial render
    renderStudents();
});