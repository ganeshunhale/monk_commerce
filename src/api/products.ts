import axios from 'axios';
import { Product } from '../types/product';

const API_URL = 'https://stageapi.monkcommerce.app/task/products';
const API_KEY = ''; // API key will be provided separately not shared via email

export const searchProducts = async (
  searchTerm: string,
  page: number = 1,
): Promise<Product[]> => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: {
        search: searchTerm,
        page,
      },
      headers: {
        'x-api-key': API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    // For development, return mock data 
    return getMockProducts();
  }
};

// I am using Mock data for development purposes
const getMockProducts = (): Product[] => {
  return [
    {
        "id": 77,
        "title": "Fog Linen Chambray Towel - Beige Stripe",
        "variants": [
            {
                "id": 1,
                "product_id": 77,
                "title": "XS / Silver",
                "price": "49"
            },
            {
                "id": 2,
                "product_id": 77,
                "title": "S / Silver",
                "price": "49"
            },
            {
                "id": 3,
                "product_id": 77,
                "title": "M / Silver",
                "price": "49"
            }
        ],
        "image": {
            "id": 266,
            "product_id": 77,
            "src": "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/77/images/266/foglinenbeigestripetowel1b.1647248662.386.513.jpg?c=1"
        }
    },
    {
        "id": 80,
        "title": "Orbit Terrarium - Large",
        "variants": [
            {
                "id": 64,
                "product_id": 80,
                "title": "Default Title",
                "price": "109"
            }
        ],
        "image": {
            "id": 272,
            "product_id": 80,
            "src": "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/80/images/272/roundterrariumlarge.1647248662.386.513.jpg?c=1"
        }
    }
]



};