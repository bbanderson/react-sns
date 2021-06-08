import React, {useCallback} from 'react';
import {Card, Avatar, Button} from 'antd';

const UserProfile = ({setIsLoggedIn}) => {

  const handleLogOut = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  return (
    <Card
      actions={[
        <div key='twit'>짹짹<br />0</div>,
        <div key='followings'>팔로잉<br />0</div>,
        <div key='followers'>팔로워<br />0</div>,
      ]}
    >
      <Card.Meta
        avatar={<Avatar>B</Avatar>}
        title='bbanderson'
      />
      <Button onClick={handleLogOut}>로그아웃</Button>
    </Card>
  );
};

export default UserProfile;