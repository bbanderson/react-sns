import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, List } from 'antd';
import {StopOutlined} from '@ant-design/icons';


const listStyle = {
  marginBottom: 20
};

const grid = {
  gutter: 4,
  xs: 2,
  md: 3
};

const moreStyle = {
  textAlign: 'center',
  margin: '10px 0'
};

const itemStyle = {
  marginTop: 20
};

const FollowList = ({header, data}) => {
  return (
    <List
    style={listStyle}
    grid={grid}
    size="small"
    header={<div>{header}</div>}
    loadMore={<div style={moreStyle}><Button>더 보기</Button></div>}
    bordered
    dataSource={data}
    renderItem={(item) => (
      <List.Item style={itemStyle}>
        <Card actions={[<StopOutlined key="stop" />]}>
          <Card.Meta description={item.nickname} />
        </Card>
      </List.Item>
    )}
    />
  )
};

FollowList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired
};

export default FollowList;