import { Component } from 'react';
import { toast, Toaster } from 'react-hot-toast';

import css from './SearchBar.module.css';

export class SearchBar extends Component {
  state = { query: '' };

  handleChange = e => this.setState({ query: e.target.value });

  handleSubmit = e => {
    e.preventDefault();
    const inputValue = this.state.query.trim();
    if (!inputValue) {
      toast.error('Please enter a search term');
      return;
    }
    this.props.onSubmit(inputValue);
    this.setState({ query: '' });
  };
  render() {
    const { handleSubmit, handleChange } = this;
    const { query } = this.state;
    return (
      <>
        <Toaster position="top-right" reverseOrder={false} />
        <header>
          <form className={css.style_form} onSubmit={handleSubmit}>
            <input
              type="text"
              autoComplete="off"
              autoFocus
              placeholder="Search images and photos"
              value={query}
              onChange={handleChange}
            />
            <button className={css.btn_search} type="submit">
              Search
            </button>
          </form>
        </header>
      </>
    );
  }
}
