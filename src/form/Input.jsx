import styles from './Input.module.css'

function Input({type, text, name, placeholder, handleOnChange, value, moeda}){

    function mascaraMoeda(event) {
        const onlyDigits = event.target.value
            .split("")
            .filter(s => /\d/.test(s))
            .join("")
            .padStart(3, "0")
        const digitsFloat = onlyDigits.slice(0, -2) + "." + onlyDigits.slice(-2)
        event.target.value = maskCurrency(digitsFloat)
    }
    
    function maskCurrency(valor, locale = 'pt-BR', currency = 'BRL') {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency
        }).format(valor)
    }

    return (
        <div className={styles.form_control}>
            <label htmlFor={name}>{text}</label>
            <input 
                type={type} 
                name={name} 
                id={name}  
                placeholder={placeholder}
                onChange={handleOnChange}
                value={value}
                onInput={moeda ? mascaraMoeda: null}
            />
        </div>
    )
}

export default Input;