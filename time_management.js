document.addEventListener("DOMContentLoaded", function () {
    const tasksContainer = document.getElementById("tasks-container");
    const addTaskBtn = document.getElementById("add-task");
    const updateTaskBtn = document.getElementById("update-task");
    const cancelEditBtn = document.getElementById("cancel-edit");
    const editTaskSection = document.querySelector(".task-edit");
    
    let currentEditingTaskName = null; // Stores the original task name before edit

    // 🔹 Fetch tasks from backend
    async function fetchTasks() {
        try {
            const response = await fetch("http://localhost:5000/tasks");
            if (!response.ok) throw new Error("Failed to fetch tasks");
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error("❌ Error fetching tasks:", error);
        }
    }

    // 🔹 Render tasks in the UI
    function renderTasks(tasks) {
        tasksContainer.innerHTML = "";
        if (tasks.length === 0) {
            document.getElementById("no-tasks-message").style.display = "block";
            return;
        }
        document.getElementById("no-tasks-message").style.display = "none";
        tasks.forEach(task => createTaskElement(task));
    }

    // 🔹 Create a task card in UI
    function createTaskElement(task) {
        const taskCard = document.createElement("div");
        taskCard.classList.add("task-card");
        taskCard.dataset.priority = task.PRIORITY_LEVEL;
        taskCard.dataset.activity = task.Activity_Type;

        taskCard.innerHTML = `
            <h3>${task.TASK_NAME}</h3>
            <p><strong>📌 Priority:</strong> ${task.PRIORITY_LEVEL}</p>
            <p><strong>💡 Activity Type:</strong> ${task.Activity_Type}</p>
            <p><strong>⏳ Duration:</strong> ${task.Duration} Hours</p>
            <p><strong>📅 Deadline:</strong> ${task.DEADLINE}</p>
            <button class="edit-task">✏️ Edit</button>
            <button class="delete-task">🗑️ Delete</button>
        `;

        taskCard.querySelector(".edit-task").addEventListener("click", () => openEditTaskUI(task));
        taskCard.querySelector(".delete-task").addEventListener("click", () => deleteTask(task.TASK_NAME));

        tasksContainer.appendChild(taskCard);
    }

    // 🔹 Open Edit Task UI
    function openEditTaskUI(task) {
        editTaskSection.style.display = "block";
        currentEditingTaskName = task.TASK_NAME; // Store original name for reference

        // Prefill form with existing task data
        document.getElementById("edit-task-name").value = task.TASK_NAME;
        document.getElementById("edit-activity-type").value = task.Activity_Type;
        document.getElementById("edit-priority-level").value = task.PRIORITY_LEVEL;
        document.getElementById("edit-duration").value = task.Duration;
        document.getElementById("edit-deadline").value = task.DEADLINE;
    }

    // 🔹 Update Task
    async function updateTask() {
        const TASK_NAME = document.getElementById("edit-task-name").value.trim();
        const Activity_Type = document.getElementById("edit-activity-type").value;
        const PRIORITY_LEVEL = document.getElementById("edit-priority-level").value;
        const Duration = document.getElementById("edit-duration").value.trim();
        const DEADLINE = document.getElementById("edit-deadline").value;

        if (!TASK_NAME || !Duration || !DEADLINE) {
            alert("⚠️ Please enter all required fields.");
            return;
        }

        const updatedTask = { TASK_NAME, PRIORITY_LEVEL, Activity_Type, Duration, DEADLINE };

        try {
            const response = await fetch(`http://localhost:5000/tasks/${currentEditingTaskName}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedTask),
            });

            if (!response.ok) throw new Error("Error updating task");

            alert("✅ Task updated successfully!");
            fetchTasks(); // Refresh UI
            editTaskSection.style.display = "none"; // Hide edit form
        } catch (error) {
            console.error("❌ Error updating task:", error);
        }
    }

    // 🔹 Add a new task
    async function addTask() {
        const TASK_NAME = document.getElementById("task-name").value.trim();
        const Activity_Type = document.getElementById("activity-type").value;
        const PRIORITY_LEVEL = document.getElementById("priority-level").value;
        const Duration = document.getElementById("duration").value.trim();
        const DEADLINE = document.getElementById("deadline").value;

        if (!TASK_NAME || !Duration || !DEADLINE) {
            alert("⚠️ Please enter all required fields.");
            return;
        }

        const taskData = { TASK_NAME, PRIORITY_LEVEL, Activity_Type, Duration, DEADLINE };

        try {
            const response = await fetch("http://localhost:5000/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(taskData),
            });

            if (!response.ok) {
                if (response.status === 409) {
                    alert("❌ Task name must be unique!");
                } else {
                    throw new Error("Error adding task");
                }
                return;
            }

            alert("✅ Task added successfully!");
            fetchTasks();
            document.getElementById("task-name").value = "";
            document.getElementById("duration").value = "";
            document.getElementById("deadline").value = "";
        } catch (error) {
            alert("❌ Error adding task.");
            console.error(error);
        }
    }

    // 🔹 Delete a task
    async function deleteTask(taskName) {
        const confirmDelete = confirm("⚠️ Are you sure you want to delete this task?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:5000/tasks/${taskName}`, { method: "DELETE" });

                if (!response.ok) throw new Error("Failed to delete task");

                fetchTasks();
            } catch (error) {
                console.error("❌ Error deleting task:", error);
            }
        }
    }

    // 🔹 Cancel Edit
    cancelEditBtn.addEventListener("click", () => {
        editTaskSection.style.display = "none";
    });

    // 🔹 Event Listeners
    addTaskBtn.addEventListener("click", addTask);
    updateTaskBtn.addEventListener("click", updateTask);

    // Fetch tasks on page load
    fetchTasks();
});
