import React, { useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Card, Avatar, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequestAction } from '../reducers/user';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { me, isLoggingOut } = useSelector((state) => state.user);
  const handleLogOut = useCallback(() => {
    dispatch(logoutRequestAction());
  }, []);

  return (
    <Card
      actions={[
        <div key="twit">
          <Link href={`/user/${me.id}`}>
            <a>짹짹</a>
          </Link>
          <br />
          {me.Posts.length}
        </div>,
        <div key="followings">
          <Link href="/profile">
            <a>팔로잉</a>
          </Link>
          <br />
          {me.Followings.length}
        </div>,
        <div key="followers">
          <Link href="/profile">
            <a>팔로워</a>
          </Link>
          <br />
          {me.Followers.length}
        </div>,
      ]}
    >
      <Card.Meta
        avatar={<Avatar>{me.nickname[0]}</Avatar>}
        title={me.nickname}
      />
      <Button onClick={handleLogOut} loading={isLoggingOut}>
        로그아웃
      </Button>
    </Card>
  );
};

export default UserProfile;
