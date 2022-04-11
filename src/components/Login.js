import React, {Component, Fragment} from "react";
import Input from "./form-components/Input";
import Alert from "./ui-components/Alert";

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            email:"",
            password:"",
            error:null,
            form_errors:[],
            alert: {
                type: "d-none",
                message:"" 
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.hanldeSubmit = this.hanldeSubmit.bind(this);
    }

    handleChange = (ev) => {
        let value = ev.target.value;
        let name = ev.target.name;
        this.setState(prestate => ({
            ...prestate,
            [name]: value,
        }))
    }

    hanldeSubmit = (ev) => {
        ev.preventDefault();
        let form_errors = [];
        if(this.state.email === ""){
            form_errors.push("email")
        }
        if(this.state.password === ""){
            form_errors.push("password")
        }
        this.setState({form_errors:form_errors})
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
                    this.setState({
                        alert: {
                            type: "alert-danger",
                            message: data.error.message,
                        }
                    })
                }else{
                    let j = Object.values(data)[0];
                    this.handleJwtChange(j)
                    window.localStorage.setItem("jwt", JSON.stringify(j))
                    this.props.history.push({
                        pathname: "/admin"
                    })
                }
            }, (error) => {
                    this.setState({
                        alert: {
                            type: "alert-danger",
                            message: error.message,
                        }
                    })
            })

    }

    handleJwtChange(jwt) {
        this.props.handleJwtChange(jwt)
    }

    hasError(key) {
        return this.state.form_errors.indexOf(key) !== -1;
    }

    render() {
        return(
            <Fragment>
                <h2>Login</h2>
                <Alert alertType={this.state.alert.type} alertMessage={this.state.alert.message}/>

                <form className="pt-3" onSubmit={this.hanldeSubmit}>
                    <Input
                        title={"Email"}
                        name={"email"}
                        type={"email"}
                        handleChange={this.handleChange}
                        className= {this.hasError("email") ? "is-invalid" : ""}
                        errorDiv= {this.hasError("email") ? "text-danger" : "d-none"}
                        errorMsg = {"* Required"}
                    />
                    <Input
                        title={"Password"}
                        name={"password"}
                        type={"password"}
                        handleChange={this.handleChange}
                        className= {this.hasError("password") ? "is-invalid" : ""}
                        errorDiv= {this.hasError("password") ? "text-danger" : "d-none"}
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
}