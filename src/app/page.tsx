'use client'

import { Button, Drawer, Form, Input, InputNumber, Space, Table, Tag, message, Select, Popconfirm, Upload, Popover } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { getColumns } from '../lib/columnHelpers';
import { getInventory, addInventory, deleteInventory, updateInventory, getUrl } from '../lib/inventoryHelpers';
import { UploadOutlined, FileImageOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import Image from 'next/image'
import Link from 'next/link'

const generatePastelColor = () => {
  const r = Math.floor(Math.random() * 128 + 128);
  const g = Math.floor(Math.random() * 128 + 128);
  const b = Math.floor(Math.random() * 128 + 128);

  const rgbaColor = `rgba(${r}, ${g}, ${b}, 0.4)`;

  return rgbaColor;
}


const App: React.FC = () => {

  const [inventory, setInventory] = useState<any>([])
  const [currentData, setCurrentData] = useState<any>(null)
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [columnsData, setColumnsData] = useState<any>([])
  const [currentImage, setCurrentImage] = useState('')

  const setImage = async (bucketId: string, fileId: string) => {
    const url = await getUrl(bucketId, fileId)
    setCurrentImage(url)
  }

  const columns: ColumnsType<any> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Properties',
      key: '$id',
      dataIndex: '$id',
      render: (_, { properties }) => {
        const data = JSON.parse(properties)
        return (
          <>
            {Object.keys(data).map((property) => {
              let color = generatePastelColor()
              return (
                <Tag color={color} style={{ color: 'black', borderColor: color }} key={property}>
                  {property.toUpperCase()}: {
                    Array.isArray(data[property]) ? data[property].join(', ')
                      : typeof data[property] === 'object' && data[property].bucketId && data[property].fileId ?
                        <Popover
                          trigger="click"
                          content={
                            <Image
                              src={currentImage}
                              alt={property}
                              width={150}
                              height={75}
                              className={'w-full object-contain rounded-b-md'}

                            />
                          } title={property}>
                          <FileImageOutlined onClick={() => setImage(data[property].bucketId, data[property].fileId)} />
                        </Popover>
                        : typeof data[property] === 'string' || typeof data[property] === 'number' ? data[property] : ''}
                </Tag>
              );
            })}
          </>
        )
      },
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'name',
      render: (_, record) => (
        <Space size={'large'}>
          <Popconfirm
            title="Delete the Item"
            description="Are you sure to delete this item?"
            onConfirm={() => {
              deleteInventory(record.$id!)
              setInventory([
                ...inventory.filter((item: any) => item.$id !== record.$id),
              ])
              success('Deleted Successfully')
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
          <Button type='default' onClick={() => {
            setCurrentData(record)
            form.setFieldsValue({
              name: record.name,
              ...JSON.parse(record.properties)
            })
            setOpen(true)
          }}>Edit</Button>
        </Space>
      ),
    },
  ];




  const fetchInventory = async () => {
    const data = await getInventory()
    setInventory([...data])
  }

  const fetchColumns = async () => {
    const data = await getColumns()
    setColumnsData([...data])
  }

  useEffect(() => {
    fetchInventory()
    fetchColumns()
  }, [])


  const props: UploadProps = {
    maxCount: 1,
    beforeUpload: (file) => {
      const isValid = file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg';
      if (!isValid) {
        message.error(`${file.name} is not a Image`);
      }
      return isValid || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      console.log(info.fileList);
    },
  };

  const generateField = (column: any) => {
    switch (column.type) {
      case "text":
        return <Input />
      case "number":
        return <InputNumber />
      case "dropdown":
        return <Select
          mode="multiple"
          options={column.dropdown_values.map((item: string) => {
            return {
              value: item,
              label: item
            }
          })}
        />
      case "image":
        return <Upload {...props}>
          <Button icon={<UploadOutlined />}>Upload png only</Button>
        </Upload>
    }
  }


  const success = (message: string) => {
    messageApi.open({
      type: 'success',
      content: message,
    });
  };

  const onAddInventory = async (name: string, values: any) => {
    const properties = values
    delete properties['name']
    const imgProps: string[] = []

    Object.keys(properties).map((property) => {
      if (typeof properties[property] === 'object' && properties[property].file) {
        properties[property] = properties[property].file
        imgProps.push(property)
      }
    })

    const id = await addInventory(name, properties, imgProps)
    setInventory([
      ...inventory,
      {
        $id: id,
        name: name,
        properties: JSON.stringify(properties)
      }
    ])
    form.resetFields()
    setCurrentData(null)
    success('Added Successfully')
    setOpen(false)
  }

  const onEditInventory = async (name: string, values: any) => {
    const properties = values
    delete properties['name']
    const imgProps: string[] = []

    console.log(properties)

    Object.keys(properties).map((property) => {
      if (typeof properties[property] === 'object' && properties[property].file) {
        properties[property] = properties[property].file
        imgProps.push(property)
      }
    })

    const data = await updateInventory(currentData.$id, name, properties, imgProps)
    setInventory([
      ...inventory.map((item: any) => {
        if (item.$id === currentData.$id) {
          return data
        } else {
          return item
        }
      })
    ])
    form.resetFields()
    setCurrentData(null)
    success('Updated Successfully')
    setOpen(false)
  }


  return (
    <>
      {contextHolder}
      <Space wrap style={{ padding: 40 }}>
        <Button type="primary" onClick={() => {
          form.resetFields()
          setCurrentData(null)
          setOpen(true)
        }}>
          Add
        </Button>
        <Link href="/properties">Properties</Link>
      </Space>
      <Drawer
        title={`${currentData ? "Edit" : 'Add'} Item`}
        closable={false}
        onClose={() => setOpen(false)}
        open={open}
        size='large'
      >
        <Form
          form={form}
          onFinish={(values) => currentData ? onEditInventory(values.name, values) : onAddInventory(values.name, values)}
        >
          <Form.Item name={'name'} label={'Name'} rules={[{ required: true, message: 'Please input Item Name!' }]}>
            <Input />
          </Form.Item>
          {
            columnsData.map((column: any) => {
              return (
                <Form.Item name={column.name} label={column.name}>
                  {generateField(column)}
                </Form.Item>
              )
            })
          }

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      <Table style={{ padding: 20 }} columns={columns} dataSource={inventory} />
    </>
  )

};

export default App;