require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/acadtrack";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";


app.use(cors());
app.use(bodyParser.json());


mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });


const assignmentSchema = new mongoose.Schema({
  ASSIGNMENT_TITLE: { type: String, unique: true, required: true },
  Course_ID: { type: String, required: true },
  Submission_Date: { type: String, required: true },
  Marks_Assigned: { type: Number, required: true },
  Status: { type: String, required: true },
});


app.use(express.static(__dirname)); // Serve static files like HTML, CSS, JS

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const Assignment = mongoose.model("Assignment", assignmentSchema);
app.get("/assignments", async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: "❌ Server Error" });
  }
});


app.post("/assignments", async (req, res) => {
  try {
    const { ASSIGNMENT_TITLE, Course_ID, Submission_Date, Marks_Assigned, Status } = req.body;
    if (!ASSIGNMENT_TITLE || !Course_ID || !Submission_Date || !Marks_Assigned || !Status) {
      return res.status(400).json({ message: "⚠️ Please fill all fields." });
    }

    const existingAssignment = await Assignment.findOne({ ASSIGNMENT_TITLE });
    if (existingAssignment) {
      return res.status(409).json({ message: "❌ Assignment title must be unique!" });
    }

    const newAssignment = new Assignment({ ASSIGNMENT_TITLE, Course_ID, Submission_Date, Marks_Assigned, Status });
    await newAssignment.save();
    res.status(201).json({ message: "✅ Assignment added successfully!" });
  } catch (err) {
    res.status(500).json({ message: "❌ Server Error" });
  }
});


app.put("/assignments/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const updatedData = req.body;

    const assignment = await Assignment.findOneAndUpdate(
      { ASSIGNMENT_TITLE: title },
      updatedData,
      { new: true }
    );

    if (!assignment) {
      return res.status(404).json({ message: "❌ Assignment not found." });
    }

    res.json({ message: "✅ Assignment updated successfully!" });
  } catch (err) {
    res.status(500).json({ message: "❌ Server Error" });
  }
});


app.delete("/assignments/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const deletedAssignment = await Assignment.findOneAndDelete({ ASSIGNMENT_TITLE: title });

    if (!deletedAssignment) {
      return res.status(404).json({ message: "❌ Assignment not found." });
    }

    res.json({ message: "🗑️ Assignment deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "❌ Server Error" });
  }
});


const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);


app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "⚠️ All fields are required" });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "❌ User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "🎉 User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "❌ User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "❌ Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "✅ Login successful", token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  enrollment: { type: String, unique: true, required: true },
});

const Student = mongoose.model("Student", StudentSchema);


app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/students", async (req, res) => {
  try {
    const { name, email, enrollment } = req.body;
    if (!name || !email || !enrollment) return res.status(400).json({ message: "⚠️ All fields are required" });

    let student = await Student.findOne({ email });
    if (student) return res.status(400).json({ message: "❌ Student already exists" });

    student = new Student({ name, email, enrollment });
    await student.save();

    res.status(201).json({ message: "🎉 Student added successfully", student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "❌ Student not found" });

    res.json({ message: "✅ Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hours: { type: Number, required: true },
  proficiency: { type: String, required: true },
  resources: { type: String, default: "N/A" },
  certification: { type: String, default: "Not Certified" },
});

const Skill = mongoose.model("Skill", SkillSchema);


app.get("/skills", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: "⚠️ Error fetching skills" });
  }
});


app.post("/skills", async (req, res) => {
  try {
    const { name, hours, proficiency, resources, certification } = req.body;
    if (!name || !hours || !proficiency) return res.status(400).json({ message: "⚠️ Required fields missing" });

    const newSkill = new Skill({ name, hours, proficiency, resources, certification });
    await newSkill.save();
    res.status(201).json({ message: "🎉 Skill added successfully", skill: newSkill });
  } catch (err) {
    res.status(500).json({ message: "⚠️ Error adding skill", error: err.message });
  }
});

