const connection = require("../db_connection");

// Get Student
exports.getAllStudents = (req, res) => {
    const query = 'SELECT * FROM students';
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error query", err);
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return
        }

        res.end(JSON.stringify(results.map(student => {
            return {
                id: student.id.toString(),
                first_name: student.first_name,
                last_name: student.last_name,
                course: student.course,
                year: student.year,
                enrolled: student.enrolled
            }
        })));
    })
}

// Post Student
exports.createStudent = (req, res) => {
    if (req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const newStudent = JSON.parse(body);

                const query = 'INSERT INTO `students`(`first_name`, `last_name`, `course`, `year`, `enrolled`) VALUES (?, ?, ?, ?, ?);'

                const values = [
                    newStudent.first_name,
                    newStudent.last_name,
                    newStudent.course,
                    newStudent.year,
                    newStudent.enrolled
                ];

                connection.query(query, values, (err, result) => {
                    console.log("Created Student: ", result)
                    if (err) {
                        console.error("Internal Server Error: ", err)
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: "Internal Server Error" }))
                        return
                    }

                    res.statusCode = 201;
                    res.end(JSON.stringify({ message: 'Successfully created student' }));
                });
            } catch (error) {
                console.error("ERROR Parsing JSON ", error);
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "invalid JSON data" }));
            }
        });
    }
}

// PUT Student
exports.updateStudent = (req, res) => {
    if (req.method === 'PUT') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const updatedStudent = JSON.parse(body);


                const updateQuery = 'UPDATE students set first_name = ?, last_name = ?, course = ?, year = ?, enrolled = ? where id = ?';
                console.log(updatedStudent)
                console.log(updatedStudent.enrolled)
                const values = [
                    updatedStudent.first_name,
                    updatedStudent.last_name,
                    updatedStudent.course,
                    updatedStudent.year,
                    updatedStudent.enrolled.toString(),
                    updatedStudent.id
                ];

                connection.query(updateQuery, values, (err, results) => {
                    if (err) {
                        console.error("Error updating student ", err)
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        return
                    }

                    if (results.affectedRows === 0) {
                        res.statusCode = 404
                        res.end(JSON.stringify({ error: "Student not found" }));
                    } else {
                        console.log(results);
                        res.statusCode = 200;
                        res.end(JSON.stringify({ message: "Student updated successfully" }))
                    }
                });
            } catch (error) {
                console.error(error)
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "Invalid JSON Data" }))
            }
        })
    }
}

exports.deleteStudent = (req, res) => {
    const studentId = req.url.split('/')[2];
    console.log(studentId);

    const deleteQuery = "DELETE FROM students WHERE id = ?";

    connection.query(deleteQuery, studentId, (err, result) => {
        if (err) {
            console.error("Error delete student: ", err)
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Internal Server Error" }))
            return
        }

        if (result.affectedRows === 0) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Student not found" }));
        } else {
            res.statusCode = 200;
            res.end(JSON.stringify({ message: "Successfully deleted student" }))
        }
    })

}