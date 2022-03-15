import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { itemImages } from '../items';
import Thumbnail from './Thumbnail';
import './Details.css';

function Details({ items }) {
  const { id } = useParams();
  const detailItem = items.find((item) => item.id === id);
  const otherItems = items.filter((item) => item.id !== id);

  return (
    <div className="details-component">
      <div className="details-sidebar">
        <h2>Other Items</h2>
        {otherItems.map((item) => (
          <Thumbnail
            id={item.id}
            image={itemImages[item.imageId]}
            title={item.title}
            key={item.id}
          />
        ))}
      </div>
      <div className="details-box">
        {detailItem ? (
          <>
            <h2>{detailItem.title}</h2>
            <img
              className="details-image"
              src={itemImages[detailItem.imageId]}
              alt={detailItem.title}
            />
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            <div>Price: ${detailItem.price.toFixed(2)}</div>
          </>
        ) : (
          <h2>Unknown Item</h2>
        )}
      </div>
    </div>
  );
}

Details.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      imageId: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default Details;