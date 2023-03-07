// # =============================================================================
// # FILE : app.js
// # PROJECT : Front-end Assignment 
// # PROGRAMMER : Briana Burton 8410334
// # DESCRIPTION :
// #       The purpose of this file is to power the react front-end that will 
//		   prompt the user to enter the name of a subreddit and search it. the
//			program will then get the hot posts of that subreddit and display it
//			to the user. The user can favorite the posts, see the score, and 
//			view the comments of the post. The user can then see all of their
//			favorited posts.
// # =============================================================================

import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';



function App() {
	// variables and arrays needed for the program
	const [subredditInput, setSubredditInput] = useState('');
	const [subredditPosts, setSubredditPosts] = useState([]);
	const [favourites, setFavourites] = useState([]);
	const [currentSubredditTitle, setCurrentTitle] = useState('');

	useEffect(() => {
		const storedFavourites = localStorage.getItem('favourites');
		if (storedFavourites) {
			setFavourites(JSON.parse(storedFavourites));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('favourites', JSON.stringify(favourites));
	}, [favourites]);

	const handleSubredditInputChange = (event) => {
		setSubredditInput(event.target.value);
	};

	// function thats called when the user hits the "search" button.
	// The function will first set the value of currentTitle so that
	// the can see the current subreddit they are searching. It will
	// then call an api to get the current hot posts on the subreddit
	// and store the post id, post title, post score, and permalink.
	const handleSubredditSubmit = (event) => {
		setCurrentTitle('r/' + subredditInput)

		event.preventDefault();
		fetch(`https://www.reddit.com/r/${subredditInput}/hot.json`)
			.then((response) => response.json())
			.then((json) =>
				setSubredditPosts(
					json.data.children.map((child) => ({
						id: child.data.id,
						title: child.data.title,
						score: child.data.score,
						permalink: `https://www.reddit.com${child.data.permalink}`,
					}))
				)
			);
	};

	const handleFavouriteClick = (post) => {
		setFavourites((favourites) => [...favourites, post]);
	};

	const handleFavouriteRemove = (postId) => {
		setFavourites((favourites) => favourites.filter((id) => id !== postId));
	};

	return (
		<div class='app-general'>
			<h1 class='title' >Subreddit Searcher</h1>
			<form onSubmit={handleSubredditSubmit}>
				<label class='name'>Subreddit Name:</label>
				<input class='search-box' placeholder='e.g. uwaterloo' type="text" value={subredditInput} onChange={handleSubredditInputChange} />
				<button class='search search-button' type="submit">Search</button>
			</form>
			<h2 class='title'>Hot {currentSubredditTitle} Posts</h2>
			<ul>
				{subredditPosts.map((post) => (
					<li class='list' key={post.id}>
						<button class='favorite-button' onClick={() => handleFavouriteClick(post)}>Favourite</button>{'	'}
						{post.title}{' '}
						<a class='score'>({post.score})</a> {' '}
						<a class='link' href={post.permalink}>Comments</a>
					</li>
				))}
			</ul>
			<h2 class='title'>My Favourite Posts</h2>
			<ul class='favorites'>
				{favourites.map((post) => (
					<li class='list' key={post}>
						<button class='remove-button' onClick={() => handleFavouriteRemove(post)}>Remove</button>{' '}
						{post.title}{' '}
						<a class='score'>({post.score})</a>{' '}
						<a class='link' href={`https://www.reddit.com/comments/${post.id}`}>Comments</a>
					</li>
				))}
			</ul>
		</div>
	);
}


export default App;
