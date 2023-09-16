'use client'
import React, { useState } from 'react';
import type { DrawerProps, RadioChangeEvent } from 'antd';
import { Button, Space, Table,Drawer,Checkbox, Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
  key: number;
  name: string;
}

const columns: ColumnsType<DataType> = [

  {
    title: 'Key',
    dataIndex: 'key',
    key: 'key',
    render: (text) => <a>{text}</a>,

  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },

];

const data: DataType[] = [
  {
    key: 1,
    name: 'Column 1',
  },
  {
    key: 2,
    name: 'Column 2'
  },
  {
    key: 3,
    name: 'Column 3'
  },
];

const App: React.FC = () =>{
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<DrawerProps['placement']>('left');

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onChange = (e: RadioChangeEvent) => {
    setPlacement(e.target.value);
  };

  return (
    <>
     <Space wrap style={{padding:40}}>
        
        <Button type="primary" onClick={showDrawer}>
          Add
        </Button>
      </Space>
      <Drawer
        title="Add new column"
        placement={placement}
        closable={false}
        onClose={onClose}
        open={open}
        key={placement}
      >
        <Form>
        <Form.Item label="Column Name">
          <Input />
        </Form.Item>
         
        <Space wrap> <Button type="primary"> Submit </Button></Space><br/>
        </Form>
      </Drawer>

      <Table style={{padding:20}} columns={columns} dataSource={data}/>
    </>
  );

};   




export default App;