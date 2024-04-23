import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, Card } from 'react-bootstrap';
import LocationModal from './LocationModal';
import UpdateLocationModal from './UpdateLocationModal';
import Volatiana from './Vola.jpg';

function Location() {
    const [location, setLocation] = useState([]);
    const [totalRent, setTotalRent] = useState(0);
    const [minRent, setMinRent] = useState(0);
    const [maxRent, setMaxRent] = useState(0);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [initialFormValues, setInitialFormValues] = useState(null);
    const [selectedLocationId, setSelectedLocationId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false); // State pour le modal de mise à jour
    const [selectedLocation, setSelectedLocation] = useState(null); // State pour stocker les données de l'emplacement sélectionné

    const fetchLocations = () => {
        axios.get('http://localhost:8081/')
            .then(res => {
                setLocation(res.data.locations);
                setTotalRent(res.data.totalRent);
                setMinRent(res.data.minRent);
                setMaxRent(res.data.maxRent);
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleOpenFormModal = () => {
        setInitialFormValues(null);
        setSelectedLocation(null);
        setIsFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setSelectedLocation(null);
        fetchLocations();
    };

    const handleDeleteLocation = (locationId) => {
        setSelectedLocationId(locationId);
        setShowConfirmModal(true);
    };

    const handleOpenUpdateModal = (data) => {
        setSelectedLocation(data);
        setShowUpdateModal(true);
    };

    const confirmDeleteLocation = () => {
        axios.delete(`http://localhost:8081/${selectedLocationId}`)
            .then(res => {
                console.log(res.data);
                setShowConfirmModal(false);
                fetchLocations();
            })
            .catch(err => console.error(err));
    };

    const cancelDeleteLocation = () => {
        setShowConfirmModal(false);
    };

    return (
        <div className='d-flex vh-100 bg-dark justify-content-center align-items-center'>
            <div className='w-75 bg-white rounded p-3'>
                <Button className='btn btn-success' onClick={handleOpenFormModal}> Ajouter </Button>
                <div className="row mt-3">
                    <div className="col-md-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>Total</Card.Title>
                                <Card.Text>
                                    {totalRent} Ariary
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="col-md-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>Minimum</Card.Title>
                                <Card.Text>
                                    {minRent}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="col-md-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>Maximum</Card.Title>
                                <Card.Text>
                                    {maxRent}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
                <table className='table mt-3'>
                    <thead>
                        <tr>
                            <th>Numéro</th>
                            <th>Nom de location</th>
                            <th>Designation de voiture</th>
                            <th>Nombre de jour</th>
                            <th>Taxe Journalier</th>
                            <th>Loyer</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            location.map((data, i) => (
                                <tr key={i}>
                                    <td>{data.num_loc}</td>
                                    <td>{data.nom_loc}</td>
                                    <td>{data.design_voiture}</td>
                                    <td>{data.nbrjour}</td>
                                    <td>{data.t_journalier}</td>
                                    <td>{data.loyer}</td>
                                    <td className="d-flex align-items-center">
                                        <button className='btn btn-primary me-2' onClick={() => handleOpenUpdateModal(data)}>Modifier</button>
                                        <button className='btn btn-danger' onClick={() => handleDeleteLocation(data.num_loc)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <LocationModal show={isFormModalOpen} handleClose={handleCloseFormModal} />
                
                {/* Utilisation du modal de mise à jour */}
                {selectedLocation && (
                    <UpdateLocationModal 
                        show={showUpdateModal} 
                        handleClose={() => {setShowUpdateModal(false); setSelectedLocation(null);fetchLocations();}} 
                        initialFormValues={selectedLocation} 
                    />
                )}

                <Modal show={showConfirmModal} onHide={cancelDeleteLocation}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation de suppression</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Êtes-vous sûr de vouloir supprimer cet emplacement ?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={cancelDeleteLocation}>Annuler</Button>
                        <Button variant="danger" onClick={confirmDeleteLocation}>Supprimer</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default Location;
