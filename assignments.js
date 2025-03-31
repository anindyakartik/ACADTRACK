document.addEventListener("DOMContentLoaded", function () {
    const assignmentsContainer = document.getElementById("assignments-container");
    const assignmentForm = document.getElementById("assignment-form");
    const editAssignmentForm = document.getElementById("edit-assignment-form");
    const noAssignmentsMessage = document.getElementById("no-assignments-message");

    let currentEditingAssignmentTitle = null; 


    async function fetchAssignments() {
        try {
            const response = await fetch("http://localhost:5000/assignments");
            if (!response.ok) throw new Error("Failed to fetch assignments");
            const assignments = await response.json();
            renderAssignments(assignments);
        } catch (error) {
            console.error("❌ Error fetching assignments:", error);
        }
    }

    function renderAssignments(assignments) {
        assignmentsContainer.innerHTML = "";
        
        if (assignments.length === 0) {
            document.getElementById("no-assignments-message").style.display = "block";
            return;
        }
        
        document.getElementById("no-assignments-message").style.display = "none";
        
        assignments.forEach(assignment => {
            
            if (!assignment.ASSIGNMENT_TITLE || !assignment.Course_ID || !assignment.Submission_Date || 
                !assignment.Marks_Assigned || !assignment.Status) {
                return; 
            }
    
            createAssignmentElement(assignment);
        });
    }
    
   
    function createAssignmentElement(assignment) {
        const assignmentBox = document.createElement("div");
        assignmentBox.classList.add("assignment-box");

        assignmentBox.innerHTML = `
            <h3>${assignment.ASSIGNMENT_TITLE}</h3>
            <p><strong>📘 Course ID:</strong> ${assignment.Course_ID}</p>
            <p><strong>📅 Submission Date:</strong> ${assignment.Submission_Date}</p>
            <p><strong>📝 Marks Assigned:</strong> ${assignment.Marks_Assigned}</p>
            <p><strong>✅ Status:</strong> ${assignment.Status}</p>
            <button class="edit-assignment">✏️ Edit</button>
            <button class="delete-assignment">🗑️ Delete</button>
        `;

        assignmentBox.querySelector(".edit-assignment").addEventListener("click", () => openEditAssignmentUI(assignment));
        assignmentBox.querySelector(".delete-assignment").addEventListener("click", () => deleteAssignment(assignment.ASSIGNMENT_TITLE));

        assignmentsContainer.appendChild(assignmentBox);
    }

    function openEditAssignmentUI(assignment) {
        document.querySelector(".task-edit").style.display = "block";
        currentEditingAssignmentTitle = assignment.ASSIGNMENT_TITLE;

        document.getElementById("edit-assignment-title").value = assignment.ASSIGNMENT_TITLE;
        document.getElementById("edit-course-id").value = assignment.Course_ID;
        document.getElementById("edit-submission-date").value = assignment.Submission_Date;
        document.getElementById("edit-marks-assigned").value = assignment.Marks_Assigned;
        document.getElementById("edit-status").value = assignment.Status;
    }

 
    editAssignmentForm.addEventListener("submit", async function (event) {
        event.preventDefault(); 

        const updatedAssignment = {
            ASSIGNMENT_TITLE: document.getElementById("edit-assignment-title").value.trim(),
            Course_ID: document.getElementById("edit-course-id").value.trim(),
            Submission_Date: document.getElementById("edit-submission-date").value,
            Marks_Assigned: document.getElementById("edit-marks-assigned").value.trim(),
            Status: document.getElementById("edit-status").value
        };

        if (!updatedAssignment.ASSIGNMENT_TITLE || !updatedAssignment.Course_ID || !updatedAssignment.Submission_Date || !updatedAssignment.Marks_Assigned || !updatedAssignment.Status) {
            alert("⚠️ Please fill in all required fields.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/assignments/${currentEditingAssignmentTitle}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedAssignment),
            });

            if (!response.ok) throw new Error("Error updating assignment");

            alert("✅ Assignment updated successfully!");
            fetchAssignments();
            document.querySelector(".task-edit").style.display = "none"; // Hide edit form
        } catch (error) {
            console.error("❌ Error updating assignment:", error);
        }
    });

    
    assignmentForm.addEventListener("submit", async function (event) {
        event.preventDefault(); 

        const assignmentData = {
            ASSIGNMENT_TITLE: document.getElementById("assignment-title").value.trim(),
            Course_ID: document.getElementById("course-id").value.trim(),
            Submission_Date: document.getElementById("submission-date").value,
            Marks_Assigned: document.getElementById("marks-assigned").value.trim(),
            Status: document.getElementById("status").value
        };

        if (!assignmentData.ASSIGNMENT_TITLE || !assignmentData.Course_ID || !assignmentData.Submission_Date || !assignmentData.Marks_Assigned || !assignmentData.Status) {
            alert("⚠️ Please fill in all required fields.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/assignments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(assignmentData),
            });

            if (!response.ok) {
                if (response.status === 409) {
                    alert("❌ Assignment title must be unique!");
                } else {
                    throw new Error("Error adding assignment");
                }
                return;
            }

            alert("✅ Assignment added successfully!");
            fetchAssignments();

           
            assignmentForm.reset();
        } catch (error) {
            alert("❌ Error adding assignment.");
            console.error(error);
        }
    });


    async function deleteAssignment(assignmentTitle) {
        const confirmDelete = confirm("⚠️ Are you sure you want to delete this assignment?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:5000/assignments/${assignmentTitle}`, { method: "DELETE" });

                if (!response.ok) throw new Error("Failed to delete assignment");

                fetchAssignments();
            } catch (error) {
                console.error("❌ Error deleting assignment:", error);
            }
        }
    }


    document.getElementById("cancel-edit").addEventListener("click", () => {
        document.querySelector(".task-edit").style.display = "none";
    });

 
    fetchAssignments();
});
