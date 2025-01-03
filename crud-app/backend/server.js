const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 5000; // Define port number

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "placement_services",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");

  // Create students table
  const createStudentsTableQuery = `
  CREATE TABLE IF NOT EXISTS students (
    USN VARCHAR(10) PRIMARY KEY,
    FName VARCHAR(50) NOT NULL,
    MName VARCHAR(50),
    LName VARCHAR(50),
    PhNo VARCHAR(15),
    Email VARCHAR(100),
    Dept VARCHAR(50),
    AcademicYear VARCHAR(20),
    CGPA DECIMAL(4,2),
    BackLogs INT,
    offer_letter VARCHAR(255),
    internship_letter VARCHAR(255)
  )`;

  db.query(createStudentsTableQuery, (err) => {
    if (err) {
      console.error("Error creating students table:", err);
      return;
    }
    console.log("Students table ready");
  });
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// API Endpoints

// 1. Student Management
// Update the students POST route to match your frontend form fields
app.post(
  "/api/students",
  upload.fields([
    { name: "offer_letter", maxCount: 1 },
    { name: "internship_letter", maxCount: 1 },
  ]),
  (req, res) => {
    const {
      USN,
      FName,
      MName,
      LName,
      PhNo,
      Email,
      Dept,
      AcademicYear,
      CGPA,
      BackLogs,
    } = req.body;

    const offer_letter = req.files?.["offer_letter"]
      ? req.files["offer_letter"][0].filename
      : null;
    const internship_letter = req.files?.["internship_letter"]
      ? req.files["internship_letter"][0].filename
      : null;

    const query = `
    INSERT INTO students 
    (USN, FName, MName, LName, PhNo, Email, Dept, AcademicYear, CGPA, BackLogs, offer_letter, internship_letter) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    db.query(
      query,
      [
        USN,
        FName,
        MName,
        LName,
        PhNo,
        Email,
        Dept,
        AcademicYear,
        CGPA,
        BackLogs,
        offer_letter,
        internship_letter,
      ],
      (err, result) => {
        if (err) {
          console.error("Error adding student:", err);
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          success: true,
          message: "Student added successfully",
          data: result,
        });
      }
    );
  }
);

// Add these routes for updating and deleting students
// Update the students PUT route
app.put(
  "/api/students/:usn",
  upload.fields([
    { name: "offer_letter", maxCount: 1 },
    { name: "internship_letter", maxCount: 1 },
  ]),
  (req, res) => {
    const usn = req.params.usn;
    const {
      FName,
      MName,
      LName,
      PhNo,
      Email,
      Dept,
      AcademicYear,
      CGPA,
      BackLogs,
    } = req.body;

    // Handle file uploads
    const offer_letter = req.files?.["offer_letter"]
      ? req.files["offer_letter"][0].filename
      : null;
    const internship_letter = req.files?.["internship_letter"]
      ? req.files["internship_letter"][0].filename
      : null;

    // Build the update query dynamically
    let query = `
    UPDATE students 
    SET FName = ?, MName = ?, LName = ?, PhNo = ?, Email = ?, 
        Dept = ?, AcademicYear = ?, CGPA = ?, BackLogs = ?
  `;
    let params = [
      FName,
      MName,
      LName,
      PhNo,
      Email,
      Dept,
      AcademicYear,
      CGPA,
      BackLogs,
    ];

    // Add file fields to query if new files were uploaded
    if (offer_letter) {
      query += ", offer_letter = ?";
      params.push(offer_letter);
    }
    if (internship_letter) {
      query += ", internship_letter = ?";
      params.push(internship_letter);
    }

    query += " WHERE USN = ?";
    params.push(usn);

    // Execute the update query
    db.query(query, params, (err, result) => {
      if (err) {
        console.error("Error updating student:", err);
        res.status(500).json({ error: err.message });
        return;
      }

      // If old files exist, you might want to delete them
      if (offer_letter || internship_letter) {
        // Get the old file names
        db.query(
          "SELECT offer_letter, internship_letter FROM students WHERE USN = ?",
          [usn],
          (err, rows) => {
            if (!err && rows.length > 0) {
              const oldFiles = rows[0];
              // Delete old files if they exist
              if (offer_letter && oldFiles.offer_letter) {
                fs.unlink(`uploads/${oldFiles.offer_letter}`, (err) => {
                  if (err)
                    console.error("Error deleting old offer letter:", err);
                });
              }
              if (internship_letter && oldFiles.internship_letter) {
                fs.unlink(`uploads/${oldFiles.internship_letter}`, (err) => {
                  if (err)
                    console.error("Error deleting old internship letter:", err);
                });
              }
            }
          }
        );
      }

      res.json({
        success: true,
        message: "Student updated successfully",
        data: result,
      });
    });
  }
);
app.delete("/api/students/:usn", (req, res) => {
  const usn = req.params.usn;
  const query = "DELETE FROM students WHERE USN = ?";

  db.query(query, [usn], (err, result) => {
    if (err) {
      console.error("Error deleting student:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      success: true,
      message: "Student deleted successfully",
      data: result,
    });
  });
});

// Update the GET route to remove the ORDER BY clause
app.get("/api/students", (req, res) => {
  const query = "SELECT * FROM students"; // Removed ORDER BY created_at DESC

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching students:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
  });
});

// 2. Company Management
// First, modify the companies table structure
const createCompaniesTable = `
CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    job_role VARCHAR(100),
    description TEXT,
    package DECIMAL(10,2)
)`;

// Then create placement_drives table with triggers
const createPlacementDriveTableQuery1 = `
CREATE TABLE IF NOT EXISTS placement_drives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    date DATE NOT NULL,
    total_candidates INT NOT NULL DEFAULT 0,
    placed_candidates INT NOT NULL DEFAULT 0,
    success_rate DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
)`;

// Drop existing triggers if they exist
const dropTriggers = `
DROP TRIGGER IF EXISTS before_placement_drive_insert;
DROP TRIGGER IF EXISTS before_placement_drive_update;
`;

// Create new triggers with DELIMITER
const createPlacementDriveTriggers = `
CREATE TRIGGER before_placement_drive_insert 
BEFORE INSERT ON placement_drives
FOR EACH ROW 
BEGIN
    IF NEW.total_candidates > 0 THEN
        SET NEW.success_rate = (NEW.placed_candidates / NEW.total_candidates) * 100;
    ELSE
        SET NEW.success_rate = 0;
    END IF;
