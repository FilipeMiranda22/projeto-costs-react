import styles from './SubmitButton.module.css'

function SubmitButton({ text }){
    return (
        <div className={styles.btn_container}>
            <button >{ text }</button>
        </div>
    )
}

export default SubmitButton;