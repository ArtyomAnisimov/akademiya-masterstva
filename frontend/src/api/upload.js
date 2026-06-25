<<<<<<< HEAD
import apiClient from './client';

export const uploadImage = async (file, type = 'content') => {
  const formData = new FormData();
  formData.append('image', file);

  console.log('📤 Отправка на сервер:');
  console.log('  - файл:', file.name);
  console.log('  - тип:', type);

  // ПЕРЕДАЕМ ТИП В QUERY ПАРАМЕТРЕ
  const response = await apiClient.post(`/upload/image?type=${type}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data;
};

export const deleteImage = async (url) => {
  const response = await apiClient.delete('/upload/image', { data: { url } });
  return response.data;
=======
import apiClient from './client';

export const uploadImage = async (file, type = 'content') => {
  const formData = new FormData();
  formData.append('image', file);

  console.log('📤 Отправка на сервер:');
  console.log('  - файл:', file.name);
  console.log('  - тип:', type);

  // ПЕРЕДАЕМ ТИП В QUERY ПАРАМЕТРЕ
  const response = await apiClient.post(`/upload/image?type=${type}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data;
};

export const deleteImage = async (url) => {
  const response = await apiClient.delete('/upload/image', { data: { url } });
  return response.data;
>>>>>>> 1c6164c7b8cd6ec8ce3f3de3a0d18819aa26465c
};