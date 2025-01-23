'use client'
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { MinusCircleOutlined, NodeIndexOutlined, PauseCircleOutlined, PlayCircleOutlined, PlusCircleOutlined, PlusOutlined, SoundOutlined } from '@ant-design/icons'
import { Button, Card, Col, Flex, Form, Input, notification, Row, Space, Tag, Timeline, Tooltip, Typography } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { apiUrl } from '../../../helpers'
import { useParams, useRouter } from 'next/navigation';
import { NotificationType, QuestionTypes } from '../../helpers'
import dayjs from 'dayjs'
import TextArea from 'antd/es/input/TextArea'
import { restTransport } from '../../helpers/api'

export default function Page() {
  const [isRecording, setIsRecording] = useState(false)
  const [isWordRecording, setIsWordRecording] = useState(false)
  const [indexRecording, setIndexRecording] = useState<any>(null)
  const [indexWordRecording, setIndexWordRecording] = useState<any>(null)
  const [pronunciationLinks, setPronunciationLinks] = useState<any>([])
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  
  const [api, contextHolder] = notification.useNotification();

  let { id } = useParams();
  const router = useRouter()
  
  const [formCreate] = Form.useForm();
  const [formUpdate1] = Form.useForm();
  const [formUpdate2] = Form.useForm();
  const [formUpdate3] = Form.useForm();
  const [formUpdate4] = Form.useForm();
  const [formUpdate5] = Form.useForm();
  const [formUpdate6] = Form.useForm();
  const [formUpdate7] = Form.useForm();
  const [formUpdate8] = Form.useForm();
  const [formUpdate9] = Form.useForm();
  const [formUpdate10] = Form.useForm();
  const functions: any = {
    formUpdate1: () => formUpdate1,
    formUpdate2: () => formUpdate2,
    formUpdate3: () => formUpdate3,
    formUpdate4: () => formUpdate4,
    formUpdate5: () => formUpdate5,
    formUpdate6: () => formUpdate6,
    formUpdate7: () => formUpdate7,
    formUpdate8: () => formUpdate8,
    formUpdate9: () => formUpdate9,
    formUpdate10: () => formUpdate10,
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

  const axios = restTransport();

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
      return response?.data 
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
      return response?.data 
    } catch (err: any) {
      console.log('error fetchTopics', err)
      return null;
    }
  };
  const fetchLessons = async () => {
    try {
      const response =  await axios.get(
        `${apiUrl}/lesson`,
      );
      return response?.data 
    } catch (err: any) {
      console.log('error fetchLessons')
      return null;
    }
  };

  const createLesson = async (data: any) => {
    try {
      const response = await axios.post(`${apiUrl}/lesson`, data);
      openNotificationWithIcon('success', "Create success");
      return response?.data;
    } catch (err: any) {
      console.log('error createLesson');
      return null;
    }
  };
  const updateLesson = async (data: any) => {
    try {
      const response = await axios.patch(`${apiUrl}/lesson/${lesson.id}`, data);
      openNotificationWithIcon('success', "Update success");
      return response?.data;
    } catch (err: any) {
      console.log('error updateLesson');
      return null;
    }
  };
  const updateQuestions = async (data: any) => {
    try {
      const response = await axios.patch(`${apiUrl}/lesson/${lesson.id}/questions`, data);
      openNotificationWithIcon('success', "Update success");
      return response?.data;
    } catch (err: any) {
      console.log('error createLesson');
      return null;
    }
  };

  const onCreateOrUpdateLesson: any = async (values: any) => {
    console.log('values', values)
    const dataWords = values.words.filter((item: any) => !!item.description);
    const data = {
      topic: values?.topic ?? 'common',
      words: dataWords.map((item: any, index: any) => ({
        ...item,
        pronunciationLink: words[index]?.pronunciationLink?? '',
      })),
      description: values.description,
    }
    
    if (id === '0') {
      id = await createLesson(data)
    } else {
      await updateLesson(data)
    }

    if (id) {
        onGetData(id)
      }
  }

  const onUpdateQuestions = async (values: any) => {
    let contents = values.contents.filter((item: any) => item.question);
    contents = contents.map((item: any, index: number) => {
      const itemLink = pronunciationLinks.find(
        (item1: any) =>
          item.lessonWordId === item1.wordId && item1.index === index,
      )
      console.log(itemLink)
      return {
      ...item,
      pronunciationLink: itemLink?.pronunciationLink,
    }
    })

    console.log("contents", contents);
    await updateQuestions({contents, typeCount: QuestionTypes.length})
  }
  const onGetTopics = async () => {
    const topics = await fetchTopics();
    if (topics) {
      setTopics(topics);
    }
  }
  const onGetLessons = async () => {
    let lessons = await fetchLessons();

    if (lessons) {
      lessons = lessons?.map((item: any) => {
        let questionCount = 0;
        let answerCount = 0;
        const typeQuestionCount = QuestionTypes.length;
        const questionTotal = typeQuestionCount * item.lessonWords.length;
        
        item.lessonWords?.map((word: any) => {
          word?.lessonQuestions?.map((question: any) => {
            questionCount++;
  
            if (question.lessonAnswer?.answer) {
              answerCount++;
            }
          })
        })
        return {
          label: `${item.title} ${dayjs(item.createdAt).format('HH:MM')}`,
          children: `${item.id} - ${item.topic}(${item.lessonWords.length} | ${questionCount}/${questionTotal} | ${answerCount}/${questionTotal})`,
          isComplete: questionCount < questionTotal ? false : true,
          ...item,
        }
      })
      console.log(lessons);
      setLessons(lessons);
    }
  }

  const onGetData = async (id: any) => {
    let lesson = await fetchData(id);

    if (!lesson) return;

    lesson?.lessonWords.sort((a: any, b: any) => {
      return a.id - b.id;
    });
    
    console.log('lesson', lesson)
    const words = lesson?.lessonWords?.map((item: any) => ({
      id: item.id,
      description: item.description,
      type: item.type,
      pronunciation: item.pronunciation,
      pronunciationLink: item.pronunciationLink,
      translation: item.translation,
    }))
    setWords(words);

    const questionLinks: any[] = [];
      lesson?.lessonWords?.map((item: any) => {
      item?.lessonQuestions?.map((item1: any, index: number) => {
        questionLinks.push({
          wordId: item.id,
          index,
          pronunciationLink: item1.pronunciationLink,
        })  
      })
    })

    setPronunciationLinks(questionLinks)

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

    setTimeout(() => {
      setLesson(lesson);
      formCreate.setFieldsValue({
        topic: lesson.topic,
        description: lesson.description,
        words,
      })
    }, 200)
  }

  const onToLesson = (id: number) => {
    router.push(`/lesson/${id}`)
  }

  const startRecording = async (type: string, index: number, wordId?: number) => {
    
    setIndexRecording(index)
    if (type === 'question') setIndexWordRecording(wordId)
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      audioChunks.current.push(event.data)
    }

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' })
      const formData = new FormData()

      const wordTitle =
        words.find((item: any) => item.id === wordId)?.description ||
        words[index]?.description
      const title =
        type === 'words' ? words[index]?.description : `${wordTitle}-${QuestionTypes[index].toLowerCase()}`;
      formData.append('file', audioBlob, 'audio.webm')
      formData.append('title', title)

      const response = await axios.post(`${apiUrl}/lesson/upload-audio`, formData)

      if (type === 'words') {
        words[index].pronunciationLink = response?.data?.mp3Path;
        setWords(words);
        console.log(words)
      } else {
        const mp3Links = pronunciationLinks.filter((item: any) => item.wordId!== wordId || item.index!== index);
        mp3Links.push({
          wordId,
          index,
          pronunciationLink: response?.data?.mp3Path,
        })
        setPronunciationLinks(mp3Links);
        console.log(mp3Links)
      }
      openNotificationWithIcon('success', "Recording success")

      // const audioURL = URL.createObjectURL(audioBlob)
      // setAudioURL(audioURL)
      audioChunks.current = []
    }

    mediaRecorder.start()
    mediaRecorderRef.current = mediaRecorder
    
    if (type === 'question') setIsWordRecording(true)
    else setIsRecording(true)
  }

  const stopRecording = (type: string, index: number) => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
    setIsWordRecording(false)
    setIndexRecording(null)
    setIndexWordRecording(null)
  }

  const playSound = (type: string, index: number, wordId?: number) => {
    let item: any = [];
    if (type === "question") {
      item = pronunciationLinks.find((item: any) => item.wordId === wordId && item.index === index)
    } else {
      item = words[index];
    }

    if (item?.pronunciationLink) {
      const audio = new Audio(`${apiUrl}/files/${item?.pronunciationLink}`);
      audio.play();
    } else {
      openNotificationWithIcon('warning', "Not found audio")
    }
  }

  const onValuesChange = () => {
    const values = formCreate.getFieldsValue();
    const words = values?.words?.map((item: any) => ({
      id: item.id,
      description: item.description,
      type: item.type,
      pronunciation: item.pronunciation,
      pronunciationLink: item.pronunciationLink,
      translation: item.translation,
    }))
    setWords(words);
  }

  useEffect(() => {
    if (id) {
      onGetData(id);
    }

    onGetTopics();
    onGetLessons();
    setIsLoading(false);
    }, [id]);

  if (id !== '0' && !lesson) return null;

  return (
    <div className="max-w-screen-2xl items-center justify-items-center min-h-screen p-8 pb-20 gap-16 gap-16 font-[family-name:var(--font-geist-sans)] m-home">
      {!isLoading && (
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
                      >
                        + New
                      </Button>
                    )}
                    <Button
                      className="ml-2 add-btn"
                      onClick={() => router.push('/')}
                      type="text"
                      size="large"
                    >
                      Home
                    </Button>
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
                onValuesChange={onValuesChange}
              >
                <Form.Item name="topic" style={{ width: 200 }}>
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
                          <Form.Item {...restField} name={[name, 'id']} hidden>
                            <Input />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'description']}
                            style={{ width: 200 }}
                          >
                            <Input placeholder="Word" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'type']}
                            style={{ width: 200 }}
                          >
                            <Input placeholder="Type" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'pronunciation']}
                            style={{ width: 200 }}
                          >
                            <Input placeholder="Pronunciation" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'translation']}
                            style={{ width: 200 }}
                          >
                            <Input placeholder="Translation" />
                          </Form.Item>
                          <MinusCircleOutlined
                            onClick={() => remove(name)}
                            style={{ color: '#ff4d4f' }}
                          />
                          <Form.Item {...restField}
                            className='ml-16'
                          >
                            {isRecording && indexRecording === key && (
                              <Button
                                onClick={() => stopRecording('words', key)}
                                icon={<PauseCircleOutlined />}
                                danger
                              />
                            )}
                            {(!isRecording || indexRecording !== key) && (
                              <Button
                                onClick={() => startRecording('words', key)}
                                icon={<PlayCircleOutlined />}
                              />
                            )}
                              <Button
                              className="ml-2"
                              icon={<SoundOutlined />}
                              onClick={() => playSound("words", key)}
                            />
                          </Form.Item>
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

                <Form.Item name="description">
                  <TextArea
                    placeholder="Description"
                    autoSize={{ minRows: 4, maxRows: 6 }}
                  />
                </Form.Item>

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
                              name={[name, 'id']}
                              hidden
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'lessonWordId']}
                              hidden
                            >
                              <Input />
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
                              style={{ width: 335 }}
                            >
                              <Input placeholder="Question" />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'answer']}
                              style={{ width: 335 }}
                            >
                              <Input placeholder="Answer" />
                            </Form.Item>
                            <MinusCircleOutlined
                              onClick={() => remove(name)}
                              style={{ color: '#ff4d4f' }}
                            />
                            <Form.Item {...restField} className='ml-16'>
                              {isWordRecording &&
                                indexRecording === key &&
                                indexWordRecording === item.id && (
                                  <Button
                                    onClick={() =>
                                      stopRecording('question', key)
                                    }
                                    icon={<PauseCircleOutlined />}
                                    danger
                                  />
                                )}
                              {(!isWordRecording ||
                                indexRecording !== key ||
                                indexWordRecording !== item.id) && (
                                <Button
                                  onClick={() =>
                                    startRecording('question', key, item.id)
                                  }
                                  icon={<PlayCircleOutlined />}
                                />
                              )}
                              <Button
                                className="ml-2"
                                icon={<SoundOutlined />}
                                onClick={() => playSound('question', key, item.id)}
                              />
                            </Form.Item>
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
              {lessons?.map((item: any) => (
                <p
                  key={item.id}
                  onClick={() => onToLesson(item.id)}
                  className="m-history-text"
                >
                  <a
                    className={item.isComplete ? '' : 'm-text-warning'}
                  >{`${item.label} - ${item.children}`}</a>
                </p>
              ))}
            </Card>
          </Col>
        </Row>
      )}

      {contextHolder}
    </div>
  )
}