import React, {Component, Fragment}  from "react";

export default class GraphQLOneMovie extends Component {
    state = {
        movie: {},
        isLoaded: false,
        error: null,
    }

    componentDidMount(){
        this.getMovie();
    }

    getMovie(){
        const payload = `
        {
            movie(id: ${this.props.match.params.id} ){
                id
                title
                runtime
                year
                description
                release_date
                rating
                mpaa_rating
                poster
            }
        }
        `
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: "POST",
            body: payload,
            headers: myHeaders,
        }

        fetch(`${process.env.REACT_APP_API_URL}/v1/graphql`, requestOptions)
        .then(response => response.json())
        .then(data => {
            if(data.error){
                this.setState({
                    movie: {},
                    isLoaded: true,
                    error: data.error.message,
                });
            }else{
                this.setState({
                    movie: data.data.movie,
                    isLoaded: true,
                    error:null,
                });
            }
        });
    }

    render(){
        const {movie, isLoaded, error} = this.state

        if(movie.genres){
            movie.genres = Object.values(movie.genres)
        }else{
            movie.genres = []
        }

        if(error){
            return <p> Error: {error.message}</p>
        }else if(!isLoaded){
            return <p> Loading...</p>
        }else{
        return (
            <Fragment>
                <h2> Movie: {movie.title} {movie.year}</h2>
                
                <div>
                    {movie.poster !== "" && (
                        <div>
                            <img src={`https://image.tmdb.org/t/p/w200${movie.poster}`} alt="Poster"/>
                        </div>
                    )}
                </div>


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
                            <td>{movie.runtime ??'N/A'} minutes</td>
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
}