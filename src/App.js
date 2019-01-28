import React, { Component } from 'react';
import './App.css';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';

// constants

const QUOTES_API =
	'https://gist.githubusercontent.com/nasrulhazim/54b659e43b1035215cd0ba1d4577ee80/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json';

const colorsArray = [
	'#C33C54',
	'#36393B',
	'#3C1518',
	'#35524A',
	'#0267C1',
	'#542344',
	'#202030',
	'#D7263D',
	'#1C0F13',
	'#6E7E85'
];

// Redux

const UPDATE = 'UPDATE';

const updateQuote = (quote, author, color) => {
	return {
		type: UPDATE,
		quote,
		author,
		color
	};
};

const defaultState = {
	quote: '',
	author: '',
	color: ''
};

const quoteReducer = (state = defaultState, action) => {
	switch (action.type) {
		case UPDATE:
			const { quote, author, color } = action;
			return { quote, author, color };
		default:
			return state;
	}
};

const store = createStore(quoteReducer);

// React

class App extends Component {
	componentDidMount = () => this.getQuotes();

	getQuotes = () => {
		const color = colorsArray[Math.floor(Math.random() * 10)];
		fetch(QUOTES_API)
			.then(response => response.json())
			.then(data => {
				const { quote, author } = data.quotes[Math.floor(Math.random() * 102)];
				this.props.submitNewQuote(quote, author, color);
			});
	};

	render() {
		const { color } = this.props;
		const style = {
			backgroundColor: color,
			color: color
		};

		return (
			<div className='main' style={style}>
				<div className='wrapper' id='quote-box'>
					<p id='text'>
						<i className='fas fa-quote-left quote' /> {this.props.quote}
					</p>
					<p className='wrapper__author'>
						- <small id='author'>{this.props.author}</small>
					</p>
					<div>
						<a
							className='btn'
							href='#vain'
							style={{ color: 'white', backgroundColor: color }}
							id='new-quote'
							onClick={this.getQuotes}
						>
							<span>
								<i className='fas fa-sync-alt' />
							</span>
						</a>

						<a
							className='btn'
							style={{ color: 'white', backgroundColor: color }}
							id='tweet-quote'
							href={`https://twitter.com/intent/tweet?text=${
								this.props.quote
							} - ${this.props.author}`}
							target='_blank'
							rel='noopener noreferrer'
						>
							<i className='fab fa-twitter' />
						</a>
					</div>
				</div>
			</div>
		);
	}
}

// Other Redux 😅

const mapStateToProps = state => {
	const { quote, author, color } = state;
	return { quote, author, color };
};

const mapDispatchToProps = dispatch => {
	return {
		submitNewQuote: (quote, author, color) =>
			dispatch(updateQuote(quote, author, color))
	};
};

const Container = connect(
	mapStateToProps,
	mapDispatchToProps
)(App);

class AppWrapper extends Component {
	render() {
		return (
			<Provider store={store}>
				<Container />
			</Provider>
		);
	}
}

export default AppWrapper;
