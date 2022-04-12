import React, { Component, Fragment, useEffect, useState } from "react";
import {BrowserRouter as Router, Switch,Route,Link} from 'react-router-dom';
import Movies from "./components/Movies";
import Home from "./components/Home"
import Admin from "./components/Admin"
import OneMovie from "./components/OneMovie";
import Genres from "./components/Genres";
import OneGenre from "./components/OneGenre";
import AddMovie from "./components/AddMovie";
import Login from "./components/Login";
import GraphQLMovies from "./components/graphQL/Movies";
import GraphQLOneMovie from "./components/graphQL/OneMovie";

export default function App(props){

  const[jwt, setJwt] = useState("");

  useEffect(() => {
    let t = window.localStorage.getItem("jwt");
    if(t) {
      if(jwt === ""){
        setJwt(JSON.parse(t));
      }
    }
  }, [jwt]);

  const handleJwtChange = (jwt) => setJwt(jwt);

  const logout = () => {
    handleJwtChange("");
    window.localStorage.removeItem("jwt")
  }

  let loginLink;
  if(jwt === ""){
    loginLink = <Link to="/login">Login</Link>
  }else{
    loginLink = <Link to="/logout" onClick={()=>logout()} >Logout</Link>
  }

  return (
    <Router>
      <div className='container'>
        <div className='row'>
          <div className="col mt-3">
            <h1 className='mt-3'> Go Watch a Movie! </h1>
          </div>
          <div className="col mt-3 text-end">
            {loginLink}
          </div>
          <hr className='mb-3'></hr>
        </div>
        <div className='row'>
          <div className='col-md-2'>
            <nav>
              <ul className='list-group'>
                <li className='list-group-item'>
                  <Link to="/">Home </Link>
                </li>
                <li className='list-group-item'>
                  <Link to='/movies'> Movies</Link>
                </li>
                <li className='list-group-item'>
                  <Link to='/genres'> Genre</Link>
                </li>

                {jwt !== "" && (
                  <Fragment>
                    <li className='list-group-item'>
                      <Link to='/admin/movie/0'> Add movie</Link>
                    </li>
                    <li className='list-group-item'>
                      <Link to='/admin'> Manage Catalogue</Link>
                    </li>
                  </Fragment>
                )}

                  <li className="list-group-item">
                    <Link to="/graphql-movies">GraphQL Movies</Link>
                  </li>
              </ul>
            </nav>
          </div>

          <div className='col-md-10'>
              <Switch>
                <Route  path="/movie/:id" component={OneMovie} />
                <Route  path="/genre/:id" component={OneGenre} />
                
                <Route path="/movies">
                  <Movies/>
                </Route>
                <Route path="/genres">
                  <Genres/>
                </Route>

                <Route exact path="/login" component={(props) => <Login {...props} handleJwtChange={handleJwtChange} />} />

                <Route  path="/genre/:id" component={OneGenre} />

                <Route exact path="/graphql-movies">
                  <GraphQLMovies />
                </Route>
                <Route  path="/graphql-movie/:id" component={GraphQLOneMovie} />

                <Route 
                  path="/admin/movie/:id" 
                  component={(props) => (
                    <AddMovie  {...props} jwt={jwt} handleJwtChange={handleJwtChange}/>
                  )} 
                />

                <Route 
                  path="/admin" 
                  component={(props) => (
                    <Admin {...props} jwt={jwt} handleJwtChange={handleJwtChange}/>
                  )} 
                />

                <Route path="/"> <Home/> </Route>
              </Switch>
          </div>
        </div>
      </div>
    </Router>
    
  );


}