END;

CREATE TRIGGER before_placement_drive_update
BEFORE UPDATE ON placement_drives
FOR EACH ROW 
BEGIN
    IF NEW.total_candidates > 0 THEN
        SET NEW.success_rate = (NEW.placed_candidates / NEW.total_candidates) * 100;
    ELSE
        SET NEW.success_rate = 0;
    END IF;
END;
`;

// Execute queries in sequence
db.query(createCompaniesTable, (err) => {
  if (err) {
    console.error("Error creating companies table:", err);
    return;
  }
  console.log("Companies table ready");

  db.query(dropTriggers, (err) => {
    if (err) {
      console.error("Error dropping triggers:", err);
      return;
    }
    console.log("Old triggers dropped");

    db.query(createPlacementDriveTableQuery, (err) => {
      if (err) {
        console.error("Error creating placement drives table:", err);
        return;
      }
      console.log("Placement drives table created");

      db.query(createPlacementDriveTriggers, (err) => {
        if (err) {
          console.error("Error creating triggers:", err);
          return;
        }
        console.log("Success rate triggers created successfully");
      });
    });
  });
});

// GET all companies
app.get("/api/companies", (req, res) => {
  const query = "SELECT * FROM companies ORDER BY id";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching companies:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
  });
});

// POST new company
app.post("/api/companies", (req, res) => {
  const { name, job_role, description, package } = req.body;

  if (!name) {
    res.status(400).json({ error: "Company name is required" });
    return;
  }

  const query = `
    INSERT INTO companies 
    (name, job_role, description, package) 
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [name, job_role, description, package], (err, result) => {
    if (err) {
      console.error("Error adding company:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      success: true,
      message: "Company added successfully",
      data: { id: result.insertId, ...req.body },
    });
  });
});

