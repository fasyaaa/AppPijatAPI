const express = require("express");
const router = express.Router();

const{ body, validationResult } = require("express-validator");
const connection = require("../config/database");

// Ambil data sesi lengkap
router.get("/", (req, res) => {
    connection.query("SELECT * FROM sesi ORDER BY id_sesi DESC", (err, rows) => {
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

// Simpan data sesi
router.post("/store",
    [
        body("id_sesi").notEmpty(),
        body("id_pasien").notEmpty(),
        body("id_terapis").notEmpty(),
        body("id_jenisTrapi").notEmpty(),
        body("tanggal_sesi").notEmpty(),
        body("catatan_sesi").notEmpty(),
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
            id_sesi: req.body.id_sesi,
            id_pasien: req.body.id_pasien,
            id_terapis: req.body.id_terapis,
            id_jenisTrapi: req.body.id_jenisTrapi,
            tanggal_sesi: req.body.tanggal_sesi,
            catatan_sesi: req.body.catatan_sesi,
        };
        connection.query("INSERT INTO sesi SET ?", formData, (err, rows) => {
            if(err){
                return res.status(500).json({
                    status: false,
                    message: "Internal Error",
                    errors: err
                });
                } else {
                    return res.status(201).json({
                        status: true,
                        message: "Data sesi Created",
                        data:formData
                    });
            }
        });
    }
);

// Detail data sesi
router.get("/:id_sesi", (req, res) => {
    let id_sesi = req.params.id_sesi;
    connection.query(
        "SELECT * FROM sesi WHERE id_sesi = ? ",
        [id_sesi],
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
                        message: "sesi Not Found"
                    });
                }  
            }
        }
    );    
});

// Update data sesi
router.put(
    "/:id_sesi",
    [
        body("id_sesi").notEmpty(),
        body("id_pasien").notEmpty(),
        body("id_terapis").notEmpty(),
        body("id_jenisTrapi").notEmpty(),
        body("tanggal_sesi").notEmpty(),
        body("catatan_sesi").notEmpty(),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({
                status: false,
                message: errors.array()
            });
        }
        let id_sesi = req.params.id_sesi;
        let formData = {
            id_sesi: req.body.id_sesi,
            id_pasien: req.body.id_pasien,
            id_terapis: req.body.id_terapis,
            id_jenisTrapi: req.body.id_jenisTrapi,
            tanggal_sesi: req.body.tanggal_sesi,
            catatan_sesi: req.body.catatan_sesi,
        };
        connection.query(
            "UPDATE sesi SET ? WHERE id_sesi = ?",
            [formData, id_sesi],
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

// Hapus data sesi
router.delete("/:id_sesi", (req, res) => {
    let id_sesi = req.params.id_sesi;
    connection.query("DELETE FROM sesi WHERE id_sesi = ? ", id_sesi, (err, rows) => {
        if(err){
            return res.status(500).json({
                status: false, 
                message: "Internal Server Error"
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Data sesi Berhasil di Hapus"
            });
        }
    });
});

module.exports = router;