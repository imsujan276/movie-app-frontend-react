import React, {Fragment, useEffect, useState}  from "react";
import { Link } from "react-router-dom";

function OneGenre(props){
    const [genreName, setGenreName] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const movieId = props.match.params.id;

    useEffect(()=> {
        setGenreName(props.location.genreName);
        fetch(`${process.env.REACT_APP_API_URL}/v1/movies/`+movieId)
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
    }, [movieId, props.location.genreName]);


    if(movies == null){
        setMovies([]);
    }
    if(error != null){
        return <p> Error: {error.message}</p>
    }else if(!isLoaded){
        return <p> Loading...</p>
    }else{
        return (
            <Fragment>
                <h2> Genre: {genreName}</h2>
                <div className="list-group">
                    {movies.map(m => (
                        <Link to={`/movie/${m.id}`} className="list-group-item list-group-item-action">
                            {m.title}
                        </Link>
                    ))}
                </div>
            </Fragment>
        );
    }
}
export default OneGenre;
