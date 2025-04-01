CREATE DATABASE acadtrack_final;
USE acadtrack_final;
CREATE TABLE student (
    Student_ID INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Enrollment_Number VARCHAR(20) UNIQUE,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone_Number VARCHAR(15) UNIQUE NOT NULL
);

CREATE TABLE courses (
    Course_ID INT PRIMARY KEY,
    Course_Name VARCHAR(100) NOT NULL,
    Credits INT CHECK (Credits > 0),
    Instructor_Name VARCHAR(100) NOT NULL,
    Semester INT CHECK (Semester > 0)
);

CREATE TABLE assignments (
    Assignment_Title VARCHAR(100),
    Course_ID INT,
    Submission_Date DATE NOT NULL,
    Marks_Assigned INT CHECK (Marks_Assigned >= 0),
    Status ENUM('Pending', 'Completed') DEFAULT 'Pending',
    FOREIGN KEY (Course_ID) REFERENCES courses(Course_ID)
);

CREATE TABLE exams (
    Exam_Type ENUM('Midterm', 'Final'),
    Course_ID INT,
    Exam_Date DATE NOT NULL,
    Total_Marks INT CHECK (Total_Marks > 0),
    Marks_Obtained INT CHECK (Marks_Obtained >= 0),
    FOREIGN KEY (Course_ID) REFERENCES courses(Course_ID)
);

CREATE TABLE grades (
    Evaluation_Type ENUM('Midterm', 'Final'),
    Total_Marks INT CHECK (Total_Marks > 0),
    Course_ID INT,
    Marks_Obtained INT CHECK (Marks_Obtained >= 0),
    Grade CHAR(2),
    FOREIGN KEY (Course_ID) REFERENCES courses(Course_ID)
);


CREATE TABLE projects (
    Project_Guide VARCHAR(100),
    Project_Title VARCHAR(100) PRIMARY KEY,
    Description TEXT,
    Technologies_Used VARCHAR(200),
    Completion_Status ENUM('Ongoing', 'Completed') DEFAULT 'Ongoing'
);

CREATE TABLE skills (
    Skill_Name VARCHAR(50) PRIMARY KEY,
    Hours_Practiced INT CHECK (Hours_Practiced >= 0),
    Proficiency_Level ENUM('Beginner', 'Intermediate', 'Advanced'),
    Learning_Resources TEXT,
    Certification_Status ENUM('Certified', 'Not Certified') DEFAULT 'Not Certified'
);

CREATE TABLE time_management (
    Task_Name VARCHAR(100) PRIMARY KEY,
    Priority_Level ENUM('Low', 'Medium', 'High'),
    Activity_Type VARCHAR(50),
    Duration INT CHECK (Duration > 0),
    Deadline DATE NOT NULL
);

SELECT Name FROM student
UNION
SELECT Instructor_Name FROM courses;


SELECT Name FROM student
INNER JOIN courses ON student.Name = courses.Instructor_Name;


SELECT Name FROM student
WHERE Name NOT IN (SELECT Instructor_Name FROM courses);


SELECT a.Assignment_Title, c.Course_Name, a.Submission_Date
FROM assignments a
INNER JOIN courses c ON a.Course_ID = c.Course_ID;


SELECT s.Name, g.Grade
FROM student s
LEFT JOIN grades g ON s.Student_ID = g.Course_ID;


SELECT c.Course_Name, a.Assignment_Title
FROM assignments a
RIGHT JOIN courses c ON a.Course_ID = c.Course_ID;


SELECT s.Name, g.Grade
FROM student s
LEFT JOIN grades g ON s.Student_ID = g.Course_ID
UNION
SELECT s.Name, g.Grade
FROM student s
RIGHT JOIN grades g ON s.Student_ID = g.Course_ID;


SELECT s1.Name, s2.Name AS Duplicate
FROM student s1
JOIN student s2 ON s1.Phone_Number = s2.Phone_Number AND s1.Student_ID <> s2.Student_ID;

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

