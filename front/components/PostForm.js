import React, { useRef, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import { addPost } from '../reducers/post';

const PostForm = () => {
  const { imagePaths } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const formStyle = useMemo(() => {
    '10px 0 20px';
  }, []);
  const uploadBtnStyle = useMemo(() => {
    'right';
  }, []);
  const imgPathDivStyle = useMemo(() => {
    'inline-block';
  }, []);
  const imgPreviewStyle = useMemo(() => {
    '200px';
  }, []);
  const [text, setText] = useState('');
  const onChangeText = useCallback((e) => {
    setText(e.target.value);
  });
  const onSubmit = useCallback((e) => {
    dispatch(addPost);
    setText('');
  }, []);
  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);
  return (
    <Form style={formStyle} encType="multipart/form-data" onFinish={onSubmit}>
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="어떤 신기한 일이 있었나요?"
      />
      <div>
        <input type="file" multiple hidden ref={imageInput} />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={uploadBtnStyle} htmlType="submit">
          짹짹
        </Button>
      </div>
      <div>
        {imagePaths.map((v) => (
          <div key={v} style={imgPathDivStyle}>
            <img src={v} style={imgPreviewStyle} alt={v} />
            <div>
              <Button>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
