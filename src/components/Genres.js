import React, { Fragment, useEffect, useState} from "react";
import { Link } from "react-router-dom";

function Genres(props) {
    const[genres, SetGenres] = useState([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(()=> {
        fetch(`${process.env.REACT_APP_API_URL}/v1/genres`)
        .then((response)=> {
            if(response.status !== 200){
                setError("Invalid response Code: ", response.status);
            }else{
                setError(null)
            }
            return response.json();
        })
        .then((json) =>{
            SetGenres(json.genres);
            setIsLoaded(true);
        });
    }, []);

    if(error){
        return <p> Error: {error.message}</p>
    }else if(!isLoaded){
        return <p> Loading...</p>
    }else{
        return (
            <Fragment>
                <h2> Genres <small>({genres.length})</small></h2>
                <div className="list-group">
                    {genres.map(m => (
                        <Link 
                            key={m.id} 
                            to={{
                                pathname:`/genre/${m.id}`,
                                genreName: m.name,
                            }}
                            className="list-group-item list-group-item-action"
                        >
                            {m.name}
                        </Link>
                    ))}
                </div>
            </Fragment>
        );
    }
}

export default Genres;
