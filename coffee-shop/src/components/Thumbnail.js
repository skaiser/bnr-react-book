import PropTypes from 'prop-types';
import './Thumbnail.css';

function Thumbnail({ image, title }) {
  return (
    <a href="#todo" className="thumbnail-component">
      <img src={image} alt={title} />
      <div className="title">{title}</div>
    </a>
  );
}

Thumbnail.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Thumbnail;
