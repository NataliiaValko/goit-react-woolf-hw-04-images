import { useEffect, useState } from 'react';

import { SearchBar } from './components/SearchBar/SearchBar.jsx';
import { ImageGallery } from './components/ImageGallery/ImageGallery.jsx';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage.jsx';
import { LoadMoreBtn } from './components/LoadMoreBtn/LoadMoreBtn.jsx';
import { Loader } from './components/Loader/Loader.jsx';
import { ImageModal } from './components/ImageModal/ImageModal.jsx';
import { fetchImages } from './service/pixabayAPI.js';

import './App.css';

export const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [dataForModal, setDataForModal] = useState(null);
  const [showLoadMoreBtn, setShowLoadMoreBtn] = useState(false);

  useEffect(() => {
    const fn = async () => {
      if (!query) return;

      try {
        setLoading(true);
        setError(false);

        const data = await fetchImages({ query, page });
        if (!data?.hits?.length) return;
        const normalizedArray = array =>
          array.map(({ id, webformatURL, largeImageURL, tags }) => ({
            id,
            webformatURL,
            largeImageURL,
            tags,
          }));
        setImages(prevImages => [...prevImages, ...normalizedArray(data.hits)]);
        setShowLoadMoreBtn(page < Math.ceil(data.totalHits / 12));
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fn();
  }, [query, page]);

  const handleSubmit = query => {
    setQuery(query);
    setPage(1);
    setImages([]);
    setShowLoadMoreBtn(false);
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const openModal = dataForModal => {
    setDataForModal(dataForModal);
    setModalIsOpen(true);

    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setDataForModal('');
    setModalIsOpen(false);

    document.body.style.overflow = 'auto';
  };

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
};
