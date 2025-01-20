const express = require("express");
const router = express.Router();

const{ body, validationResult } = require("express-validator");
const connection = require("../config/database");

// Ambil data terapis lengkap
router.get("/", (req, res) => {
    connection.query("SELECT * FROM terapis ORDER BY id_terapis DESC", (err, rows) => {
        if(!err){
            return res.status(200).json({
                status: true,
                message: "Success",
                data: rows
            })
        } else {
            console.error("Error fetching patients:", err);
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
            })
        }
    })
});

// Simpan data terapis
router.post("/store",
    [
        body("id_terapis").notEmpty(),
        body("nama_terapis").notEmpty(),
        body("spesialis").notEmpty(),
        body("no_izin_prak").notEmpty(),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({
                status: false,
                message: errors.array(),
            });
        }
        let formData = {
            id_terapis: req.body.id_terapis,
            nama_terapis: req.body.nama_terapis,
            spesialis: req.body.spesialis,
            no_izin_prak: req.body.no_izin_prak,
        };
        connection.query("INSERT INTO terapis SET ?", formData, (err, rows) => {
            if(err){
                return res.status(500).json({
                    status: false,
                    message: "Internal Error",
                    errors: err
                });
                } else {
                    return res.status(201).json({
                        status: true,
                        message: "Data terapis Created",
                        data:formData
                    });
            }
        });
    }
);

// Detail data terapis
router.get("id_terapis", (req, res) => {
    let id_terapis = req.params.id_terapis;
    connection.query(
        "SELECT * FROM terapis WHERE id_terapis = ? ",
        id_terapis,
        (err, res) => {
            if(err){
                return res.status(200).json({
                    status: false,
                    message: "Internal Server Error"
                });
            } else{
                if(rows.length > 0){
                    return res.status(200).json({
                        status: true,
                        message: "Success",
                        data: rows[0]
                    });
                } else{
                    return res.status(404).json({
                        status: false,
                        message: "terapis Not Found"
                    });
                }  
            }
        }
    );    
});

// Update data terapis
router.put(
    "/:id_terapis",
    [
        body("id_terapis").notEmpty(),
        body("nama_terapis").notEmpty(),
        body("spesialis").notEmpty(),
        body("no_izin_prak").notEmpty(),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({
                status: false,
                message: errors.array()
            });
        }
        let id_terapis = req.params.id_terapis;
        let formData = {
            id_terapis: req.body.id_terapis,
            nama_terapis: req.body.nama_terapis,
            spesialis: req.body.spesialis,
            no_izin_prak: req.body.no_izin_prak,
        };
        connection.query(
            "UPDATE terapis SET ? WHERE id_terapis = ?",
            [formData, id_terapis],
            (err, rows) => {
                if(err){
                    return res.status(500).json({
                        status: false,
                        message: "Internal Server Error"
                    });
                } else {
                    return res.status(200).json({
                        status: true,
                        message: "Berhasil di Update",
                        data: formData
                    });
                }
            }
        );
    }
);

// Hapus data terapis
router.delete("/:id_terapis", (req, res) => {
    let id_terapis = req.params.id_terapis;
    connection.query("DELETE FROM terapis WHERE id_terapis = ? ", id_terapis, (err, rows) => {
        if(err){
            return res.status(500).json({
                status: false, 
                message: "Internal Server Error"
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Data terapis Berhasil di Hapus"
            });
        }
    });
});

module.exports = router;