import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';
const GithubContext = React.createContext();

// Provider, Consumer - GithubContext.Provider

const GithubProvider = ({ children }) => {
    const [githubUser, setGithubUser] = useState(mockUser);
    const [repos, setRepos] = useState(mockRepos);
    const [followers, setFollowers] = useState(mockFollowers);


    // request loading
    const [requests, setRequests] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    // error
    const [error, setError] = useState({ show: false, msg: "" })

    const searchGithubUser = async (user) => {
        // toggle error
        toggleError()
        setIsLoading(true)

        // we're looking for users and whoever we pass in 
        const response = await axios(`${rootUrl}/users/${user}`).catch(err => console.log(err));

        // as long as we have user, then show 
        // if the response is undefined, then show error
        if (response) {
            setGithubUser(response.data)
            const { login, followers_url } = response.data;
            // repos

            // we use that method to get all the data we have, followers, repos, all of this at the same time
            await Promise.allSettled([axios(`${rootUrl}/users/${login}/repos?per_page=100`), axios(`${followers_url}?per_page=100`)]).then((results) => {
                console.log(results);
                const [repos, followers] = results;
                const status = 'fulfilled';
                if (repos.status === status) {
                    setRepos(repos.value.data)
                }
                if (followers.status === status) {
                    setFollowers(followers.value.data)
                }
            }).catch(err => console.log(err));

        } else {
            toggleError(true, 'there is no user with that username')
        }
        checkRequests();
        setIsLoading(false)
    }
    // check rate
    const checkRequests = () => {
        axios(`${rootUrl}/rate_limit`)
            .then(({ data }) => {
                let { rate: { remaining }, } = data;
                // remaining = 0
                setRequests(remaining)
                // if remaining is zero, then we know that we don't have requests
                if (remaining === 0) {
                    // throw an error
                    toggleError(true, 'sorry, you have excedeed your hourly rate limit!')
                }
            })
            .catch((err) => console.log(err))
    }
    // by default if i don't pass in the value for show, i'll set it back to false, i'll always hide the message, and message itself always going to be empty string
    function toggleError(show = false, msg = '') {
        setError({ show, msg })
    }
    // error
    // ///////////////////////
    useEffect(checkRequests, [])
    return <GithubContext.Provider value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        isLoading
    }}>
        {children}
    </GithubContext.Provider>
}

export { GithubProvider, GithubContext };