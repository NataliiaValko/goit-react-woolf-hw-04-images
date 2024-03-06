import css from './ImageCard.module.css';

export const ImageCard = ({
  image: { largeImageURL, webformatURL, tags },
  onImageClick,
}) => {
  const handleImageClick = () => {
    onImageClick({ src: largeImageURL, alt: tags });
  };

  return (
    <div className={css.gallery_item}>
      <img src={webformatURL} alt={tags} onClick={handleImageClick} />
    </div>
  );
};
