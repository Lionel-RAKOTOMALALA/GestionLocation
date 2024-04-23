import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

function UpdateLocationModal({ show, handleClose, initialFormValues }) {
    const [formData, setFormData] = useState(initialFormValues);

    useEffect(() => {
        // Effectuer une requête GET pour récupérer les détails de la location à partir de l'API
        axios.get(`http://localhost:8081/${initialFormValues.num_loc}`)
            .then(res => {
                setFormData(res.data[0]); // Mettre à jour les données du formulaire avec les détails récupérés
                console.log(res.data[0]);
            })
            .catch(err => console.error(err));
    }, [initialFormValues.num_loc]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        axios.put(`http://localhost:8081/${formData.num_loc}`, formData)
            .then(res => {
                console.log(res.data);
                handleClose();
            })
            .catch(err => console.error(err));
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Modifier l'emplacement</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="mb-3">
                        <label htmlFor="num_loc" className="form-label">Numéro</label>
                        <input type="text" className="form-control" id="num_loc" name="num_loc" value={formData.num_loc} onChange={handleChange} readOnly />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="nom_loc" className="form-label">Nom</label>
                        <input type="text" className="form-control" id="nom_loc" name="nom_loc" value={formData.nom_loc} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="design_voiture" className="form-label">Designation de voiture</label>
                        <input type="text" className="form-control" id="design_voiture" name="design_voiture" value={formData.design_voiture} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="nbrjour" className="form-label">Nombre de jour</label>
                        <input type="text" className="form-control" id="nbrjour" name="nbrjour" value={formData.nbrjour} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="t_journalier" className="form-label">Taxe Journalier</label>
                        <input type="text" className="form-control" id="t_journalier" name="t_journalier" value={formData.t_journalier} onChange={handleChange} />
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Annuler
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Enregistrer
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UpdateLocationModal;
