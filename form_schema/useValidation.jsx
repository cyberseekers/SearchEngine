import { useState } from 'react';
import * as yup from 'yup';

const initialValues = {
    username: '',
    password: ''
}

const initialErrors = {
    username: '',
    password: ''
}

export const useValidation = (schema) => {
    const [data, setData] = useState(initialValues)
    const [errors, setErrors] = useState(initialErrors)

    const onInputChange = (event) => {
        const { name, value } = event.target
        yup.reach(schema, name)
            .validation(value)
            .then(() => {
                setErrors({ ...errors, [name]: "" })
            })
            .catch(error => {
                setErrors({ ...errors, [name]: error.errors[0] })

            })


    }
}
