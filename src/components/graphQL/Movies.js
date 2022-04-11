import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import Input from "../form-components/Input";

export default class GraphQLMovies extends Component{
    constructor(props){
        super(props);
        this.state={
            movies:[],
            isLoaded: false,
            error: null,
            alert: {
                type:"d-none",
                message: "",
            },
            searchQuery:"",
        }
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount(){
        this.getAllMovies()      
    }

    handleChange= (evt) => {
        let value = evt.target.value;
        this.setState((prevState)=> ({
            searchQuery: value
        }));
        if(value.length > 2){
            this.performSearch();
        }else if(value.length === 0){
            this.getAllMovies();
        } else{
            this.setState({ movies: [] })
        }
    }

    performSearch(){
        const payload = `
        {
            search(titleContains: "${this.state.searchQuery}" ){
                id
                title
                runtime
                year
                description
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
            let theList = Object.values(data.data.search);
            return theList;
        })
        .then(theList => {
            console.log(theList);
            if(theList.length>0){
                this.setState({movies: theList})
            }else{
                this.setState({movies: []})
            }
        }) 
    }

    getAllMovies(){
        const payload = `
        {
            movies{
                id
                title
                runtime
                year
                description
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
            let theList = Object.values(data.data.movies);
            return theList;
        })
        .then(theList => {
            this.setState({movies: theList})
        });
    }

    render(){
        let {movies} = this.state;
        return(
            <Fragment>
                <h2> GraphQL</h2>
                <hr/>

                <Input
                    title={"Search"}
                    type={"text"}
                    name={"search"}
                    value={this.state.searchQuery}
                    handleChange={this.handleChange}
                    placeholder = {"Enter at least 3 characters to search"}
                />
                <div className="list-group">
                        {movies.map(m => (
                            <Link 
                                key={m.id} 
                                to={`/graphql-movie/${m.id}`}
                                className="list-group-item list-group-item-action"
                            >
                                <strong> {m.title}</strong>
                                <br/>
                                <small className="text-muted">
                                    ({m.year}) - {m.runtime ?? 'N/A'} minutes
                                </small>
                                <br/>
                                {m.description.slice(0,100)}...
                            </Link>
                        ))}
                    </div>
            </Fragment>
        );
    }
}