/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button, Card, Col, Flex, Input, notification, Pagination, PaginationProps, Row, Select, Switch } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { apiUrl, LearnType, LogType, sleep, WordType } from '../helpers';
import WordCard from './components/WordCard';
import { NotificationType } from './helpers';
import Link from 'next/link';


export default function Home() {
  
  const [params, setParams] = useState<any>({
    wordType: "",
    keyword: "",
    page: 1,
    size: 8,
  });
  const [data, setData] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any>(null);
  const [typeLearn, setTypeLearn] = useState(LearnType.LEARN_LISTEN);
  const [typeWord, setTypeWord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isShowHistory, setIsShowHistory] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type: NotificationType, message?: string) => {
    api[type]({
      message: '',
      description: message ? message : 'Write success',
      duration: 2,
    });
  };

  const fetchData = async () => {
    try {
      const skip = (params.page - 1) * params.size;
      const response = await axios.get(
        `${apiUrl}/words?take=${params.size}&skip=${skip}&wordType=${params.wordType}&keyword=${params.keyword}`,
      );
      setData(response.data);
    } catch (err: any) {
      setError(err.message);
      console.log('error fetchData');
    }
  };

  const fetchHistoryData = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/histories?take=1000&skip=0`,
      );
      setHistoryData(response.data);
    } catch (err: any) {
      setError(err.message);
      console.log('error fetchHistoryData');
    }
  };


  const writeWordSuccessLog = async (wordId: number, type: LogType, description?: string) => {
    try {
      await axios.post(`${apiUrl}/histories`, {
        wordId,
        type: LogType[type],
        description,
      });
    } catch (err: any) {
      setError(err.message);
      console.log('error writeWordSuccessLog');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSoundOne = (item: any) => {
    const audio = new Audio(item?.pronunciationLink);
    audio.play();
    setIsPlaying(true);

    audio.onended = () => {
      setIsPlaying(false);
      writeWordSuccessLog(item?.id, LogType.LISTEN);
    };
  }

  const handleSoundRepeat = (item: any) => {
    let count = 1;
    const audio = new Audio(item?.pronunciationLink);
    audio.play();
    setIsPlaying(true);

    audio.onended = () => {
      count++;
      setIsPlaying(false);
      setTimeout(() => {
        if (count === 5) audio.pause();
        else audio.play();
      }, 500)
    };
  }
  

  const  onPlayAll = async() => {
    for (let i = 0; i < data?.data?.length - 1; i++) {
      const item = data?.data[i];
      const audio = new Audio(item?.pronunciationLink);
      audio.play();
      await sleep(1500);
    }
  }

  const onChangeInput = (text: string, item: any) => {
    if (text === item.name.toLowerCase()) {
      writeWordSuccessLog(item.id, LogType.WRITE);
      openNotificationWithIcon('success');
    }
    if (text.length === item.name.length && text !== item.name.toLowerCase()) {
      writeWordSuccessLog(item.id, LogType.WRITE_ERROR, text);
      openNotificationWithIcon('error', 'Write error');
    }
  };

  

  const onChangeType = (value: LearnType) => {
    setTypeLearn(value);
  };
  const onChangeWordType = (value: WordType) => {
    setTypeWord(value);
    setParams((prev: any) => {
      return { ...prev, page: 1, wordType: value };
    });
  };
  const changeIsShowHistory = (value: any) => {
    setIsShowHistory(value);
  };
  const onChangeFind = () => {
    fetchData();
    fetchHistoryData();
  };

  const onChangePagination: PaginationProps['onChange'] = (pageNumber) => {
    setParams((prev: any) => {
      return {...prev, page: pageNumber };
    })
  };
  const onShowSizeChange = (currentPage: number, size: number) => {
    setParams((prev: any) => {
      return { ...prev, page: currentPage, size };
    });
  }
  const getTitle = (title: string) => {
    title = title.toLowerCase();
    if (typeLearn === LearnType.LEARN_VOCABULARY) return `${title[0]}${'*'.padEnd(title.length - 1, '*')}`;
    else return title;
  }

  
  
  useEffect(() => {
    fetchData();
    fetchHistoryData();
    setLoading(false);
  }, [params]);
  
  return (
    <div className="max-w-screen-2xl items-center justify-items-center min-h-screen p-8 pb-20 gap-16 gap-16 font-[family-name:var(--font-geist-sans)] m-home">
      {!loading && (
        <>
          <Row gutter={24}>
            <Col span={24}>
              <Select
                style={{ width: '200px' }}
                showSearch
                onChange={onChangeType}
                placeholder="Select type"
                optionFilterProp="label"
                defaultValue={LearnType.LEARN_LISTEN}
                options={[
                  {
                    value: LearnType.LEARN_LISTEN,
                    label: 'Học nghe',
                  },
                  {
                    value: LearnType.LEARN_VOCABULARY,
                    label: 'Học từ vựng',
                  },
                ]}
              />
              <Select
                className="ml-2"
                style={{ width: '200px' }}
                showSearch
                onChange={onChangeWordType}
                placeholder="Select word"
                optionFilterProp="label"
                defaultValue={null}
                options={[
                  {
                    value: '',
                    label: 'Tất cả từ',
                  },
                  {
                    value: WordType.LEARN,
                    label: 'Từ chưa học',
                  },
                  {
                    value: WordType.LEARNED,
                    label: 'Từ đã học',
                  },
                ]}
              />
              <Switch
                className="ml-2"
                onChange={changeIsShowHistory}
                checkedChildren="Hide history"
                unCheckedChildren="Show history"
              />
              <Input
                placeholder="Enter for find: word ..."
                className="ml-2"
                style={{ width: '200px' }}
              />
            </Col>
          </Row>

          <Flex justify={'flex-end'} align={'center'}>
            <Button type="default" className="mt-4" onClick={onPlayAll}>
              Play all
            </Button>
            <Button type="primary" className="mt-4 ml-2" onClick={onChangeFind}>
              Refresh
            </Button>
            <Link href="/lesson/0">
              <Button className="mt-4 ml-2" color="primary" variant="dashed">
                Lesson
              </Button>
            </Link>
          </Flex>

          <Row gutter={24} className="mt-4">
            <Col span={24}>
              <Pagination
                total={data?.count}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} | ${total}`
                }
                onChange={onChangePagination}
                onShowSizeChange={onShowSizeChange}
                showSizeChanger
                showQuickJumper
                pageSize={params.size}
                current={params.page}
                pageSizeOptions={['8', '16', '64', '160']}
              />
            </Col>
          </Row>

          <Row gutter={24} className="mt-4">
            <Col span={24}>
              <Flex wrap gap="20px">
                {data?.data?.map((item: any) => (
                  <WordCard
                    key={item.id}
                    item={item}
                    typeLearn={typeLearn}
                    getTitle={getTitle}
                    onChangeInput={onChangeInput}
                    handleSoundOne={handleSoundOne}
                    handleSoundRepeat={handleSoundRepeat}
                  />
                ))}
              </Flex>
            </Col>
          </Row>

          {isShowHistory === true && (
            <>
              <Row gutter={24} className="mt-4">
                <Col span={24}>
                  <Card
                    title="Summary"
                    bordered={false}
                    style={{ width: 300, textAlign: 'center' }}
                  >
                    <Flex justify={'space-between'} align={'center'}>
                      <span>Tồng từ:</span>
                      <b>{historyData?.wordTotal}</b>
                    </Flex>
                    <Flex justify={'space-between'} align={'center'}>
                      <span>Tồng từ đúng:</span>
                      <b style={{ color: '#1890ff' }}>
                        {historyData?.learnedCount}
                      </b>
                    </Flex>
                    <Flex justify={'space-between'} align={'center'}>
                      <span>Tồng từ sai:</span>
                      <b style={{ color: '#fa8c16' }}>
                        {historyData?.wordErrorData?.total}
                      </b>
                    </Flex>
                    <Flex justify={'space-between'} align={'center'}>
                      <span>Tổng từ chưa học:</span>
                      <b>{historyData?.learningCount}</b>
                    </Flex>
                  </Card>
                </Col>
              </Row>
              <Row gutter={24} className="mt-4">
                <Flex wrap gap="20px">
                  {historyData?.wordErrorData?.data?.map((item: any) => (
                    <WordCard
                      key={item.id}
                      item={item}
                      typeLearn={typeLearn}
                      getTitle={getTitle}
                      onChangeInput={onChangeInput}
                      handleSoundOne={handleSoundOne}
                      handleSoundRepeat={handleSoundRepeat}
                    />
                  ))}
                </Flex>
              </Row>
            </>
          )}
        </>
      )}

      {contextHolder}
    </div>
  )
}
