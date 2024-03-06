import { Component } from 'react';

import { SearchBar } from './components/SearchBar/SearchBar.jsx';
import { ImageGallery } from './components/ImageGallery/ImageGallery.jsx';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage.jsx';
import { LoadMoreBtn } from './components/LoadMoreBtn/LoadMoreBtn.jsx';
import { Loader } from './components/Loader/Loader.jsx';
import { ImageModal } from './components/ImageModal/ImageModal.jsx';
import { fetchImages } from './service/pixabayAPI.js';

import './App.css';

export class App extends Component {
  state = {
    query: '',
    page: 1,
    images: [],
    loading: false,
    error: false,
    modalIsOpen: false,
    dataForModal: null,
    showLoadMoreBtn: false,
  };

  async componentDidUpdate(_, prevState) {
    const { query, page } = this.state;

    if (query !== prevState.query || page !== prevState.page) {
      if (!query) return;

      try {
        this.setState({ loading: true, error: false });
        const data = await fetchImages({ query, page });
        if (!data?.hits?.length) return;
        const normalizedArray = array =>
          array.map(({ id, webformatURL, largeImageURL, tags }) => ({
            id,
            webformatURL,
            largeImageURL,
            tags,
          }));
        this.setState(prev => ({
          images: [...prev.images, ...normalizedArray(data.hits)],
          showLoadMoreBtn: page < Math.ceil(data.totalHits / 12),
        }));
      } catch (error) {
        this.setState({ error: true });
      } finally {
        this.setState({ loading: false });
      }
    }
  }

  handleSubmit = query => {
    this.setState({ query, page: 1, images: [], showLoadMoreBtn: false });
  };

  handleLoadMore = () => {
    this.setState(({ page }) => ({ page: page + 1 }));
  };

  openModal = dataForModal => {
    this.setState({ dataForModal, modalIsOpen: true });
    document.body.style.overflow = 'hidden';
  };

  closeModal = () => {
    this.setState({ dataForModal: '', modalIsOpen: false });
    document.body.style.overflow = 'auto';
  };

  render() {
    const { handleSubmit, openModal, handleLoadMore, closeModal } = this;
    const {
      error,
      images,
      modalIsOpen,
      dataForModal,
      loading,
      showLoadMoreBtn,
    } = this.state;
    return (
      <>
        <SearchBar onSubmit={handleSubmit} />
        {images.length > 0 && !error && (
          <ImageGallery images={images} onImageClick={openModal} />
        )}

        {error && (
          <ErrorMessage message="Oops, there was an error, please try reloading" />
        )}
        {showLoadMoreBtn && <LoadMoreBtn onClick={handleLoadMore} />}
        {modalIsOpen && (
          <ImageModal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            dataForModal={dataForModal}
          />
        )}
        {loading && <Loader />}
      </>
    );
  }
}
