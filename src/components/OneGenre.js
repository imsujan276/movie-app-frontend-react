import React, {Component, Fragment}  from "react";
import { Link } from "react-router-dom";

export default class OneGenre extends Component {
    state = {
        genre_name: '',
        movies: {},
        isLoaded: false,
        error: null,
    }

    componentDidMount(){
        this.setState({
            genre_name: this.props.location.genreName,
        });
        fetch(`${process.env.REACT_APP_API_URL}/v1/movies/`+this.props.match.params.id)
            .then((response)=> {
                if(response.status !== "200"){
                    let err = Error;
                    err.message = "Invalid Resposne Code: "+response.status;
                    this.setState({ error: err })
                }
                return response.json();
            })
            .then((json) =>{
                this.setState({
                    movies: json.movies,
                    isLoaded: true,
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error: error
                    });
                });
            });
    }

    render() {
        let {genre_name, movies, isLoaded, error} = this.state

        if(!movies){
            movies = [];
        }
        if(error){
            return <p> Error: {error.message}</p>
        }else if(!isLoaded){
            return <p> Loading...</p>
        }else{
            return (
                <Fragment>
                    <h2> Genre: {genre_name}</h2>
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
}