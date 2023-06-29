import styles from '../project/ProjectForm.module.css'
import Input from '../../form/Input';
import SubmitButton from '../../form/SubmitButton';
import { useState } from 'react';

function ServiceForm({ handleSubmit, btnText, projectData }) {

    const [service, setService] = useState({});

    function submit(e) {
        e.preventDefault();
        projectData.services.push(service)
        handleSubmit(projectData);
    }

    function handleChange(e) {
        setService({...service, [e.target.name]: e.target.value})
    }

    return (
        <form className={styles.form} onSubmit={submit}>
            <Input 
                type="text"
                text="Nome do Serviço"
                name="name"
                placeholder="Insira o nome do serviço"
                handleOnChange={handleChange}
            />
            <Input 
                type="text"
                text="Custo do Serviço"
                name="cost"
                placeholder="R$ 0,00"
                moeda={true}
                handleOnChange={handleChange}
            />
            <Input 
                type="text"
                text="Descrição do Serviço"
                name="description"
                placeholder="Descreva o serviço"
                handleOnChange={handleChange}
            />
            <SubmitButton text={btnText}/>
        </form>
    )
}

export default ServiceForm;