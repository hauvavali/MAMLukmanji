'use client'
import { PlusOutlined } from '@ant-design/icons';
import type { DrawerProps, InputRef } from 'antd';
import { Button, Divider, Drawer, Form, Input, Select, Space, Table, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useRef, useState } from 'react';
import { getColumns, addColumn, deleteColumn, updateColumn } from '../../lib/columnHelpers'
import Link from 'next/link'


let index = 0;

const Columns: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(['jack', 'lucy']);
  const [name, setName] = useState('');
  const inputRef = useRef<InputRef>(null);
  const [form] = Form.useForm();
  const typeWatch = Form.useWatch('column_type', form);
  const [columnsData, setColumnsData] = useState<any>([])
  const [currentData, setCurrentData] = useState<any>(null)
  const [messageApi, contextHolder] = message.useMessage();

  const fetchColumns = async () => {
    const data = await getColumns()
    setColumnsData([...data])
  }

  useEffect(() => {
    fetchColumns()
  }, [])


  const success = (message: string) => {
    messageApi.open({
      type: 'success',
      content: message,
    });
  };


  const columns: ColumnsType<any> = [

    {
      title: 'No.',
      dataIndex: 'key',
      key: 'key',
      render: (text, record, index) => index + 1,

    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text) => <div style={{ textTransform: 'capitalize' }}>{text}</div>
    },
    {
      title: 'Action',
      dataIndex: '$id',
      key: '$id',
      render: (_, record) => {
        return (
          <Space size={'large'}>
            <Popconfirm
              title="Delete the property"
              description="Are you sure to delete this property?"
              onConfirm={() => {
                deleteColumn(record.$id!)
                setColumnsData([
                  ...columnsData.filter((column: any) => column.$id !== record.$id),
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
                column_name: record.name || '',
                column_type: record.type || '',
                dropdown_values: record.dropdown_values || [],
              })
              setOpen(true)
            }}>Edit</Button>
          </Space>
        )
      }
    },
  ];



  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const onAddColumn = async (values: any) => {
    const id = await addColumn(values.column_name, values.column_type, values.dropdown_values || [], values.image || null)
    setColumnsData([
      ...columnsData,
      {
        $id: id,
        name: values.column_name,
        type: values.column_type,
        dropdown_values: values.dropdown_values || [],
        image: values.image || null
      }
    ])
    form.resetFields()
    setCurrentData(null)
    success('Added Successfully')
    setOpen(false)
  }

  const onEditColumn = (values: any) => {
    updateColumn(currentData.$id, values.column_name, values.column_type, values.dropdown_values || [], values.image || null)
    setColumnsData([
      ...columnsData.map((column: any) => {
        if (column.$id === currentData.$id) {
          return {
            $id: currentData.$id,
            name: values.column_name,
            type: values.column_type,
            dropdown_values: values.dropdown_values || [],
            image: values.image || null
          }
        } else {
          return column
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
        <Link href="/">Inventory</Link>
      </Space>
      <Drawer
        title={`${currentData ? "Edit" : 'Add'} Property`}
        closable={false}
        onClose={() => {
          setCurrentData(null)
          setOpen(false)
        }}
        open={open}
        size='large'
      >
        <Form
          form={form}
          onFinish={(values) => currentData ? onEditColumn(values) : onAddColumn(values)}
        >
          <Form.Item name='column_name' label="Property Name" rules={[{ required: true, message: 'Please input Property Name!' }]}>
            <Input />
          </Form.Item>

          <Form.Item name='column_type' label="Property Type" rules={[{ required: true, message: 'Please input Property Type!' }]}>
            <Select
              options={[
                { value: 'text', label: 'Text' },
                { value: 'number', label: 'Number' },
                { value: 'dropdown', label: 'Dropdown' },
                { value: 'image', label: 'Image' },
              ]}
            />
          </Form.Item>

          {typeWatch === "dropdown" && <Form.Item name='dropdown_values' label="Values" rules={[{ required: true, message: 'Please input Property Values!' }]}>
            <Select
              placeholder="Dropdown Values"
              mode="tags"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <Space style={{ padding: '0 8px 4px' }}>
                    <Input
                      placeholder="Please enter item"
                      ref={inputRef}
                      value={name}
                      onChange={onNameChange}
                    />
                    <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                      Add item
                    </Button>
                  </Space>
                </>
              )}
              options={items.map((item) => ({ label: item, value: item }))}
            />
          </Form.Item>
          }

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      <Table style={{ padding: 20 }} columns={columns} dataSource={columnsData} />
    </>
  );

};




export default Columns;