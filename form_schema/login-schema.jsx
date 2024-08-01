import * as yup from 'yup';


const LoginFormSchema = yup.object().shape({
    username: yup.string()
        .required("Username/Password is required. Please fill out field"),
    password: yup.string()
        .required("Username/Password is required. Please fill out field")

})


export default LoginFormSchema
