// 특정 컴포넌트끼리 공통인 사항들은 AppLayout.js처럼 공통점을 따로 컴포넌트화하여 각각 감싸준다.

import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import styled, { createGlobalStyle } from 'styled-components';
import PropTypes from 'prop-types';
import Router from 'next/router';
import Link from 'next/link';
import { Menu, Input, Row, Col } from 'antd';

import UserProfile from './UserProfile';
import LoginForm from './LoginForm';
import useInput from '../hooks/useInput';

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

const Global = createGlobalStyle` // Gutter 버그 해결
  .ant-row {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  
  .ant-col:first-child {
    padding-left: 0 !important;
  }
  
  .ant-col:last-child {
    padding-right: 0 !important;
  }
`;

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user); // me이 바뀌면 AppLayout 컴포넌트가 자동으로 리렌더링 된다.
  const [searchInput, onChangeSearchInput] = useInput('');
  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);
  return (
    <div>
      <Global />
      <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/">
            <a>홈</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <SearchInput
            enterButton
            value={searchInput}
            onChange={onChangeSearchInput}
            onSearch={onSearch}
          />
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup">
            <a>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu>
      <Row gutter={100}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a
            href="https://github.com/bbanderson"
            target="_blank"
            rel="noreferrer noopener"
          >
            Made by bbanderson
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
