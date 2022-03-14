import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Thumbnail.css';

function Thumbnail({ id, image, title }) {
  return (
    <Link to={`/details/${id}`} className="thumbnail-component">
      <img src={image} alt={title} />
      <div className="title">{title}</div>
    </Link>
  );
}

Thumbnail.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Thumbnail;
