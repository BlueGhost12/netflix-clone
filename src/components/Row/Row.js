import React, { useState, useEffect } from 'react'
import axios from '../../URL requests/axios'
import requests from '../../URL requests/requests';
import './row.css';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer'

const base_image_URL = "https://image.tmdb.org/t/p/original/";
function Row(props) {

    const [movies, setMovies] = useState([]);
    const [trailerURL, setTrailerURL] = useState("")

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(props.fetchURL);
            // console.log(request)
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [props.fetchURL]);

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        },
    }

    const handleClick = (movie) => {
        if(trailerURL){
            setTrailerURL("")
        } else {
            movieTrailer(movie?.name || "")
            .then((url) => {
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrailerURL(urlParams.get("v"))
            })
            .catch((error) => console.log(error))
        }
    }

    console.log(trailerURL)
    return (
        <div className="row">
            <h2 style={props.isLargeRow? {paddingTop: "20px",} : null}>{props.title}</h2>
            <div className="row_posters">
                {movies.map(movie => (
                    <img
                        key={movie.id}
                        onClick={() => handleClick(movie)}
                        className={`row_poster ${props.isLargeRow && "row_posterLarge"}`} 
                        src={ props.isLargeRow ? `${base_image_URL}${movie.poster_path}` : `${base_image_URL}${movie.backdrop_path}`} 
                        alt={movie.name} />
                ))}
                <div>
                   {trailerURL && <YouTube videoId={trailerURL} opts={opts} />}
                </div>
            </div>
        </div>
    )
}

export default Row
