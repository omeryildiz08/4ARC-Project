import React,{useState} from 'react'
import { Form, Input, DatePicker, Button, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const { Item } = Form;

function TeamProjectCreateForm() {
  //takım adı girilecek
  //Proje adı ve aşama tarihleri (Dev, Test, UAT, Prod) girilecek
  //submit ile hem takım hem proje birlikte apiye post edilecek

  const [form] = Form.useForm();
  const onFinish = async (values) => {
    try {
      // 1. Önce Takımı Ekle
      const teamRes = await axios.post('https://localhost:7216/api/Teams', {
        TeamName: values.TeamName
      });
      console.log("Team Response:", teamRes.data); 
      const teamId = teamRes.data.teamId;
      
      console.log("Gönderilen Proje Verisi:", {
        projectName: values.ProjectName,
        teamId: teamId,
        DevDate: values.DevDate.toISOString(),
        TestDate: values.TestDate.toISOString(),
        UATDate: values.UATDate.toISOString(),
        ProdDate: values.ProdDate.toISOString()
      });
      // 2. Ardından Projeyi Ekle
      await  axios.post('https://localhost:7216/api/Projects', {
        ProjectName: values.ProjectName,
        TeamId: teamId,
        DevDate: values.DevDate.toDate().toISOString(),
        TestDate: values.TestDate.toDate().toISOString(),
        UATDate: values.UATDate.toDate().toISOString(),
        ProdDate: values.ProdDate.toDate().toISOString()
      });

      message.success('Takım ve proje başarıyla oluşturuldu!');
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error('Bir hata oluştu!');
    }
  };
    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h2>Yeni Takım ve Proje Oluştur</h2>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Item name="TeamName" label="Takım Adı" rules={[{ required: true }]}>
            <Input placeholder="Örn: Frontend Ekibi" />
          </Item>
          <Item name="ProjectName" label="Proje Adı" rules={[{ required: true }]}>
            <Input placeholder="Örn: Web Uygulaması" />
          </Item>
          <Item name="DevDate" label="Dev Tarihi" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Item>
          <Item name="TestDate" label="Test Tarihi" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Item>
          <Item name="UATDate" label="UAT Tarihi" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Item>
          <Item name="ProdDate" label="Prod Tarihi" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Item>
          <Item>
            <Button type="primary" htmlType="submit">
              Kaydet
            </Button>
          </Item>
        </Form>
      </div>
  )
}


export default TeamProjectCreateForm