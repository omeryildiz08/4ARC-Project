import React,{useState} from 'react'
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const {Item} = Form;
function MemberForm({teamId}) {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
        const memberData = {
          Name: values.Name,
          Role: values.Role,
          TeamId: teamId,
        };
  
        // Member'ı ekle
        const response = await axios.post('https://localhost:7216/api/Member', memberData);
        message.success('Üye başarıyla eklendi!');
        form.resetFields();
      } catch (error) {
        console.error(error);
        message.error('Bir hata oluştu!');
      }
  }
  

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h2>Yeni Üye Ekle</h2>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Item name="Name" label="Üye Adı" rules={[{ required: true }]}>
            <Input placeholder="Üye adı" />
          </Item>
          <Item name="Role" label="Rol" rules={[{ required: true }]}>
            <Input placeholder="Rol" />
          </Item>
          <Item>
            <Button type="primary" htmlType="submit">Üye Ekle</Button>
          </Item>
        </Form>
      </div>
  )
}

export default MemberForm