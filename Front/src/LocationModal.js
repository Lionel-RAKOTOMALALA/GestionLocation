import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const LocationModal = ({ show, handleClose }) => {
    const [formData, setFormData] = useState({
        num_loc: '',
        nom_loc: '',
        design_voiture: '',
        nbrjour: '',
        t_journalier: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        axios.post('http://localhost:8081/', formData)
            .then(response => {
                console.log(response.data);
                // Gérer la réussite de l'ajout ici
                handleClose();
            })
            .catch(error => {
                console.error(error);
                // Gérer les erreurs ici
            });
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Ajouter un lieu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="num_loc">
                        <Form.Label>Numéro de location</Form.Label>
                        <Form.Control type="text" name="num_loc" value={formData.num_loc} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="nom_loc">
                        <Form.Label>Nom de location</Form.Label>
                        <Form.Control type="text" name="nom_loc" value={formData.nom_loc} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="design_voiture">
                        <Form.Label>Designation de voiture</Form.Label>
                        <Form.Control type="text" name="design_voiture" value={formData.design_voiture} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="nbrjour">
                        <Form.Label>Nombre de jour</Form.Label>
                        <Form.Control type="number" name="nbrjour" value={formData.nbrjour} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="t_journalier">
                        <Form.Label>Taxe Journalier</Form.Label>
                        <Form.Control type="number" name="t_journalier" value={formData.t_journalier} onChange={handleChange} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Fermer</Button>
                <Button variant="primary" onClick={handleSubmit}>Ajouter</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LocationModal;
