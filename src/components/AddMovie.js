
import React, { Fragment, useEffect, useState} from "react";
import './AddMovie.css'
import Input from "./form-components/Input";
import TextArea from "./form-components/TextArea";
import Select from "./form-components/Select";
import Alert from "./ui-components/Alert";
import { Link } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

function AddMovie(props) {

    const [movie, setMovie] = useState({});
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [alert, setAlert] = useState({ type: "d-none", message: "" });
    const mpaaOptions = [
        {id:"G", value:"G"},
        {id:"PG", value:"PG"},
        {id:"PG-13", value:"PG-13"},
        {id:"R", value:"R"},
        {id:"NC17", value:"NC17"},
    ];

    useEffect(()=> {
        if(props.jwt === ""){
            let t = window.localStorage.getItem("jwt");
            if (!t){
                props.history.push({pathname:"/login"});
                return;
            }else{
                props.handleJwtChange(JSON.parse(t))
            }
        }
        const id = props.match.params.id;
        console.log(id);
        if(id > 0){
            fetch(`${process.env.REACT_APP_API_URL}/v1/movie/`+id)
            .then((response)=> {
                if(response.status !== 200){
                    setError("Invalid response Code: ", response.status);
                }else{
                    setError(null)
                }
                return response.json();
            })
            .then((json) =>{
                const releaseDate = new Date(json.movie.release_date);
                json.movie.release_date = releaseDate.toISOString().split("T")[0];
                setMovie(json.movie);
                setIsLoaded(true);
            });
        }else{
            setIsLoaded(true);
        }
    }, [props]);

    const handleChange = (event) => {
        let value = event.target.value;
        let name = event.target.name;
        setMovie({
            ...movie, 
            [name]: value,
        });
    }

    const handleSubmit = (ev) => {
        ev.preventDefault();
        // client side validation
        let form_errors = [];
        if(movie.title === ""){
            form_errors.push("title")
        }
        setErrors(form_errors);
        if(form_errors.length > 0){
            return false;
        }
        const data = new FormData(ev.target);
        const payload = Object.fromEntries(data.entries())
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer "+ props.jwt);
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: myHeaders,
        }
        fetch(`${process.env.REACT_APP_API_URL}/v1/admin/movie/add`, requestOptions)
            .then((response)=> response.json())
            .then(resp =>{
                if(resp.error){
                    setAlert({ type: "alert-danger", message: resp.error.message, });
                }else{
                    props.history.push({ pathname: "/admin" })
                }
            }, (error) => {
                setAlert({ type: "alert-danger", message: error.message, });
            });
    }

    const confirmDelete = (e) => {
        confirmAlert({
            title: 'Delete Movie?',
            message: 'Are you sure?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append("Authorization", "Bearer "+ props.jwt);
                    
                    fetch(`${process.env.REACT_APP_API_URL}/v1/admin/movie/delete/`+movie.id, 
                        {method:"GET", headers:myHeaders}
                    )
                    .then(response => response.json)
                    .then(data => {
                        if(data.error){
                            setAlert({ type: "alert-danger", message: data.error.message, });
                        }else{
                            props.history.push({ pathname: "/admin" })
                        }
                    }, (error)=> {
                        setAlert({ type: "alert-danger", message: error.message, });
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

    const hasError = (key) => {
        return errors.indexOf(key) !== -1;
    }

    if(error != null){
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

                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="id" id="id" value={movie.id}/>
                    <Input
                        title={"Title"}
                        name={"title"}
                        type={"text"}
                        value={movie.title}
                        handleChange={handleChange}
                        className= {hasError("title") ? "is-invalid" : ""}
                        errorDiv= {hasError("title") ? "text-danger" : "d-none"}
                        errorMsg = {"Please enter a title"}
                    />
                    <Input
                        title={"Release Date"}
                        name={"release_date"}
                        type={"date"}
                        value={movie.release_date}
                        handleChange={handleChange}
                    />
                    <Input
                        title={"Runtime"}
                        name={"run_time"}
                        type={"text"}
                        value={movie.run_time}
                        handleChange={handleChange}
                    />
                    <Select 
                        title= {"MPAA Rating"}
                        name= {"mpaa_rating"}
                        options = {mpaaOptions}
                        value = {movie.mpaa_rating}
                        onChange = {handleChange}
                        placeholder = {"Choose.."}
                    />

                    <Input
                        title={"Rating"}
                        name={"rating"}
                        type={"text"}
                        value={movie.rating}
                        handleChange={handleChange}
                    />

                    <TextArea
                        title={"Description"}
                        name={"description"}
                        value={movie.description}
                        handleChange={handleChange}
                    />

                    <hr/>

                    <button className="btn btn-primary">Save</button>
                    <Link to="/admin" className="btn btn-warning ms-1">
                        Cancel
                    </Link>
                    {movie.id > 0 && (
                        <a href="#!" onClick={()=>confirmDelete()}
                            className="btn btn-danger ms-1">
                                Delete
                            </a>
                    )}
                </form>

            </Fragment>
        );
    }

}
export default AddMovie;
