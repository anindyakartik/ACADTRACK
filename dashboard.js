// Sample data for demonstration purposes
const studentData = {
    name: "John Doe",
    major: "Computer Science",
    year: "Sophomore",
    assignments: { pending: 5, total: 10 },
    exams: { next: "Feb 25", total: 5 },
    overallProgress: 75,
    upcomingEvents: [
        { title: "Midterm Exam", date: "Feb 25" },
        { title: "Assignment Deadline", date: "Mar 1" }
    ],
    resources: [
        { name: "Online Library", link: "#" },
        { name: "Study Materials", link: "#" },
        { name: "Course Catalog", link: "#" }
    ],
    communication: [
        { name: "Messages", link: "#" },
        { name: "Discussion Forums", link: "#" },
        { name: "Office Hours", link: "#" }
    ],
    studyPlans: [
        { name: "Create a New Plan", link: "#" }
    ],
    gamification: [
        { name: "View Achievements", link: "#" }
    ],
    analytics: [
        { name: "View Reports", link: "#" }
    ]
};

// Function to update the student profile section
function updateProfile() {
    document.getElementById('studentName').textContent = studentData.name;
    document.getElementById('studentMajor').textContent = studentData.major;
    document.getElementById('studentYear').textContent = studentData.year;
}

// Function to update the progress tracking section
function updateProgress() {
    const assignmentsProgress = (studentData.assignments.pending / studentData.assignments.total) * 100;
    const examsProgress = (studentData.exams.total - 1) / studentData.exams.total * 100;
    const overallProgress = studentData.overallProgress;

    document.getElementById('overallProgressText').textContent = `${overallProgress}%`;
    document.getElementById('overallProgress').style.width = `${overallProgress}%`;
}

// Function to populate the upcoming events section
function populateEvents() {
    const eventsList = document.getElementById('upcomingEvents');
    studentData.upcomingEvents.forEach(event => {
        const listItem = document.createElement('li');
        listItem.textContent = `${event.title}: ${event.date}`;
        eventsList.appendChild(listItem);
    });
}

// Function to populate the resources section
function populateResources() {
    const resourcesList = document.getElementById('resourcesList');
    studentData.resources.forEach(resource => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = resource.link;
        link.textContent = resource.name;
        listItem.appendChild(link);
        resourcesList.appendChild(listItem);
    });
}

// Function to populate the communication tools section
function populateCommunication() {
    const communicationList = document.getElementById('communicationList');
    studentData.communication.forEach(tool => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = tool.link;
        link.textContent = tool.name;
        listItem.appendChild(link);
        communicationList.appendChild(listItem);
    });
}

// Function to populate the study plans section
function populateStudyPlans() {
    const studyPlansList = document.getElementById('studyPlansList');
    studentData.studyPlans.forEach(plan => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = plan.link;
        link.textContent = plan.name;
        listItem.appendChild(link);
        studyPlansList.appendChild(listItem);
    });
}

// Function to populate the gamification section
function populateGamification() {
    const gamificationList = document.getElementById('gamificationList');
    studentData.gamification.forEach(item => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = item.link;
        link.textContent = item.name;
        listItem.appendChild(link);
        gamificationList.appendChild(listItem);
    });
}

// Function to populate the analytics section
function populateAnalytics() {
    const analyticsList = document.getElementById('analyticsList');
    studentData.analytics.forEach(item => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = item.link;
        link.textContent = item.name;
        listItem.appendChild(link);
        analyticsList.appendChild(listItem);
    });
}

// Function to populate the exam section
function populateExams() {
    const examSection = document.getElementById('examSection');
    const nextExam = document.createElement('p');
    nextExam.textContent = `Next Exam: ${studentData.exams.next}`;
    examSection.appendChild(nextExam);

    const totalExams = document.createElement('p');
    totalExams.textContent = `Total Exams: ${studentData.exams.total}`;
    examSection.appendChild(totalExams);
}

// Function to populate the assignments section
function populateAssignments() {
    const assignmentSection = document.getElementById('assignmentSection');
    const assignments = document.createElement('p');
    assignments.textContent = `Assignments: ${studentData.assignments.pending} pending out of ${studentData.assignments.total}`;
    assignmentSection.appendChild(assignments);
}

// Initialize the dashboard by updating all sections
function initializeDashboard() {
    updateProfile();
    updateProgress();
    populateEvents();
    populateResources();
    populateCommunication();
    populateStudyPlans();
    populateGamification();
    populateAnalytics();
    populateExams();
    populateAssignments();
}

// Call the initializeDashboard function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeDashboard);
