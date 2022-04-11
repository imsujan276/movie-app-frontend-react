
import React, {Component, Fragment} from "react";
import './AddMovie.css'
import Input from "./form-components/Input";
import TextArea from "./form-components/TextArea";
import Select from "./form-components/Select";
import Alert from "./ui-components/Alert";
import { Link } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default class AddMovie extends Component{

    constructor(props){
        super(props);
        this.state = {
            movie: {
                id: 0,
                title:"",
                release_date:"",
                run_time:"",
                mpaa_rating:"",
                rating:"",
                description:"",
            },
            mpaaOptions: [
                {id:"G", value:"G"},
                {id:"PG", value:"PG"},
                {id:"PG-13", value:"PG-13"},
                {id:"R", value:"R"},
                {id:"NC17", value:"NC17"},
            ],
            isLoaded: false,
            error: null,
            form_errors: [],
            alert: {
                type: "d-none",
                message: "",
            }
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit = (ev) => {
        ev.preventDefault();
        // client side validation
        let form_errors = [];
        if(this.state.movie.title === ""){
            form_errors.push("title")
        }
        this.setState({form_errors:form_errors})
        if(form_errors.length > 0){
            return false;
        }
        const data = new FormData(ev.target);
        const payload = Object.fromEntries(data.entries())
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer "+ this.props.jwt);

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: myHeaders,
        }
        fetch(`${process.env.REACT_APP_API_URL}/v1/admin/movie/add`, requestOptions)
            .then((response)=> response.json())
            .then(resp =>{
                if(resp.error){
                    this.setState({
                        alert: {
                            type: "alert-danger",
                            message: resp.error.message,
                        }
                    })
                }else{
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

    handleChange = (event) => {
        let value = event.target.value;
        let name = event.target.name;
        this.setState((prevState)=> ({
            movie: {
                ...prevState.movie,
                [name]:value
            }
        }))
    }

    hasError(key) {
        return this.state.form_errors.indexOf(key) !== -1;
    }

    componentDidMount(){
        if(this.props.jwt === ""){
            let t = window.localStorage.getItem("jwt");
            if (!t){
                this.props.history.push({pathname:"/login"});
                return
            }else{
                this.props.handleJwtChange(JSON.parse(t))
            }
        }
        const id = this.props.match.params.id;
        if(id > 0){
            fetch(`${process.env.REACT_APP_API_URL}/v1/movie/`+this.props.match.params.id)
            .then((response)=> {
                if(response.status !== "200"){
                    let err = Error;
                    err.message = "Invalid Resposne Code: "+response.status;
                    this.setState({ error: err })
                }
                return response.json();
            })
            .then((json) =>{
                const releaseDate = new Date(json.movie.release_date)
                this.setState({
                    movie: {
                        id: json.movie.id,
                        title:json.movie.title,
                        release_date:releaseDate.toISOString().split("T")[0],
                        run_time:json.movie.run_time,
                        mpaa_rating:json.movie.mpaa_rating,
                        rating:json.movie.rating,
                        description:json.movie.description,
                    },
                    isLoaded: true,
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error: error
                    });
                });
            });
        }else{
            this.setState({isLoaded:true})
        }
    }

    confirmDelete = (e) => {
        confirmAlert({
            title: 'Delete Movie?',
            message: 'Are you sure?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append("Authorization", "Bearer "+ this.props.jwt);
                    
                    fetch(`${process.env.REACT_APP_API_URL}/v1/admin/movie/delete/`+this.state.movie.id, 
                        {method:"GET", headers:myHeaders}
                    )
                    .then(response => response.json)
                    .then(data => {
                        if(data.error){
                            this.setState({
                                alert: {type: "alert-danger", message: data.error.message}
                            })
                        }else{
                            this.props.history.push({
                                pathname: "/admin"
                            })
                        }
                    }, (error)=> {
                        this.setState({
                            alert: {type: "alert-danger", message: error}
                        })
                    })
                }
              },
              {
                label: 'No',
                onClick: () => {

                }
              }
            ]
          });
    }

    render(){
        let {movie, isLoaded, error, alert} = this.state

        if(error){
            return <p> Error: {error.message}</p>
        }else if(!isLoaded){
            return <p> Loading...</p>
        }else{
            return(
                <Fragment>
                    <h2>Add/Edit Movie</h2>
                    <Alert 
                        alertType={alert.type} 
                        alertMessage={alert.message} />
                    <hr/>

                    <form onSubmit={this.handleSubmit}>
                        <input type="hidden" name="id" id="id" value={movie.id}/>
                        <Input
                            title={"Title"}
                            name={"title"}
                            type={"text"}
                            value={movie.title}
                            handleChange={this.handleChange}
                            className= {this.hasError("title") ? "is-invalid" : ""}
                            errorDiv= {this.hasError("title") ? "text-danger" : "d-none"}
                            errorMsg = {"Please enter a title"}
                        />
                        <Input
                            title={"Release Date"}
                            name={"release_date"}
                            type={"date"}
                            value={movie.release_date}
                            handleChange={this.handleChange}
                        />
                        <Input
                            title={"Runtime"}
                            name={"run_time"}
                            type={"text"}
                            value={movie.run_time}
                            handleChange={this.handleChange}
                        />
                        <Select 
                            title= {"MPAA Rating"}
                            name= {"mpaa_rating"}
                            options = {this.state.mpaaOptions}
                            value = {movie.mpaa_rating}
                            onChange = {this.handleChange}
                            placeholder = {"Choose.."}
                        />

                        <Input
                            title={"Rating"}
                            name={"rating"}
                            type={"text"}
                            value={movie.rating}
                            handleChange={this.handleChange}
                        />

                        <TextArea
                            title={"Description"}
                            name={"description"}
                            value={movie.description}
                            handleChange={this.handleChange}
                        />

                        <hr/>

                        <button className="btn btn-primary">Save</button>
                        <Link to="/admin" className="btn btn-warning ms-1">
                            Cancel
                        </Link>
                        {movie.id > 0 && (
                            <a href="#!" onClick={()=> this.confirmDelete()}
                                className="btn btn-danger ms-1">
                                    Delete
                                </a>
                        )}
                    </form>

                </Fragment>
            );
        }
    }
}