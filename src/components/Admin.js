import React, {Component, Fragment} from "react";
import { Link } from "react-router-dom";

export default class Admin extends Component {
    state = {
        movies:[],
        isLoaded: false,
        error: null,
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
        fetch(`${process.env.REACT_APP_API_URL}/v1/movies`)
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
        const {movies, isLoaded, error} = this.state
        if(error){
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
}