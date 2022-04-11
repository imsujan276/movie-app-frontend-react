import React, {Component, Fragment} from "react";
import { Link } from "react-router-dom";

export default class Genres extends Component{

    state = {
        genres: [],
        isLoaded: false,
        error: null,
    }

    componentDidMount(){
        fetch(`${process.env.REACT_APP_API_URL}/v1/genres`)
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
                    genres: json.genres,
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

    render(){
        const {genres, isLoaded, error} = this.state
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
}
