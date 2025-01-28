const express = require("express");
const router = express.Router();

const{ body, validationResult } = require("express-validator");
const connection = require("../config/database");

// Ambil data jenisTrapi lengkap
router.get("/", (req, res) => {
    connection.query("SELECT * FROM jenisTrapi ORDER BY id_jenisTrapi DESC", (err, rows) => {
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

// Simpan data jenisTrapi
router.post("/store",
    [
        body("id_jenisTrapi").notEmpty(),
        body("nama_jenisTrapi").notEmpty(),
        body("deskripsi_jenisTrapi").notEmpty(),
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
            id_jenisTrapi: req.body.id_jenisTrapi,
            nama_jenisTrapi: req.body.nama_jenisTrapi,
            deskripsi_jenisTrapi: req.body.deskripsi_jenisTrapi,
        };
        connection.query("INSERT INTO jenisTrapi SET ?", formData, (err, rows) => {
            if(err){
                return res.status(500).json({
                    status: false,
                    message: "Internal Error",
                    errors: err
                });
                } else {
                    return res.status(201).json({
                        status: true,
                        message: "Data jenisTrapi Created",
                        data:formData
                    });
            }
        });
    }
);

// Detail data jenisTrapi
router.get("/:id_jenisTrapi", (req, res) => {
    let id_jenisTrapi = req.params.id_jenisTrapi;
    connection.query(
        "SELECT * FROM jenisTrapi WHERE id_jenisTrapi = ? ",
        [id_jenisTrapi],
        (err, rows) => {
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
                        message: "jenisTrapi Not Found"
                    });
                }  
            }
        }
    );    
});

// Update data jenisTrapi
router.put(
    "/:id_jenisTrapi",
    [
        body("id_jenisTrapi").notEmpty(),
        body("nama_jenisTrapi").notEmpty(),
        body("deskripsi_jenisTrapi").notEmpty(),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({
                status: false,
                message: errors.array()
            });
        }
        let id_jenisTrapi = req.params.id_jenisTrapi;
        let formData = {
            id_jenisTrapi: req.body.id_jenisTrapi,
            nama_jenisTrapi: req.body.nama_jenisTrapi,
            deskripsi_jenisTrapi: req.body.deskripsi_jenisTrapi,
        };
        connection.query(
            "UPDATE jenisTrapi SET ? WHERE id_jenisTrapi = ?",
            [formData, id_jenisTrapi],
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

// Hapus data jenisTrapi
router.delete("/:id_jenisTrapi", (req, res) => {
    let id_jenisTrapi = req.params.id_jenisTrapi;
    connection.query("DELETE FROM jenisTrapi WHERE id_jenisTrapi = ? ", id_jenisTrapi, (err, rows) => {
        if(err){
            return res.status(500).json({
                status: false, 
                message: "Internal Server Error"
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Data jenis Terapi Berhasil di Hapus"
            });
        }
    });
});

module.exports = router;