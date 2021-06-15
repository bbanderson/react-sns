import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, List } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { REMOVE_FOLLOWER_REQUEST, UNFOLLOW_REQUEST } from '../reducers/user';

const listStyle = {
  marginBottom: 20,
};

const grid = {
  gutter: 4, // gutter는 요소 간 간격을 의미함.
  xs: 2,
  md: 3,
};

const moreStyle = {
  textAlign: 'center',
  margin: '10px 0',
};

const itemStyle = {
  marginTop: 20,
};

const FollowList = ({ header, data }) => {
  const dispatch = useDispatch();
  const onCancel = (id) => () => {
    if (header === '팔로잉' || header === '팔로잉 목록') {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: id,
      });
    }
    dispatch({
      type: REMOVE_FOLLOWER_REQUEST,
      data: id,
    });
  };
  return (
    <List
      style={listStyle}
      grid={grid}
      size="small"
      header={<div>{header}</div>}
      loadMore={
        <div style={moreStyle}>
          <Button>더 보기</Button>
        </div>
      }
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={itemStyle}>
          <Card
            actions={[<StopOutlined key="stop" onClick={onCancel(item.id)} />]}
          >
            <Card.Meta description={item.nickname} />
          </Card>
        </List.Item>
      )}
    />
  );
};

FollowList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
};

export default FollowList;
