import React, {Fragment, useEffect, useState}  from "react";


function OneMovie(props){
    const [movie, setMovie] = useState({});
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const movieId = props.match.params.id;

    useEffect(()=> {
        fetch(`${process.env.REACT_APP_API_URL}/v1/movie/`+movieId)
        .then((response)=> {
            if(response.status !== 200){
                setError("Invalid response Code: ", response.status);
            }else{
                setError(null)
            }
            return response.json();
        })
        .then((json) =>{
            setMovie(json.movie);
            setIsLoaded(true);
        });
    }, [movieId]);


    if(movie.genres){
        movie.genres = Object.values(movie.genres)
    }else{
        movie.genres = []
    }

    if(error != null){
        return <p> Error: {error.message}</p>
    }else if(!isLoaded){
        return <p> Loading...</p>
    }else{
        return (
            <Fragment>
                <h2> Movie: {movie.title} {movie.year}</h2>
                <div className="float-start">
                    <small>MPAA Rating: {movie.mpaa_rating}</small>
                </div>
                <div className="float-end">
                {
                    movie.genres.map((m, index) => (
                        <span className="badge bg-secondary me-1">
                            {m}
                        </span>
                    ))
                }
                </div>

                <div className="clearfix"></div>
                <hr/>

                <table className="table table-compact table-striped">
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td><strong>Title:</strong></td>
                            <td>{movie.title}</td>
                        </tr>
                        <tr>
                            <td><strong>Description:</strong></td>
                            <td>{movie.description}</td>
                        </tr>
                        <tr>
                            <td><strong>Runtime:</strong></td>
                            <td>{movie.run_time ??'N/A'} minutes</td>
                        </tr>
                        <tr>
                            <td><strong>Rating:</strong></td>
                            <td>{movie.rating ??'N/A'}</td>
                        </tr>
                    </tbody>
                </table>
            </Fragment>
        );
    }
}
export default OneMovie;