INSERT INTO student (Student_ID, Name, Enrollment_Number, Email, Phone_Number)
VALUES 
(1, 'John Doe', '2023001', 'john@example.com', '1234567890'),
(2, 'Jane Smith', '2023002', 'jane@example.com', '2345678901'),
(3, 'Alice Johnson', '2023003', 'alice@example.com', '3456789012');

INSERT INTO courses (Course_ID, Course_Name, Credits, Instructor_Name, Semester)
VALUES 
(1, 'Data Structures', 3, 'Prof. Mike', 1),
(2, 'Database Systems', 4, 'Prof. Emma', 2),
(3, 'Operating Systems', 3, 'Prof. John', 1);

INSERT INTO assignments (Assignment_Title, Course_ID, Submission_Date, Marks_Assigned, Status)
VALUES 
('Assignment 1', 1, '2025-04-10', 100, 'Pending'),
('Assignment 2', 2, '2025-04-15', 100, 'Completed'),
('Assignment 3', 3, '2025-04-20', 100, 'Pending');

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
('Prof. Mike', 'Student Portal', 'A portal for students to track assignments', 'JavaScript, Node.js', 'Ongoing'),
('Prof. Emma', 'Database Design', 'A project on relational database design', 'MySQL, PHP', 'Completed');

INSERT INTO skills (Skill_Name, Hours_Practiced, Proficiency_Level, Learning_Resources, Certification_Status)
VALUES 
('Python', 50, 'Intermediate', 'Online Courses, Books', 'Certified'),
('JavaScript', 40, 'Intermediate', 'Online Courses', 'Not Certified');

INSERT INTO time_management (Task_Name, Priority_Level, Activity_Type, Duration, Deadline)
VALUES 
('Study Data Structures', 'High', 'Study', 2, '2025-04-10'),
('Complete Assignment 2', 'Medium', 'Study', 3, '2025-04-15'),
('Practice Coding', 'Low', 'Coding', 1, '2025-04-20');
SELECT * FROM student;

SELECT * FROM courses;

SELECT * FROM assignments;

SELECT * FROM exams;

SELECT * FROM grades;

SELECT * FROM projects;

SELECT * FROM skills;

SELECT * FROM time_management;

SELECT * FROM (
    SELECT Name FROM student
    UNION
    SELECT Instructor_Name FROM courses
) AS union_result;

SELECT * FROM (
    SELECT Name FROM student
    INNER JOIN courses ON student.Name = courses.Instructor_Name
) AS intersect_result;

SELECT * FROM (
    SELECT Name FROM student
    WHERE Name NOT IN (SELECT Instructor_Name FROM courses)
) AS except_result;

SELECT * FROM (
    SELECT a.Assignment_Title, c.Course_Name, a.Submission_Date
    FROM assignments a
    INNER JOIN courses c ON a.Course_ID = c.Course_ID
) AS assignment_details;

SELECT * FROM (
    SELECT s.Name, g.Grade
    FROM student s
    LEFT JOIN grades g ON s.Student_ID = g.Course_ID
) AS student_grades;

SELECT * FROM (
    SELECT c.Course_Name, a.Assignment_Title
    FROM assignments a
    RIGHT JOIN courses c ON a.Course_ID = c.Course_ID
) AS course_assignments;

SELECT * FROM (
    SELECT s.Name, g.Grade
    FROM student s
    LEFT JOIN grades g ON s.Student_ID = g.Course_ID
    UNION
    SELECT s.Name, g.Grade
    FROM student s
    RIGHT JOIN grades g ON s.Student_ID = g.Course_ID
) AS full_student_grades;

SELECT * FROM (
    SELECT s1.Name, s2.Name AS Duplicate
    FROM student s1
    JOIN student s2 ON s1.Phone_Number = s2.Phone_Number AND s1.Student_ID <> s2.Student_ID
) AS duplicate_students;

SELECT * FROM student_grades;

CALL list_assignments();
