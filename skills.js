
const API_URL = "http://localhost:5000";


const skillsContainer = document.getElementById("skills-container");
const totalSkills = document.getElementById("total-skills");
const totalHours = document.getElementById("total-hours");
const certificationsEarned = document.getElementById("certifications-earned");


const skillNameInput = document.getElementById("skill-name");
const hoursPracticedInput = document.getElementById("hours-practiced");
const proficiencyInput = document.getElementById("proficiency-level");
const resourcesInput = document.getElementById("learning-resources");
const certificationInput = document.getElementById("certification-status");


const editSection = document.querySelector(".skill-edit");
const editSkillName = document.getElementById("edit-skill-name");
const editHours = document.getElementById("edit-hours-practiced");
const editProficiency = document.getElementById("edit-proficiency-level");
const editResources = document.getElementById("edit-learning-resources");
const editCertification = document.getElementById("edit-certification-status");


const addSkillButton = document.getElementById("add-skill");
const updateSkillButton = document.getElementById("update-skill");
const cancelEditButton = document.getElementById("cancel-edit");

let editingSkillId = null; 

async function fetchSkills() {
    try {
        const response = await fetch(`${API_URL}/skills`);
        const skills = await response.json();
        
        renderSkills(skills);
    } catch (error) {
        console.error("❌ Error fetching skills:", error);
    }
}

function renderSkills(skills) {
    skillsContainer.innerHTML = "";
    let totalHrs = 0;
    let certifiedCount = 0;

    skills.forEach(skill => {
        const hours = Number(skill.hours) || 0; 
        totalHrs += hours;
        if (skill.certification === "Certified") certifiedCount++;

        const skillCard = document.createElement("div");
        skillCard.classList.add("skill-card");
        skillCard.innerHTML = `
            <h3>${skill.name}</h3>
            <p>⏳ Hours: ${hours}</p>
            <p>📊 Proficiency: ${skill.proficiency}</p>
            <p>📚 Resources: ${skill.resources || "N/A"}</p>
            <p>🎓 Certification: ${skill.certification}</p>
            <button class="edit-btn" onclick="editSkill('${skill._id}', '${skill.name}', '${hours}', '${skill.proficiency}', '${skill.resources}', '${skill.certification}')">✏️ Edit</button>
            <button class="delete-btn" onclick="deleteSkill('${skill._id}')">🗑️ Delete</button>
        `;
        skillsContainer.appendChild(skillCard);
    });

 
    totalSkills.textContent = skills.length;
    totalHours.textContent = totalHrs.toFixed(2);
    certificationsEarned.textContent = certifiedCount;
}


addSkillButton.addEventListener("click", async () => {
    const newSkill = {
        name: skillNameInput.value.trim(),
        hours: Number(hoursPracticedInput.value) || 0,  
        proficiency: proficiencyInput.value,
        resources: resourcesInput.value.trim(),
        certification: certificationInput.value
    };

    if (!newSkill.name || newSkill.hours < 0) {
        alert("⚠️ Please enter a valid skill name and hours practiced.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/skills`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSkill),
        });

        const data = await response.json();
        if (response.ok) {
            fetchSkills(); 
            resetInputs();
        } else {
            alert(data.message || "⚠️ Error adding skill.");
        }
    } catch (error) {
        console.error("❌ Error adding skill:", error);
    }
});


function editSkill(id, name, hours, proficiency, resources, certification) {
    editingSkillId = id;

    editSkillName.value = name;
    editHours.value = hours;
    editProficiency.value = proficiency;
    editResources.value = resources;
    editCertification.value = certification;

    editSection.style.display = "block"; 
}


updateSkillButton.addEventListener("click", async () => {
    if (!editingSkillId) return;

    const updatedSkill = {
        name: editSkillName.value.trim(),
        hours: Number(editHours.value) || 0,  
        proficiency: editProficiency.value,
        resources: editResources.value.trim(),
        certification: editCertification.value
    };

    try {
        const response = await fetch(`${API_URL}/skills/${editingSkillId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedSkill),
        });

        const data = await response.json();
        if (response.ok) {
            fetchSkills(); 
            editSection.style.display = "none"; 
            editingSkillId = null;
        } else {
            alert(data.message || "⚠️ Error updating skill.");
        }
    } catch (error) {
        console.error("❌ Error updating skill:", error);
    }
});


async function deleteSkill(id) {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
        const response = await fetch(`${API_URL}/skills/${id}`, {
            method: "DELETE",
        });

        const data = await response.json();
        if (response.ok) {
            fetchSkills(); 
        } else {
            alert(data.message || "⚠️ Error deleting skill.");
        }
    } catch (error) {
        console.error("❌ Error deleting skill:", error);
    }
}


cancelEditButton.addEventListener("click", () => {
    editSection.style.display = "none"; 
    editingSkillId = null;
});

function resetInputs() {
    skillNameInput.value = "";
    hoursPracticedInput.value = "";
    proficiencyInput.value = "Beginner";
    resourcesInput.value = "";
    certificationInput.value = "Not Certified";
}

fetchSkills();
