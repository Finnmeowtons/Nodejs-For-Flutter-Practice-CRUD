const http = require("http");
const studentController = require("./Controller/studentController");
const cors = require("cors");

const server = http.createServer((req, res) => {
  cors()(req, res, () => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === 'GET' && req.url === '/student') {
      studentController.getAllStudents(req, res);
    } else if (req.method === 'POST' && req.url === '/student/create') {
      studentController.createStudent(req, res);
    } else if (req.method === 'PUT' && req.url.startsWith('/student/')) {
      studentController.updateStudent(req, res);
    } else if (req.method === 'DELETE' && req.url.startsWith('/student/')) {
      studentController.deleteStudent(req, res);
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  });
});



const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});