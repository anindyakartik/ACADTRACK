document.addEventListener("DOMContentLoaded", () => {
    const studentForm = document.getElementById("studentForm");

    const API_URL = "http://localhost:5000/students"; // Update if using a deployed API

    // 👉 Add Student
    studentForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const enrollment = document.getElementById("enrollment").value.trim();

        if (!name || !email || !enrollment) {
            alert("⚠️ Please fill out all fields!");
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, enrollment }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("🎉 Student added successfully!");
                studentForm.reset();
            } else {
                alert(`❌ Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error adding student:", error);
        }
    });
});
