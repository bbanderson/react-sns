import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import ImagesZoom from './imagesZoom';

const PostImages = ({ images }) => {
  // 업로드한 이미지 개수에 따라 크기를 달리 렌더링.
  const [showImagesZoom, setShowImagesZoom] = useState(false);
  const carrouselStyle = useMemo(
    () => ({
      display: 'inline-block',
      width: '50%',
      // height: '100%',
      textAlign: 'center',
      verticalAlign: 'middle',
    }),
    []
  );
  const img2Style = useMemo(() => ({
    width: '50%',
    display: 'inline-block',
    position: 'relative',
  }));
  const img3Style = useMemo(() => ({
    width: '50%',
    display: 'inline-block',
    textAlign: 'center',
    verticalAlign: 'middle',
    position: 'absolute',
    top: '0',
    bottom: '10px',
    left: '50%',
    opacity: '.5',
  }));
  const onZoom = useCallback(() => {
    setShowImagesZoom(true);
  }, []);

  const onClose = useCallback(() => {
    setShowImagesZoom(false);
  }, []);
  if (images.length === 1) {
    return (
      <>
        <img
          role="presentation" // 스크린 리더에게 클릭이 주 기능이 아님을 명시.
          src={`http://localhost:3065/${images[0].src}`}
          alt={images[0].src}
          onClick={onZoom}
        />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }
  if (images.length === 2) {
    return (
      <>
        <img
          role="presentation" // 스크린 리더에게 클릭이 주 기능이 아님을 명시.
          src={`http://localhost:3065/${images[0].src}`}
          alt={images[0].src}
          onClick={onZoom}
          style={img2Style}
        />
        <img
          role="presentation" // 스크린 리더에게 클릭이 주 기능이 아님을 명시.
          src={`http://localhost:3065/${images[1].src}`}
          alt={images[1].src}
          onClick={onZoom}
          style={img2Style}
        />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }
  return (
    <div>
      <img
        role="presentation"
        style={img2Style}
        src={`http://localhost:3065/${images[0].src}`}
        alt={images[0].src}
        onClick={onZoom}
      />
      <div role="presentation" style={carrouselStyle}>
        <img
          role="presentation"
          style={img3Style}
          src={`http://localhost:3065/${images[1].src}`}
          alt={images[1].src}
          onClick={onZoom}
        />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
        <PlusOutlined />
        <br />
        {images.length - 1}개의 사진 더보기
      </div>
    </div>
  );
};

PostImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
};

export default PostImages;
