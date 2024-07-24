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
}
