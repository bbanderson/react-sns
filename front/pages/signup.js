import AppLayout from '../components/AppLayout';
import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import { Button, Checkbox, Form, Input } from 'antd';
import useInput from '../hooks/useInput';
import styled from 'styled-components';
import { SIGN_UP_REQUEST } from '../reducers/user';
const ErrorMessage = styled.div`
  color: red;
`;

const Signup = () => {
  const dispatch = useDispatch();
  const { isSigningUp } = useSelector((state) => state.user);
  const [email, onChangeEmail] = useInput('');
  const [nickName, onChangeNickName] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password]
  );

  const [term, setTerm] = useState('');
  const [termError, setTermError] = useState(false);
  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, []);

  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) {
      setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    console.log(email, nickName, password);
    dispatch({ type: SIGN_UP_REQUEST, data: { email, password, nickName } });
  }, [email, password, passwordCheck, term]);

  return (
    <>
      <Head>
        <title>회원가입 | SNS</title>
      </Head>
      <AppLayout>
        <Form onFinish={onSubmit}>
          <div>
            <label htmlFor="user-email">이메일</label>
            <br />
            <Input
              type="email"
              name="user-email"
              value={email}
              onChange={onChangeEmail}
              required
            />
          </div>
          <div>
            <label htmlFor="user-nickname">닉네임</label>
            <br />
            <Input
              name="user-nickname"
              value={nickName}
              onChange={onChangeNickName}
              required
            />
          </div>
          <div>
            <label htmlFor="user-password">비밀번호</label>
            <br />
            <Input
              name="user-password"
              type="password"
              value={password}
              onChange={onChangePassword}
              required
            />
          </div>
          <div>
            <label htmlFor="user-password-check">비밀번호 확인</label>
            <br />
            <Input
              name="user-password-check"
              type="password"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
              required
            />
            {passwordError && (
              <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
            )}
          </div>
          <div>
            <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
              내 말을 잘 들을 것을 동의합니다.
            </Checkbox>
            {termError && (
              <ErrorMessage>약관에 동의하셔야 합니다.</ErrorMessage>
            )}
          </div>
          <div>
            <Button type="primary" htmlType="submit" loading={isSigningUp}>
              가입
            </Button>
          </div>
        </Form>
      </AppLayout>
    </>
  );
};

export default Signup;
