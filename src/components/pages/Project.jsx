import { useEffect, useState } from 'react';
import styles from './Project.module.css'
import { useParams } from 'react-router-dom';
import Loading from '../layout/Loading';
import Container from '../layout/Container';
function Project() {

    const { id } = useParams() // PEGO O ID QUE VEM PELA URL
    console.log(id);
    const [project, setProject] = useState([]);
    const [showProjectForm, setShowProjectForm] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(resp => resp.json())
            .then(data => setProject(data))
            .catch(err => console.log(err))
        }, 300)
    }, [id])

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm);
    }

    return (
        <>
            {project.name ? (
                <div className={styles.project_details}>
                    <Container customClass="column">  
                        <div className={styles.details_container}>
                            <h1>Projeto: {project.name}</h1>
                            <button className={styles.btn} onClick={toggleProjectForm}>
                                {!showProjectForm ? "Editar Projeto" : "Fechar"} 
                            </button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p><span>Categoria:</span> {project.category.name}</p>
                                    <p><span>Total do Orçamento:</span> {project.budget}</p>
                                    <p><span>Total do Utilizado:</span> {project.cost}</p>
                                </div>
                            ) : (
                                <div className={styles.project_info}>
                                    <p>FORM</p>
                                </div>
                            )}
                        </div>

                    </Container>
                </div>
            ) : (
                <Loading/>
            )}
        </>
    )
}

export default Project;