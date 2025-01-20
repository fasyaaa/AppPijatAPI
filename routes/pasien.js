const express = require("express");
const router = express.Router();

const{ body, validationResult } = require("express-validator");
const connection = require("../config/database");

// Ambil data pasien lengkap
router.get("/", (req, res) => {
    connection.query("SELECT * FROM pasien ORDER BY id_pasien DESC", (err, rows) => {
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

// Simpan data pasien
router.post("/store",
    [
        body("id_pasien").notEmpty(),
        body("nama_pasien").notEmpty(),
        body("alamat").notEmpty(),
        body("no_telp").notEmpty(),
        body("tgl_lahir").notEmpty(),
        body("riwayat_medis").notEmpty()
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
            id_pasien: req.body.id_pasien,
            nama_pasien: req.body.nama_pasien,
            alamat: req.body.alamat,
            no_telp: req.body.no_telp,
            tgl_lahir: req.body.tgl_lahir,
            riwayat_medis: req.body.riwayat_medis
        };
        connection.query("INSERT INTO pasien SET ?", formData, (err, rows) => {
            if(err){
                return res.status(500).json({
                    status: false,
                    message: "Internal Error",
                    errors: err
                });
                } else {
                    return res.status(201).json({
                        status: true,
                        message: "Data Pasien Created",
                        data:formData
                    });
            }
        });
    }
);

// Detail data pasien
router.get("/:id_pasien", (req, res) => {
    const id_pasien = req.params.id_pasien;
    connection.query(
        "SELECT * FROM pasien WHERE id_pasien = ? ",
        [id_pasien],
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
                        message: "Pasien Not Found"
                    });
                }  
            }
        }
    );    
});

// Update data pasien
router.put("/:id_pasien",
    [
        body("id_pasien").notEmpty(),
        body("nama_pasien").notEmpty(),
        body("alamat").notEmpty(),
        body("no_telp").notEmpty(),
        body("tgl_lahir").notEmpty(),
        body("riwayat_medis").notEmpty() 
    ],
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({
                status: false,
                message: errors.array()
            });
        }
        let id_pasien = req.params.id_pasien;
        let formData = {
            id_pasien: req.body.id_pasien,
            nama_pasien: req.body.nama_pasien,
            alamat: req.body.alamat,
            no_telp: req.body.no_telp,
            tgl_lahir: req.body.tgl_lahir,
            riwayat_medis: req.body.riwayat_medis
        };
        connection.query(
            "UPDATE pasien SET ? WHERE id_pasien = ?",
            [formData, id_pasien],
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

// Hapus data pasien
router.delete("/:id_pasien", (req, res) => {
    let id_pasien = req.params.id_pasien;
    connection.query("DELETE FROM pasien WHERE id_pasien = ? ", id_pasien, (err, rows) => {
        if(err){
            return res.status(500).json({
                status: false, 
                message: "Internal Server Error"
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Data Pasien Berhasil di Hapus"
            });
        }
    });
});

module.exports = router;