// Update PUT route to use company ID instead of name
app.put("/api/companies/:id", (req, res) => {
  const companyId = req.params.id;
  const { name, job_role, description, package } = req.body;

  const query = `
    UPDATE companies 
    SET name = ?,
        job_role = ?, 
        description = ?, 
        package = ? 
    WHERE id = ?
  `;

  db.query(
    query,
    [name, job_role, description, package, companyId],
    (err, result) => {
      if (err) {
        console.error("Error updating company:", err);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        success: true,
        message: "Company updated successfully",
        data: { id: companyId, ...req.body },
      });
    }
  );
});

// Update DELETE route to use company ID
app.delete("/api/companies/:id", (req, res) => {
  const companyId = req.params.id;
  const query = "DELETE FROM companies WHERE id = ?";

  db.query(query, [companyId], (err, result) => {
    if (err) {
      console.error("Error deleting company:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      success: true,
      message: "Company deleted successfully",
      data: result,
    });
  });
});

// 3. Placement Drive Management
// First, drop the existing table and triggers
const dropQueries = `
DROP TABLE IF EXISTS placement_drives;
DROP TRIGGER IF EXISTS before_placement_drive_insert;
DROP TRIGGER IF EXISTS before_placement_drive_update;
`;

// Create the placement drives table with success_rate column
const createPlacementDriveTableQuery = `
CREATE TABLE placement_drives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    date DATE NOT NULL,
    total_candidates INT NOT NULL DEFAULT 0,
    placed_candidates INT NOT NULL DEFAULT 0,
    success_rate DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
)`;

// Create the triggers for automatic success_rate calculation
const createTriggers = `
CREATE TRIGGER before_placement_drive_insert 
BEFORE INSERT ON placement_drives
FOR EACH ROW 
BEGIN
    IF NEW.total_candidates > 0 THEN
        SET NEW.success_rate = (NEW.placed_candidates / NEW.total_candidates) * 100;
    ELSE
        SET NEW.success_rate = 0;
    END IF;
END;

CREATE TRIGGER before_placement_drive_update
BEFORE UPDATE ON placement_drives
FOR EACH ROW 
BEGIN
    IF NEW.total_candidates > 0 THEN
        SET NEW.success_rate = (NEW.placed_candidates / NEW.total_candidates) * 100;
    ELSE
        SET NEW.success_rate = 0;
    END IF;
END;
`;

// Execute the queries in sequence
db.query(dropQueries, (err) => {
  if (err) {
    console.error("Error dropping existing table and triggers:", err);
    return;
  }
  console.log("Existing table and triggers dropped");

  db.query(createPlacementDriveTableQuery, (err) => {
    if (err) {
      console.error("Error creating table:", err);
      return;
    }
    console.log("Placement drives table created");

    db.query(createTriggers, (err) => {
      if (err) {
        console.error("Error creating triggers:", err);
        return;
      }
      console.log("Success rate triggers created successfully");
    });
  });
});

