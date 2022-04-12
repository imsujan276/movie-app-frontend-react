import React, { Fragment, useState} from "react";
import Input from "./form-components/Input";
import Alert from "./ui-components/Alert";

function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [alert, setAlert] = useState({ type: "d-none", message: "" });

    const handleEmail = (ev) => {
        setEmail(ev.target.value);
    }

    const handlePassword = (ev) => {
        setPassword(ev.target.value);
    }

    const hanldeSubmit = (ev) => {
        ev.preventDefault();
        let form_errors = [];
        if(email === ""){
            form_errors.push("email")
        }
        if(password === ""){
            form_errors.push("password")
        }
        setErrors(form_errors);
        if(form_errors.length > 0){
            return false;
        }
        const data = new FormData(ev.target);
        const payload = Object.fromEntries(data.entries())
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(payload),
        }
        fetch(`${process.env.REACT_APP_API_URL}/v1/login`, requestOptions)
            .then((response)=> response.json())
            .then(data =>{
                if(data.error){
                    setAlert({ type: "alert-danger", message: data.error.message, });
                }else{
                    let j = Object.values(data)[0];
                    handleJwtChange(j)
                    window.localStorage.setItem("jwt", JSON.stringify(j))
                   props.history.push({
                        pathname: "/admin"
                    });
                }
            }, (error) => {
                setAlert({ type: "alert-danger", message: error.message, });
            })

    }

    const handleJwtChange = (jwt) => {
        props.handleJwtChange(jwt)
    }

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }

    return (
        <Fragment>
                <h2>Login</h2>
                <Alert alertType={alert.type} alertMessage={alert.message}/>

                <form className="pt-3" onSubmit={hanldeSubmit}>
                    <Input
                        title={"Email"}
                        name={"email"}
                        type={"email"}
                        handleChange={handleEmail}
                        className= {hasError("email") ? "is-invalid" : ""}
                        errorDiv= {hasError("email") ? "text-danger" : "d-none"}
                        errorMsg = {"* Required"}
                    />
                    <Input
                        title={"Password"}
                        name={"password"}
                        type={"password"}
                        handleChange={handlePassword}
                        className= {hasError("password") ? "is-invalid" : ""}
                        errorDiv= {hasError("password") ? "text-danger" : "d-none"}
                        errorMsg = {"* Required"}
                    />
                    <button className="btn btn-primary">Login</button>
                </form>
                <center>
                    Demo user: test@gmail.com | password123
                </center>
            </Fragment>
    );


}

export default Login;