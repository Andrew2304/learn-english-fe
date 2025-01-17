'use client'
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { MinusCircleOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Card, Col, Flex, Form, Input, notification, Row, Space, Tag, Timeline, Tooltip, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { apiUrl } from '../../../helpers'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation';
import { NotificationType, QuestionTypes } from '../../helpers'
import dayjs from 'dayjs'

export default function Page() {
  const [api, contextHolder] = notification.useNotification();

  let { id } = useParams();
  const router = useRouter()
  
  const [formCreate] = Form.useForm();
  const [formUpdate1] = Form.useForm();
  const [formUpdate2] = Form.useForm();
  const [formUpdate3] = Form.useForm();
  const [formUpdate4] = Form.useForm();
  const [formUpdate5] = Form.useForm();
  const functions: any = {
    formUpdate1: () => formUpdate1,
    formUpdate2: () => formUpdate2,
    formUpdate3: () => formUpdate3,
    formUpdate4: () => formUpdate4,
    formUpdate5: () => formUpdate5,
  };

  const [isLoading, setIsLoading] = useState<any>(true);
  const [lesson, setLesson] = useState<any>(null);
  const [topics, setTopics] = useState<any>(null);
  const [lessons, setLessons] = useState<any>(null);
  const [words, setWords] = useState<any>([
    { title: '' },
    { title: '' },
    { title: '' },
    { title: '' },
    { title: '' },
  ]);


  const openNotificationWithIcon = (type: NotificationType, message?: string) => {
    api[type]({
      message: '',
      description: message ? message : 'Write success',
      duration: 2,
    })
  }

  const fetchData = async (id: any) => {
    try {
      const response =  await axios.get(
        `${apiUrl}/lesson/${id}`,
      );
      return response.data 
    } catch (err: any) {
      console.log('error fetchData');
      return null;
    }
  };
  const fetchTopics = async () => {
    try {
      const response =  await axios.get(
        `${apiUrl}/lesson/topics`,
      );
      return response.data 
    } catch (err: any) {
      console.log('error fetchTopics');
      return null;
    }
  };
  const fetchLessons = async () => {
    try {
      const response =  await axios.get(
        `${apiUrl}/lesson`,
      );
      return response.data 
    } catch (err: any) {
      console.log('error fetchLessons')
      return null;
    }
  };

  const createLesson = async (data: any) => {
    try {
      const response = await axios.post(`${apiUrl}/lesson`, data);
      openNotificationWithIcon('success', "Create success");
      return response.data;
    } catch (err: any) {
      console.log('error createLesson');
      return null;
    }
  };
  const updateLesson = async (data: any) => {
    try {
      const response = await axios.patch(`${apiUrl}/lesson/${lesson.id}`, data);
      openNotificationWithIcon('success', "Update success");
      return response.data;
    } catch (err: any) {
      console.log('error updateLesson');
      return null;
    }
  };
  const updateQuestions = async (data: any) => {
    try {
      const response = await axios.patch(`${apiUrl}/lesson/${lesson.id}/questions`, data);
      openNotificationWithIcon('success', "Update success");
      return response.data;
    } catch (err: any) {
      console.log('error createLesson');
      return null;
    }
  };

  const onCreateOrUpdateLesson: any = async (values: any) => {
    console.log("values", values);
    const words = values.words.filter((item: any) => !!item.description);
    const data = {
      topic: values?.topic ?? "common",
      words,
    }
    
    if (id === '0') {
      id = await createLesson(data)
    } else {
      await updateLesson(data)
    }

    if (id) {
        setWords(words);
        let lesson = await fetchData(id);
        lesson = {
          ...lesson, lessonWords: lesson?.lessonWords.map((item: any) => ({
            ...item,
            contents: [
              { lessonWordId: item.id, type: 'What' },
              { lessonWordId: item.id, type: 'When' },
              { lessonWordId: item.id, type: 'Where' },
              { lessonWordId: item.id, type: 'Who' },
              { lessonWordId: item.id, type: 'Why' },
            ]
        }))}
        setLesson(lesson);
      }
  }

  const onUpdateQuestions = async (values: any) => {
    console.log(values);
    const contents = values.contents.filter((item: any) => item.question);
    console.log('contents', contents)
    await updateQuestions({contents})
  }
  const onGetTopics = async () => {
    const topics = await fetchTopics();
    setTopics(topics);
  }
  const onGetLessons = async () => {
    let lessons = await fetchLessons();
    lessons = lessons.map((item: any) => {
      let questionCount = 0;
      let answerCount = 0;
      
      item.lessonWords?.map((word: any) => {
        word?.lessonQuestions?.map((question: any) => {
          questionCount++;

          if (question.lessonAnswer) {
            answerCount++;
          }
        })
      })
      return {
        label: `${item.title} ${dayjs(item.createdAt).format('HH:MM')}`,
        children: `${item.id} - ${item.topic}(${item.lessonWords.length} | ${questionCount} | ${answerCount})`,
        color: item.lessonWords.length < 5 ? 'red' : 'blue',
        ...item,
      }
    })
    console.log(lessons);
    setLessons(lessons);
  }

  const onGetData = async (id: any) => {
    let lesson = await fetchData(id);

    if (!lesson) return;
    
    console.log('lesson', lesson)
    const words = lesson?.lessonWords?.map((item: any) => ({
      description: item.description,
      type: item.type,
      pronunciation: item.pronunciation,
      translation: item.translation,
    }))
    setWords(words);

    lesson = {
      ...lesson,
      lessonWords: lesson?.lessonWords.map((item: any) => ({
        ...item,
        contents: QuestionTypes.map((type: any) => {
          const question = item.lessonQuestions.find(
            (question: any) => question.type === type,
          )
          return {
            type,
            lessonWordId: item?.id,
            question: question?.question,
            answer: question?.lessonAnswer?.answer,
          }
        }),
      })),
    }
    setLesson(lesson);

    console.log(lesson)

    formCreate.setFieldsValue({
      topic: lesson.topic,
      words,
    });

    
  }

  useEffect(() => {
    if (id) {
      onGetData(id);
    }

    onGetTopics();
    onGetLessons();
    setIsLoading(false);
    }, [id]);

  return (
    <div className="max-w-screen-2xl items-center justify-items-center min-h-screen p-8 pb-20 gap-16 gap-16 font-[family-name:var(--font-geist-sans)] m-home">
      
      {!isLoading &&
        <Row gutter={24} style={{ width: '100%' }}>
          <Col span={18}>
            <Card
              title={
                <Row justify="space-between">
                  <Typography.Title level={2}>
                    {id === '0' ? 'Create Lesson' : `Lesson ${lesson?.title}`}
                  </Typography.Title>
                  <div>
                  {id !== '0' && (
                    <Button
                      className="ml-2 add-btn"
                      onClick={() => router.push('/lesson/0')}
                      type="text"
                      size="large"
                    >+ New</Button>
                  )}
                  <Button
                    className="ml-2 add-btn"
                    onClick={() => router.push('/')}
                    type="text"
                    size="large"
                  >Home</Button>

                  </div>
                </Row>
              }
              bordered={false}
              style={{ width: '100%' }}
            >
              <Form
                name="create-lesson-form"
                form={formCreate}
                onFinish={onCreateOrUpdateLesson}
                autoComplete="off"
                initialValues={{
                  words,
                }}
              >
                <Form.Item name="topic" style={{ width: 240 }}>
                  <Input placeholder="Topic" />
                </Form.Item>

                <Form.List name="words">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Space
                          key={key}
                          style={{ display: 'flex' }}
                          align="baseline"
                        >
                          <Form.Item
                            {...restField}
                            name={[name, 'description']}
                            style={{ width: 240 }}
                          >
                            <Input placeholder="Word" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'type']}
                            style={{ width: 240 }}
                          >
                            <Input placeholder="Type" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'pronunciation']}
                            style={{ width: 240 }}
                          >
                            <Input placeholder="Pronunciation" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'translation']}
                            style={{ width: 240 }}
                          >
                            <Input placeholder="Translation" />
                          </Form.Item>
                          <MinusCircleOutlined
                            onClick={() => remove(name)}
                            style={{ color: '#ff4d4f' }}
                          />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Add row
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
                <Button color="primary" variant="dashed" htmlType="submit">
                  {id === '0' ? 'Create' : 'Update'}
                </Button>
              </Form>
            </Card>
            {lesson?.lessonWords?.map((item: any, index: number) => (
              <Card
                key={item.id}
                title={item.description}
                bordered={false}
                style={{ width: '100%' }}
                className="mt-4"
              >
                <Form
                  form={functions[`formUpdate${index + 1}`]()}
                  name={item.id}
                  onFinish={onUpdateQuestions}
                  autoComplete="off"
                  initialValues={{
                    contents: item?.contents,
                  }}
                >
                  <Form.List name="contents">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Space
                            key={`${item.id}-${key}`}
                            style={{ display: 'flex' }}
                            align="baseline"
                          >
                            <Form.Item
                              {...restField}
                              name={[name, 'lessonWordId']}
                              style={{ width: 50 }}
                            >
                              <Input disabled />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'type']}
                              style={{ width: 80 }}
                            >
                              <Input placeholder="Type" />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'question']}
                              style={{ width: 410 }}
                            >
                              <Input placeholder="Question" />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'answer']}
                              style={{ width: 410 }}
                            >
                              <Input placeholder="Answer" />
                            </Form.Item>
                            <MinusCircleOutlined
                              onClick={() => remove(name)}
                              style={{ color: '#ff4d4f' }}
                            />
                          </Space>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Add row
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                  <Button color="primary" variant="dashed" htmlType="submit">
                    Update
                  </Button>
                </Form>
              </Card>
            ))}
          </Col>
          <Col span={6}>
            <Card title={'Topic'} bordered={false} style={{ width: '100%' }}>
              <Flex gap="4px 0" wrap>
                {topics?.map((item: any) => (
                  <Tag key={item.topic}>{item.topic}</Tag>
                ))}
              </Flex>
            </Card>

            <Card
              className="mt-4"
              title={'History'}
              bordered={false}
              style={{ width: '100%' }}
            >
              <Timeline mode={'left'} items={lessons} />
            </Card>
          </Col>
        </Row>
      }

      {contextHolder}
    </div>
  )
}