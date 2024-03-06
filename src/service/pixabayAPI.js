import axios from 'axios';

const API_KEY = '31000801-179358ed9db1a9fc0904af43d';
const BASE_URL = 'https://pixabay.com/api/';
export const fetchImages = async ({ query, page }) => {
  const { data } = await axios.get(`${BASE_URL}`, {
    params: {
      key: API_KEY,
      q: query,
      page,
      per_page: 12,
      image_type: 'photo',
      orientation: 'horizontal',
    },
  });
  return data;
};