// Update GET endpoint to properly join with companies table
app.get("/api/placement-drives", (req, res) => {
  const query = `
    SELECT 
      pd.id,
      pd.company_id,
      c.name as company_name,
      pd.date,
      pd.total_candidates,
      pd.placed_candidates,
      pd.success_rate,
      pd.created_at
    FROM placement_drives pd
    JOIN companies c ON pd.company_id = c.id
    ORDER BY pd.date DESC
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching placement drives:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log("Fetched placement drives:", result); // Debug log
    res.json(result);
  });
});

// Add some sample data (optional, for testing)
const addSampleData = () => {
  const sampleData = [
    {
      company_id: 1, // Make sure this company_id exists in your companies table
      date: "2024-03-15",
      total_candidates: 100,
      placed_candidates: 75,
    },
    {
      company_id: 2, // Make sure this company_id exists in your companies table
      date: "2024-03-10",
      total_candidates: 80,
      placed_candidates: 60,
    },
  ];

  const insertQuery = `
    INSERT INTO placement_drives 
    (company_id, date, total_candidates, placed_candidates)
    VALUES (?, ?, ?, ?)
  `;

  sampleData.forEach((data) => {
    db.query(
      insertQuery,
      [
        data.company_id,
        data.date,
        data.total_candidates,
        data.placed_candidates,
      ],
      (err) => {
        if (err) {
          console.error("Error inserting sample data:", err);
        }
      }
    );
  });
};

// Call this after table creation if you want sample data
// Uncomment the next line to add sample data
// addSampleData();

// Update your POST endpoint to use the trigger
app.post("/api/placement-drives", (req, res) => {
  const { company_id, date, total_candidates, placed_candidates } = req.body;

  if (!company_id || !date) {
    res.status(400).json({ error: "Company and date are required" });
    return;
  }

  const insertQuery = `
    INSERT INTO placement_drives 
    (company_id, date, total_candidates, placed_candidates) 
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    insertQuery,
    [company_id, date, total_candidates || 0, placed_candidates || 0],
    (err, result) => {
      if (err) {
        console.error("Error adding placement drive:", err);
        res.status(500).json({ error: err.message });
        return;
      }

      // Fetch the inserted record with calculated success_rate
      const getInsertedRecord = `
      SELECT pd.*, c.name as company_name 
      FROM placement_drives pd
      JOIN companies c ON pd.company_id = c.id
      WHERE pd.id = ?
    `;

      db.query(getInsertedRecord, [result.insertId], (err, records) => {
        if (err) {
          console.error("Error fetching inserted record:", err);
          res.status(500).json({ error: err.message });
          return;
        }

        res.json({
          success: true,
          message: "Placement drive added successfully",
          data: records[0],
        });
      });
    }
  );
});

// GET companies available for placement drives
app.get("/api/companies-for-drives", (req, res) => {
  const query = `
    SELECT id, name 
    FROM companies 
    ORDER BY name ASC
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching companies:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
  });
});

// PUT update placement drive with validation
app.put("/api/placement-drives/:id", (req, res) => {
  const driveId = req.params.id;
  const { company_id, date, total_candidates, placed_candidates } = req.body;

  // First check if company exists
  const checkCompanyQuery = "SELECT id FROM companies WHERE id = ?";

  db.query(checkCompanyQuery, [company_id], (err, result) => {
    if (err) {
      console.error("Error checking company:", err);
      res.status(500).json({ error: err.message });
      return;
    }

    if (result.length === 0) {
      res.status(404).json({ error: "Company not found" });
      return;
    }

    // If company exists, update placement drive
    const updateQuery = `
      UPDATE placement_drives 
      SET company_id = ?,
          date = ?, 
          total_candidates = ?, 
          placed_candidates = ?
      WHERE id = ?
    `;

    db.query(
      updateQuery,
      [
        company_id,
        date,
        total_candidates || 0,
        placed_candidates || 0,
        driveId,
      ],
      (err, result) => {
        if (err) {
          console.error("Error updating placement drive:", err);
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          success: true,
          message: "Placement drive updated successfully",
          data: { id: driveId, ...req.body },
        });
      }
    );
  });
});

// DELETE placement drive
app.delete("/api/placement-drives/:id", (req, res) => {
  const driveId = req.params.id;
  const query = "DELETE FROM placement_drives WHERE id = ?";

  db.query(query, [driveId], (err, result) => {
    if (err) {
      console.error("Error deleting placement drive:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      success: true,
      message: "Placement drive deleted successfully",
      data: result,
    });
  });
});

// GET placement drive statistics
app.get("/api/placement-drives/stats", (req, res) => {
  const query = `
    SELECT 
      c.name as company_name,
      COUNT(*) as total_drives,
      SUM(pd.total_candidates) as total_candidates,
      SUM(pd.placed_candidates) as total_placed,
      AVG(pd.success_rate) as success_rate
    FROM placement_drives pd
    JOIN companies c ON pd.company_id = c.id
    GROUP BY c.id, c.name
    ORDER BY success_rate DESC
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching placement drive statistics:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log("All tables are ready:");
  console.log("- Students table ready");
  console.log("- Companies table ready");
  console.log("- Placement drives table ready");
});
