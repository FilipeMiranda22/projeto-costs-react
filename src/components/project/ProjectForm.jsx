import { useEffect, useState } from 'react';
import Input from '../../form/Input';
import Select from '../../form/Select';
import SubmitButton from '../../form/SubmitButton';
import styles from './ProjectForm.module.css'

function ProjectForm({ btnText, handleSubmit, projectData }) {
    const [categories, Setcategories] = useState([]);
    const [project, SetProject] = useState(projectData || {})

    useEffect(() => {
        fetch("https://api-costs-json-server.vercel.app/categories", {
        method: "GET",
        headers: {
            'Content-Type': 'aplication/json'
        }
    })
        .then(resp => resp.json())
        .then(data => {
            Setcategories(data)
        })
        .catch(err => console.log(err))
    }, [])

    const submit = (e) => {
        e.preventDefault();
        handleSubmit(project);
    }

    function handleChange(e) {
        SetProject({ ...project, [e.target.name]: e.target.value })
    }

    function handleCategory(e) {
        SetProject({ ...project, category: {
                id: e.target.value,
                name: e.target.options[e.target.selectedIndex].text
            },
        })
    }

    return (
        <form onSubmit={submit} className={styles.form}>
            <Input 
                type="text" 
                text="Nome do Projeto" 
                name="name" 
                placeholder="Insira o nome do Projeto"
                handleOnChange={handleChange}
                value={project.name ? project.name : ''}
            />
            <Input 
                type="text" 
                text="Orçamento do Projeto" 
                name="budget" 
                placeholder="R$ 0,00"
                moeda={true}
                handleOnChange={handleChange}
                value={project.budget ? project.budget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}
            />
            <Select 
                name="caregory_id" 
                text="Selecione a Categoria" 
                options={categories} 
                handleOnChange={handleCategory}
                value={project.category ? project.category.id : ''}
            />
            <SubmitButton text={btnText}/>
        </form>
    )
}

export default ProjectForm;