app.put("/skills/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { name, hours, proficiency, resources, certification } = req.body;
  
      const updatedSkill = await Skill.findByIdAndUpdate(
        id,
        { name, hours, proficiency, resources, certification },
        { new: true, runValidators: true }
      );
  
      if (!updatedSkill) return res.status(404).json({ message: "⚠️ Skill not found" });
  
      res.json({ message: "✅ Skill updated successfully", skill: updatedSkill });
    } catch (err) {
      res.status(500).json({ message: "⚠️ Error updating skill", error: err.message });
    }
  });
  


app.delete("/skills/:id", async (req, res) => {
  try {
    const deletedSkill = await Skill.findByIdAndDelete(req.params.id);
    if (!deletedSkill) return res.status(404).json({ message: "❌ Skill not found" });

    res.json({ message: "✅ Skill deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "⚠️ Error deleting skill" });
  }
});


const TaskSchema = new mongoose.Schema({
  TASK_NAME: { type: String, required: true, unique: true },
  PRIORITY_LEVEL: { type: String, enum: ["High", "Medium", "Low"], required: true },
  Activity_Type: { type: String, enum: ["Study", "Coding", "Exercise"], required: true },
  Duration: { type: String, required: true },
  DEADLINE: { type: String, required: true },
});

const Task = mongoose.model("Task", TaskSchema);

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json({ message: "🎉 Task added successfully", task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.put("/tasks/:taskName", async (req, res) => {
    try {
      const updatedTask = await Task.findOneAndUpdate({ TASK_NAME: req.params.taskName }, req.body, {
        new: true,
      });
      if (!updatedTask) return res.status(404).json({ message: "❌ Task not found" });
  
      res.json({ message: "✅ Task updated successfully", updatedTask });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


app.delete("/tasks/:taskName", async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({ TASK_NAME: req.params.taskName });
    if (!deletedTask) return res.status(404).json({ message: "❌ Task not found" });

    res.json({ message: "✅ Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const examSchema = new mongoose.Schema({
    examType: { type: String, required: true },
    courseId: { type: String, required: true },
    examDate: { type: Date, required: true },
    totalMarks: { type: Number, required: true },
    marksObtained: { type: Number, default: 0 },
});


const Exam = mongoose.model("Exam", examSchema);


app.post("/exams", async (req, res) => {
    try {
        const { examType, courseId, examDate, totalMarks, marksObtained } = req.body;

        const newExam = new Exam({
            examType,
            courseId,
            examDate,
            totalMarks,
            marksObtained,
        });

        await newExam.save();
        res.status(201).json(newExam);
    } catch (error) {
        console.error("Error adding exam:", error);
        res.status(500).json({ message: "Error adding exam" });
    }
});


app.get("/exams", async (req, res) => {
    try {
        const exams = await Exam.find();
        res.status(200).json(exams);
    } catch (error) {
        console.error("Error fetching exams:", error);
        res.status(500).json({ message: "Error fetching exams" });
    }
});


app.get("/exams/:id", async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        res.status(200).json(exam);
    } catch (error) {
        console.error("Error fetching exam by ID:", error);
        res.status(500).json({ message: "Error fetching exam" });
    }
});


app.put("/exams/:id", async (req, res) => {
    try {
        const { examType, courseId, examDate, totalMarks, marksObtained } = req.body;

        const updatedExam = await Exam.findByIdAndUpdate(
            req.params.id,
            { examType, courseId, examDate, totalMarks, marksObtained },
            { new: true }
        );

        if (!updatedExam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        res.status(200).json(updatedExam);
    } catch (error) {
        console.error("Error updating exam:", error);
        res.status(500).json({ message: "Error updating exam" });
    }
});


app.delete("/exams/:id", async (req, res) => {
    try {
        const exam = await Exam.findByIdAndDelete(req.params.id);

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        res.status(200).json({ message: "Exam deleted successfully" });
    } catch (error) {
        console.error("Error deleting exam:", error);
        res.status(500).json({ message: "Error deleting exam" });
    }
});




app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
