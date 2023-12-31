import { useNavigate } from 'react-router-dom';
import ProjectForm from '../project/ProjectForm';
import styles from './NewProject.module.css'

function NewProject() {

    const history = useNavigate();

    function createPost( project ) {
        project.cost = 0;
        project.services = []
        // Remover o símbolo "R$" e substituir a vírgula por ponto
        const numericValue = typeof project.budget === "string" ?
        project.budget.replace('R$', '').replace(/\./g, "").replace(',', '.') : project.budget;

        // Converter para float
        project.budget = parseFloat(numericValue);

        fetch("https://api-costs-json-server.vercel.app/projects", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project),
            
        })
            .then((resp) => resp.json())
            .then(() => {
                history('/projects', { state: {message : "Projeto criado com sucesso!"} });
            })
            .catch((err) => console.log(err))
    }

    return (
        <div className={styles.newproject_container}>
            <h1>Criar Projeto</h1>
            <p>Crie o seu Projeto para depois adicionar os serviços</p>
            <ProjectForm handleSubmit={createPost} btnText="Criar Projeto"/>
        </div>
    )
}

export default NewProject;