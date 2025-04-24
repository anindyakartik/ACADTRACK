CREATE DATABASE acadtrack_03;
USE acadtrack_03;

-- Student Table
CREATE TABLE student (
    Student_ID INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Enrollment_Number VARCHAR(20) UNIQUE,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone_Number VARCHAR(15) UNIQUE NOT NULL
);

-- Courses Table
CREATE TABLE courses (
    Course_ID INT PRIMARY KEY,
    Course_Name VARCHAR(100) NOT NULL,
    Credits INT CHECK (Credits > 0),
    Instructor_Name VARCHAR(100) NOT NULL,
    Semester INT CHECK (Semester > 0)
);

-- Assignments Table
CREATE TABLE assignments (
    Assignment_Title VARCHAR(100),
    Course_ID INT,
    Submission_Date DATE NOT NULL,
    Marks_Assigned INT CHECK (Marks_Assigned >= 0),
    Status ENUM('Pending', 'Completed') DEFAULT 'Pending',
    FOREIGN KEY (Course_ID) REFERENCES courses(Course_ID)
);

-- Exams Table
CREATE TABLE exams (
    Exam_Type ENUM('Midterm', 'Final'),
    Course_ID INT,
    Exam_Date DATE NOT NULL,
    Total_Marks INT CHECK (Total_Marks > 0),
    Marks_Obtained INT CHECK (Marks_Obtained >= 0),
    FOREIGN KEY (Course_ID) REFERENCES courses(Course_ID)
);

-- Grades Table
CREATE TABLE grades (
    Evaluation_Type ENUM('Midterm', 'Final'),
    Total_Marks INT CHECK (Total_Marks > 0),
    Course_ID INT,
    Marks_Obtained INT CHECK (Marks_Obtained >= 0),
    Grade CHAR(2),
    FOREIGN KEY (Course_ID) REFERENCES courses(Course_ID)
);

-- Projects Table
CREATE TABLE projects (
    Project_Guide VARCHAR(100),
    Project_Title VARCHAR(100) PRIMARY KEY,
    Description TEXT,
    Technologies_Used VARCHAR(200),
    Completion_Status ENUM('Ongoing', 'Completed') DEFAULT 'Ongoing'
);

-- Skills Table
CREATE TABLE skills (
    Skill_Name VARCHAR(50) PRIMARY KEY,
    Hours_Practiced INT CHECK (Hours_Practiced >= 0),
    Proficiency_Level ENUM('Beginner', 'Intermediate', 'Advanced'),
    Learning_Resources TEXT,
    Certification_Status ENUM('Certified', 'Not Certified') DEFAULT 'Not Certified'
);

-- Time Management Table
CREATE TABLE time_management (
    Task_Name VARCHAR(100) PRIMARY KEY,
    Priority_Level ENUM('Low', 'Medium', 'High'),
    Activity_Type VARCHAR(50),
    Duration INT CHECK (Duration > 0),
    Deadline DATE NOT NULL
);

-- Sample Data
INSERT INTO student (Student_ID, Name, Enrollment_Number, Email, Phone_Number)
VALUES 
(1, 'Rivva', 'SRM2023001', 'rivva@srmist.edu.in', '9876543210'),
(2, 'Tina', 'SRM2023002', 'tina@srmist.edu.in', '8765432109'),
(3, 'Nazneen', 'SRM2023003', 'nazneen@srmist.edu.in', '7654321098'),
(4, 'Anindya', 'SRM2023004', 'anindya@srmist.edu.in', '6543210987');

INSERT INTO courses (Course_ID, Course_Name, Credits, Instructor_Name, Semester)
VALUES 
(1, 'Data Structures', 4, 'Prof. Ramesh Iyer', 2),
(2, 'Database Management Systems', 3, 'Dr. Neha Verma', 3),
(3, 'Operating Systems', 4, 'Prof. Karthik Rao', 4);

INSERT INTO assignments (Assignment_Title, Course_ID, Submission_Date, Marks_Assigned, Status)
VALUES 
('Linked List Implementation', 1, '2025-04-10', 100, 'Pending'),
('ER Diagram for SRM Portal', 2, '2025-04-15', 100, 'Completed'),
('Process Scheduling Algorithms', 3, '2025-04-20', 100, 'Pending');

INSERT INTO exams (Exam_Type, Course_ID, Exam_Date, Total_Marks, Marks_Obtained)
VALUES 
('Midterm', 1, '2025-05-01', 100, 85),
('Final', 2, '2025-06-01', 100, 90),
('Midterm', 3, '2025-05-15', 100, 80);

INSERT INTO grades (Evaluation_Type, Total_Marks, Course_ID, Marks_Obtained, Grade)
VALUES 
('Midterm', 100, 1, 85, 'B'),
('Final', 100, 2, 90, 'A'),
('Midterm', 100, 3, 80, 'B');

INSERT INTO projects (Project_Guide, Project_Title, Description, Technologies_Used, Completion_Status)
VALUES 
('Prof. Ramesh Iyer', 'Online Student Portal', 'A student portal to manage academics and profile.', 'HTML, CSS, JS, Node.js', 'Ongoing'),
('Dr. Neha Verma', 'DBMS for Library System', 'A relational DBMS project for library automation.', 'MySQL, PHP', 'Completed');

INSERT INTO skills (Skill_Name, Hours_Practiced, Proficiency_Level, Learning_Resources, Certification_Status)
VALUES 
('C Programming', 60, 'Intermediate', 'NPTEL, GeeksforGeeks', 'Certified'),
('MySQL', 45, 'Intermediate', 'NPTEL, Udemy', 'Not Certified');

INSERT INTO time_management (Task_Name, Priority_Level, Activity_Type, Duration, Deadline)
VALUES 
('Revise OS Notes', 'High', 'Study', 2, '2025-04-10'),
('Complete DBMS Assignment', 'Medium', 'Study', 3, '2025-04-15'),
('Leetcode Practice', 'Low', 'Coding', 1, '2025-04-20');

-- Views and Triggers
CREATE VIEW student_grades AS
SELECT s.Name, g.Course_ID, g.Marks_Obtained, g.Grade
FROM student s
JOIN grades g ON s.Student_ID = g.Course_ID;

DELIMITER //
CREATE TRIGGER before_insert_grades
BEFORE INSERT ON grades
FOR EACH ROW
BEGIN
    IF NEW.Marks_Obtained > NEW.Total_Marks THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Marks Obtained cannot exceed Total Marks';
    END IF;
END;
//
DELIMITER ;

-- Stored Procedure
DELIMITER //
CREATE PROCEDURE list_assignments()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE title VARCHAR(100);
    DECLARE cur CURSOR FOR SELECT Assignment_Title FROM assignments;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO title;
        IF done THEN
            LEAVE read_loop;
        END IF;
        SELECT title;
    END LOOP;
    CLOSE cur;
END;
//
DELIMITER ;

-- Select Everything
SELECT * FROM student;
SELECT * FROM courses;
SELECT * FROM assignments;
SELECT * FROM exams;
SELECT * FROM grades;
SELECT * FROM projects;
SELECT * FROM skills;
SELECT * FROM time_management;
SELECT * FROM student_grades;
CALL list_assignments();
