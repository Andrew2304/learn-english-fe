/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button, Card, Flex, Input, Tag } from 'antd';
import React from 'react';
import { LearnType } from '../../helpers';
import { SoundOutlined } from '@ant-design/icons';

export default function WordCard({
  item,
  typeLearn,
  getTitle,
  onChangeInput,
  handleSoundOne,
  handleSoundRepeat,
}: {
  item: any;
  typeLearn: LearnType;
  getTitle: (text: string) => string;
  onChangeInput: (value: any, item: any) => void;
  handleSoundOne: (item: any) => void;
  handleSoundRepeat: (item: any) => void;
}) {
  return (
    <Card
      title={`${getTitle(item?.name)}${item.count ? ` - ${item?.count}` : ''}`}
      bordered={false}
      style={{ width: 343, textAlign: 'center' }}
      key={item?.id}
    >
      <Flex justify={'space-between'} align={'center'}>
        <span style={{ color: '#1677ff' }}>/{item?.pronunciation}/</span>
        <span>{item?.type}</span>
      </Flex>

      <Flex justify={'flex-start'} align={'center'}>
        <b>{item?.translation}</b>
      </Flex>

      {typeLearn === LearnType.LEARN_LISTEN && (
        <>
          <Flex justify={'flex-start'} align={'center'}>
            <span className="text-left">{item?.example}</span>
          </Flex>
          <Flex justify={'flex-start'} align={'center'}>
            <span style={{ color: '#8c8c8c' }} className="text-left">
              /{item?.description}/
            </span>
          </Flex>
          <Flex justify={'flex-start'} align={'center'}>
            <span className="text-left">{item?.exampleTranslation}</span>
          </Flex>
        </>
      )}

      {typeLearn === LearnType.LEARN_VOCABULARY && (
        <Flex justify={'flex-start'} align={'center'} className="mt-2">
          <Input.OTP
            length={item.name.length}
            onChange={(value) => onChangeInput(value, item)}
          />
        </Flex>
      )}

      <Flex justify={'flex-end'} align={'center'} className="mt-2">
        {item?.listen && <Tag color="blue">L-{item?.listen?.count}</Tag>}
        {item?.write && <Tag color="green">W-{item?.write?.count}</Tag>}
        <Button
          tabIndex={-1}
          icon={<SoundOutlined />}
          onClick={() => handleSoundOne(item)}
        />
        <Button
          tabIndex={-1}
          // type="primary"
          className="ml-1"
          icon={<SoundOutlined />}
          onClick={() => handleSoundRepeat(item)}
        />
      </Flex>
    </Card>
  );
};

