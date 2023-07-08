import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Loading from '../layout/Loading';
import Container from '../layout/Container';
import ProjectForm from '../project/ProjectForm';
import ServiceForm from '../service/ServiceForm'
import ServiceCard from '../service/ServiceCard';
import Message from '../layout/Message';
import styles from './Project.module.css'


function Project() {

    const { id } = useParams() // PEGO O ID QUE VEM PELA URL
    const [project, setProject] = useState([]);
    const [services, setServices] = useState([]);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);  
    const [message, setMessage] = useState('');
    const [type, setType] = useState('')

    useEffect(() => {
        setTimeout(() => {
            fetch(`https://api-costs-json-server.vercel.app/projects/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(resp => resp.json())
            .then((data) => {
                setProject(data)
                setServices(data.services)
            })
            .catch(err => console.log(err))
        }, 300)
    }, [id])

    function editPost(project) {
        setMessage('')

        console.log(project.budget);
        
        const numericValue = typeof project.budget === "string" ? 
        project.budget.replace("R$", "").replace(/\./g, "").replace(",", ".") : project.budget;

        console.log("NUMERIC", numericValue)

        project.budget = parseFloat(numericValue);

        console.log("DEPOIS", project.budget);

        if(project.budget < project.cost){
            setMessage("O Orçamento não pode ser maior que o custo do Projeto!");
            setType("error");
            return false;
        }

        fetch(`https://api-costs-json-server.vercel.app/projects/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(project)
        })
            .then(resp => resp.json())
            .then((data) => {
                setProject(data)
                setShowProjectForm(false)
                setMessage("O Projeto foi Atualizado!")
                setType("success")
            })
            .catch(err => console.log(err))
    }

    function createService(project) {
        setMessage('');
        const lastService = project.services[project.services.length - 1]

        const lastServiceCost = typeof lastService.cost === "string" ? 
        parseFloat(lastService.cost.replace("R$", "").replace(/\./g, "").replace(",", ".")) : lastService.cost;

        lastService.id = uuidv4()
        lastService.cost = lastServiceCost;

        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        if(newCost > parseFloat(project.budget)){  
            setMessage("Orçamento ultrapassado, verifique o valor do serviço")
            console.log(message)
            setType("error")
            project.services.pop()
            return false 
        }

        project.cost = newCost
        
        fetch(`https://api-costs-json-server.vercel.app/projects/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(project)
        })
            .then(resp => resp.json())
            .then((data) => {
                setServices(data.services)
                setShowServiceForm(!showServiceForm)
                setMessage('Serviço adicionado!')
                setType('success')
            })
            .catch(err => console.log(err))
    }

    function removeService(id, cost) {
        setMessage('')

        const servicesUpdated = project.services.filter(
            (service) => service.id !== id
        )

        const projectUpdated = project

        projectUpdated.services = servicesUpdated
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost);

        fetch(`https://api-costs-json-server.vercel.app/projects/${projectUpdated.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(projectUpdated)
        })
            .then(resp => resp.json())
            .then(() => {
                setProject(projectUpdated)
                setServices(servicesUpdated)
                setMessage("Serviço removido com sucesso!")
                setType("success")
            })
            .catch(err => console.log(err))
    }

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm);
    }

    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm);
    }

    return (
        <>
            {project.name ? (
                <div className={styles.project_details}>
                    <Container customClass="column">
                        {message && <Message type={type} text={message}/>}  
                        <div className={styles.details_container}>
                            <h1>Projeto: {project.name}</h1>
                            <button className={styles.btn} onClick={toggleProjectForm}>
                                {!showProjectForm ? "Editar Projeto" : "Fechar"} 
                            </button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p><span>Categoria:</span> {project.category.name}</p>
                                    <p>
                                        <span>Total do Orçamento:</span> 
                                        {project.budget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </p>
                                    <p>
                                        <span>Total Utilizado:</span> 
                                        {project.cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </p>
                                </div>
                            ) : (
                                <div className={styles.project_info}>
                                    <ProjectForm 
                                        handleSubmit={editPost}
                                        btnText="Concluir Edição"
                                        projectData={project}
                                    />
                                </div>
                            )}
                        </div>
                        <div className={styles.service_form_container}>
                            <h2>Adicione um Serviço:</h2>
                            <button className={styles.btn} onClick={toggleServiceForm}>
                                {!showServiceForm ? "Adicionar Serviço" : "Fechar"} 
                            </button>
                            <div className={styles.project_info}>
                                {showServiceForm && (
                                    <ServiceForm 
                                        handleSubmit={createService}
                                        btnText="Adicionar Serviço"
                                        projectData={project}
                                    />
                                )

                                }
                            </div>
                        </div>
                        <h2>Serviços:</h2> 
                        <Container customClass="start">
                            {services.length > 0 &&
                                services.map((service) => (
                                    <ServiceCard 
                                        id={service.id}
                                        name={service.name}
                                        cost={service.cost}
                                        description={service.description}
                                        key={service.id}
                                        handleRemove={removeService}
                                    />
                                ))
                            }
                            {services.length === 0 &&
                                <p>Não há serviços</p>
                            }
                        </Container>
                    </Container>
                </div>
                
            ) : (
                <Loading/>
            )}
        </>
    )
}

export default Project;