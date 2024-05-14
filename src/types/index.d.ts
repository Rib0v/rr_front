type Advert = {
    id: number;
    name: string;
    price: string;
    photo: string;
    created_at: string;
};

type AdvertDetail = {
    name: string;
    price: string;
    photo: string;
    description?: string;
    photos?: string[];
};

type Query = {
    sort?: string;
    page?: number;
};
