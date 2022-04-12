import React, { Fragment, useEffect, useState} from "react";
import { Link } from "react-router-dom";


// using functional approach
function Movies (props) {

    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(()=> {
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
    }, []); // *** must set default value to stop endless loop

    
    if(error != null){
        return <p> Error: {error.message}</p>
    }else if(!isLoaded){
        return <p> Loading...</p>
    }else{
        return (
            <Fragment>
                <h2> Choose Movie <small>({movies.length})</small></h2>
                <div className="list-group">
                    {movies.map(m => (
                        <Link 
                            key={m.id} 
                            to={`/movie/${m.id}`} 
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


// Using component approach
// class Movies extends Component {

//     state = {
//         movies:[],
//         isLoaded: false,
//         error: null,
//     }

//     componentDidMount(){
//         fetch(`${process.env.REACT_APP_API_URL}/v1/movies`)
//             .then((response)=> {
//                 if(response.status !== "200"){
//                     let err = Error;
//                     err.message = "Invalid Resposne Code: "+response.status;
//                     this.setState({ error: err })
//                 }
//                 return response.json();
//             })
//             .then((json) =>{
//                 this.setState({
//                     movies: json.movies,
//                     isLoaded: true,
//                 },
//                 (error) => {
//                     this.setState({
//                         isLoaded: true,
//                         error: error
//                     });
//                 });
//             });
//     }

//     render() {
//         const {movies, isLoaded, error} = this.state
//         if(error){
//             return <p> Error: {error.message}</p>
//         }else if(!isLoaded){
//             return <p> Loading...</p>
//         }else{
//             return (
//                 <Fragment>
//                     <h2> Choose Movie <small>({movies.length})</small></h2>
//                     <div className="list-group">
//                         {movies.map(m => (
//                             <Link 
//                                 key={m.id} 
//                                 to={`/movie/${m.id}`} 
//                                 className="list-group-item list-group-item-action"
//                             >
//                                 {m.title}
//                             </Link>
//                         ))}
//                     </div>
                    
//                 </Fragment>
//             );
//         }
        
//     }
// }


export default Movies;