document.addEventListener("DOMContentLoaded", function () {
    const examForm = document.getElementById("addExamForm");
    const examContainer = document.getElementById("examContainer");
    const editExamForm = document.getElementById("editExamForm");
    const editExamSection = document.querySelector(".edit-exam");
    const cancelEditBtn = document.getElementById("cancelEditBtn");
    
    let editingExamId = null; 

    
    fetchExams();

   
    examForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const examData = {
            examType: document.getElementById("examType").value,
            courseId: document.getElementById("courseId").value,
            examDate: document.getElementById("examDate").value,
            totalMarks: document.getElementById("totalMarks").value,
            marksObtained: document.getElementById("marksObtained").value || 0
        };

        try {
            const response = await fetch("http://localhost:5000/exams", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(examData),
            });

            const result = await response.json();
            if (response.ok) {
                alert("🎉 Exam added successfully!");
                examForm.reset();
                displayExam(result); 
            } else {
                alert("⚠️ Error: " + result.message);
            }
        } catch (error) {
            console.error("Error adding exam:", error);
            alert("⚠️ Failed to connect to the server.");
        }
    });

    editExamForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const updatedExamData = {
            examType: document.getElementById("editExamType").value,
            courseId: document.getElementById("editCourseId").value,
            examDate: document.getElementById("editExamDate").value,
            totalMarks: document.getElementById("editTotalMarks").value,
            marksObtained: document.getElementById("editMarksObtained").value || 0
        };

        try {
            const response = await fetch(`http://localhost:5000/exams/${editingExamId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedExamData),
            });

            const result = await response.json();
            if (response.ok) {
                alert("✅ Exam updated successfully!");
                fetchExams(); 
                editExamSection.style.display = "none"; 
            } else {
                alert("⚠️ Error: " + result.message);
            }
        } catch (error) {
            console.error("Error updating exam:", error);
            alert("⚠️ Failed to update the exam.");
        }
    });


    cancelEditBtn.addEventListener("click", function () {
        editExamSection.style.display = "none";
    });

    
    async function fetchExams() {
        try {
            const response = await fetch("http://localhost:5000/exams");
            const exams = await response.json();

            examContainer.innerHTML = ""; // Clear current list
            exams.forEach(exam => displayExam(exam));
        } catch (error) {
            console.error("Error fetching exams:", error);
            alert("⚠️ Failed to load exams.");
        }
    }

   
    function displayExam(exam) {
        const examBox = createExamBox(exam);
        examContainer.prepend(examBox); // Add new exams at the top
    }

   
    function createExamBox(exam) {
        const examBox = document.createElement("div");
        examBox.classList.add("exam-box");

        const examDate = new Date(exam.examDate);
        const today = new Date();

       
        const marksDisplay = examDate > today ? "Not Evaluated" : exam.marksObtained;

        examBox.innerHTML = `
            <h3>${exam.examType}</h3>
            <p><strong>Course ID:</strong> ${exam.courseId}</p>
            <p><strong>Date:</strong> ${examDate.toDateString()}</p>
            <p><strong>Total Marks:</strong> ${exam.totalMarks}</p>
            <p><strong>Marks Obtained:</strong> ${marksDisplay}</p>
            <button onclick="editExam('${exam._id}')">✏ Edit</button>
            <button onclick="deleteExam('${exam._id}')">❌ Delete</button>
        `;

        return examBox;
    }


    window.editExam = function (examId) {
       
        fetch(`http://localhost:5000/exams/${examId}`)
            .then(response => response.json())
            .then(exam => {
                editingExamId = exam._id;
                document.getElementById("editExamType").value = exam.examType;
                document.getElementById("editCourseId").value = exam.courseId;
                document.getElementById("editExamDate").value = new Date(exam.examDate).toISOString().split('T')[0];
                document.getElementById("editTotalMarks").value = exam.totalMarks;
                document.getElementById("editMarksObtained").value = exam.marksObtained || 0;

                editExamSection.style.display = "block";
            })
            .catch(error => console.error("Error fetching exam for editing:", error));
    };

   
    window.deleteExam = async function (examId) {
        if (confirm("Are you sure you want to delete this exam?")) {
            try {
                const response = await fetch(`http://localhost:5000/exams/${examId}`, {
                    method: "DELETE",
                });

                const result = await response.json();
                if (response.ok) {
                    alert("✅ Exam deleted successfully!");
                    fetchExams(); // Refresh the exam list
                } else {
                    alert("⚠️ Error: " + result.message);
                }
            } catch (error) {
                console.error("Error deleting exam:", error);
                alert("⚠️ Failed to delete the exam.");
            }
        }
    };
});
