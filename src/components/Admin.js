import React, {Fragment, useEffect, useState} from "react";
import { Link } from "react-router-dom";


function Admin(props) {

    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if(props.jwt === ""){
            let t = window.localStorage.getItem("jwt");
            if (!t){
                props.history.push({pathname:"/login"});
                return
            }else{
                props.handleJwtChange(JSON.parse(t))
            }
        }
        fetch(`${process.env.REACT_APP_API_URL}/v1/movies`)
            .then((response)=> {
                if(response.status !== 200){
                    setError("Invalid response Code: ", response.status);
                }else{
                    setError(null)
                }
                return response.json();
            })
            .then((json) =>{
                setMovies(json.movies);
                setIsLoaded(true);
            });
    }, [props]);

    if(error != null){
        return <p> Error: {error.message}</p>
    }else if(!isLoaded){
        return <p> Loading...</p>
    }else{
        return (
            <Fragment>
                <h2> Choose Movie <small>({movies.length})</small></h2>
                <hr/>
                <div className="list-group">
                    {movies.map(m => (
                        <Link 
                            key={m.id} 
                            to={`admin/movie/${m.id}`} 
                            className="list-group-item list-group-item-action"
                        >
                            {m.title}
                        </Link>
                    ))}
                </div>
                
            </Fragment>
        );
    }

}

export default Admin;