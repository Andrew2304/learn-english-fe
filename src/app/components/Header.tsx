/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { UserOutlined } from "@ant-design/icons";
import { Dropdown, Flex, notification } from "antd";
import { useEffect, useState } from "react";
import { NotificationType, USER_LOGIN_KEY } from "../helpers";
import { getLocalStorage, setLocalStorage } from "../helpers/localstorage";

export default function Header() {
  const [api, contextHolder] = notification.useNotification();
  
  const [user, setUser] = useState<any>(null);
  const users: any[] = [
    { id: 1, name: 'Phạm Tuấn', key: '1111' },
    { id: 2, name: 'Phạm Hà', key: '1235' },
    { id: 3, name: 'TK mặc định', key: '1234' },
  ];

  const openNotificationWithIcon = (type: NotificationType, message?: string) => {
      api[type]({
        message: '',
        description: message ? message : 'Write success',
        duration: 2,
      })
    }

  const items: any[] = users.map((item: any) => ({
    label: item.name,
    key: item.id,
    icon: <UserOutlined />,
  }));

  const handleMenuClick: any = (e: any) => {
    const key = prompt('What is your key?');
    
    const user = users.find(user => user.id === +e?.key && user?.key === key);
    setLocalStorage(USER_LOGIN_KEY, user);
    setUser(user);

    if (user) {
      openNotificationWithIcon('success', "Login success");
      setTimeout(() => {
        location.replace("/");
      }, 1000)
    } else {
      openNotificationWithIcon('error', "Login fail")
    }

};

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  useEffect(() => {
    const user = getLocalStorage(USER_LOGIN_KEY);
    setUser(user)
      }, []);

  return (
    <Flex justify={'flex-end'} align={'center'}>
      <div className="m-header">
        <Dropdown.Button
          menu={menuProps}
          placement="bottom"
          icon={<UserOutlined />}
          danger
        >
          {user?.name}
        </Dropdown.Button>
      </div>
      {contextHolder}
    </Flex>
  )
}